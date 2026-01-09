import * as React from "react";

export function useTelemetryEventsToLogs(args: {
  isDeviceConnected: boolean;
  maxTempNum: number | null;
  minTempNum: number | null;
  maxDanger: boolean;
  minDanger: boolean;
  pushLog: (msg: string) => void;
}) {
  const {
    isDeviceConnected,
    maxTempNum,
    minTempNum,
    maxDanger,
    minDanger,
    pushLog,
  } = args;

  const prevConnectedRef = React.useRef<boolean>(false);
  const prevMaxRef = React.useRef<number | null>(null);
  const prevMinRef = React.useRef<number | null>(null);
  const prevMaxDangerRef = React.useRef<boolean>(false);
  const prevMinDangerRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (prevConnectedRef.current !== isDeviceConnected) {
      pushLog(
        isDeviceConnected ? "Dispositivo conectado" : "Dispositivo desconectado"
      );
      prevConnectedRef.current = isDeviceConnected;
    }

    if (
      maxTempNum != null &&
      (prevMaxRef.current == null || maxTempNum > prevMaxRef.current)
    ) {
      pushLog(`Nueva temperatura máxima registrada: ${maxTempNum.toFixed(2)} °C`);
      prevMaxRef.current = maxTempNum;
    }

    if (
      minTempNum != null &&
      (prevMinRef.current == null || minTempNum < prevMinRef.current)
    ) {
      pushLog(`Nueva temperatura mínima registrada: ${minTempNum.toFixed(2)} °C`);
      prevMinRef.current = minTempNum;
    }

    if (prevMaxDangerRef.current !== maxDanger) {
      pushLog(
        maxDanger
          ? "Se ha superado la temperatura máxima establecida"
          : "Temperatura máxima vuelve a rango normal"
      );
      prevMaxDangerRef.current = maxDanger;
    }

    if (prevMinDangerRef.current !== minDanger) {
      pushLog(
        minDanger
          ? "Temperatura por debajo de la mínima establecida"
          : "Temperatura mínima vuelve a rango normal"
      );
      prevMinDangerRef.current = minDanger;
    }
  }, [isDeviceConnected, maxTempNum, minTempNum, maxDanger, minDanger, pushLog]);
}
