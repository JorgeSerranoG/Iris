import type { ActionFunctionArgs } from "react-router";

type TelemetryMessage = any;

let buffer: TelemetryMessage[] = [];
const MAX_BUFFER = 500;

export async function action({ request }: ActionFunctionArgs) {
  try {
    const msg = (await request.json()) as TelemetryMessage;

    buffer.push(msg);
    if (buffer.length > MAX_BUFFER) {
      buffer.splice(0, buffer.length - MAX_BUFFER);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function loader() {
  return new Response(JSON.stringify({ ok: true, buffered: buffer.length }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export function _getTelemetryBuffer() {
  return buffer;
}
