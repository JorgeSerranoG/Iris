import argparse
import json
import random
import string
import time
from datetime import datetime, timezone

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def rand_str(n: int) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(random.choice(alphabet) for _ in range(n))

def build_payload(device_id: str, tenant_id: str, seq: int, approx_size: int) -> dict:
    base = {
        "ts": now_iso(),
        "tenant_id": tenant_id,
        "device_id": device_id,
        "seq": seq,
        "metrics": {
            "temp_c": round(random.uniform(15, 35), 2),
            "humidity_pct": round(random.uniform(20, 90), 2),
            "battery_v": round(random.uniform(3.2, 4.2), 3),
            "rssi_dbm": random.randint(-95, -30),
        },
        "status": random.choice(["OK", "WARN", "ALARM"]),
    }

    # Relleno opcional para simular payloads grandes (sin romper JSON)
    if approx_size and approx_size > 0:
        # Ajuste grosero: añadimos un campo "extra" hasta aproximarnos
        s = json.dumps(base, separators=(",", ":"))
        remaining = max(0, approx_size - len(s) - 20)
        if remaining > 0:
            base["extra"] = rand_str(remaining)

    return base

def mqtt_publish_loop(args):
    try:
        import paho.mqtt.client as mqtt
    except ImportError:
        raise SystemExit("Instala paho-mqtt: pip install paho-mqtt")

    topic = args.topic or f"tenant/{args.tenant_id}/device/{args.device_id}/telemetry"

    client = mqtt.Client(client_id=args.client_id or f"sim-{args.device_id}")
    if args.username is not None:
        client.username_pw_set(args.username, args.password)

    client.connect(args.host, args.port, keepalive=60)
    client.loop_start()

    seq = 0
    interval = 1.0 / args.hz if args.hz > 0 else args.interval

    try:
        while True:
            payload = build_payload(args.device_id, args.tenant_id, seq, args.size)
            data = json.dumps(payload, separators=(",", ":"))
            client.publish(topic, data, qos=args.qos, retain=args.retain)
            if args.verbose:
                print(f"[MQTT] topic={topic} bytes={len(data)} seq={seq}")
            seq += 1

            # jitter opcional (porcentaje del intervalo)
            if args.jitter_pct:
                jitter = interval * (args.jitter_pct / 100.0) * random.uniform(-1, 1)
            else:
                jitter = 0.0

            time.sleep(max(0.0, interval + jitter))
    except KeyboardInterrupt:
        pass
    finally:
        client.loop_stop()
        client.disconnect()

def http_post_loop(args):
    try:
        import requests
    except ImportError:
        raise SystemExit("Instala requests: pip install requests")

    url = args.url
    if not url:
        raise SystemExit("Para modo HTTP, indica --url")

    interval = 1.0 / args.hz if args.hz > 0 else args.interval
    seq = 0

    headers = {"Content-Type": "application/json"}
    if args.api_key:
        headers["x-api-key"] = args.api_key

    try:
        while True:
            payload = build_payload(args.device_id, args.tenant_id, seq, args.size)
            r = requests.post(url, json=payload, headers=headers, timeout=10)
            if args.verbose:
                print(f"[HTTP] {r.status_code} seq={seq}")
            seq += 1

            if args.jitter_pct:
                jitter = interval * (args.jitter_pct / 100.0) * random.uniform(-1, 1)
            else:
                jitter = 0.0

            time.sleep(max(0.0, interval + jitter))
    except KeyboardInterrupt:
        pass

def main():
    p = argparse.ArgumentParser(description="IoT JSON telemetry simulator (MQTT/HTTP)")
    p.add_argument("--mode", choices=["mqtt", "http"], default="mqtt")
    p.add_argument("--tenant-id", default="tenantA")
    p.add_argument("--device-id", default="device001")

    # ritmo
    p.add_argument("--hz", type=float, default=0.0, help="envíos por segundo (si > 0, ignora --interval)")
    p.add_argument("--interval", type=float, default=1.0, help="segundos entre envíos")
    p.add_argument("--jitter-pct", type=float, default=0.0, help="jitter porcentual sobre el intervalo")
    p.add_argument("--size", type=int, default=0, help="tamaño aproximado del JSON en bytes (0 = sin forzar)")

    p.add_argument("--verbose", action="store_true")

    # MQTT
    p.add_argument("--host", default="localhost")
    p.add_argument("--port", type=int, default=1883)
    p.add_argument("--topic", default="")
    p.add_argument("--qos", type=int, choices=[0, 1, 2], default=0)
    p.add_argument("--retain", action="store_true")
    p.add_argument("--client-id", default="")
    p.add_argument("--username", default=None)
    p.add_argument("--password", default=None)

    # HTTP
    p.add_argument("--url", default="")
    p.add_argument("--api-key", default="")

    args = p.parse_args()

    if args.mode == "mqtt":
        mqtt_publish_loop(args)
    else:
        http_post_loop(args)

if __name__ == "__main__":
    main()
