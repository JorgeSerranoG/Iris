import * as React from "react";

export function useDeviceName(deviceId?: string) {
  const initialName = React.useMemo(
    () => (deviceId ? deviceId : "Dispositivo"),
    [deviceId]
  );

  const [deviceName, setDeviceName] = React.useState(initialName);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [draftName, setDraftName] = React.useState(initialName);

  React.useEffect(() => {
    setDeviceName(initialName);
    setDraftName(initialName);
    setIsEditingName(false);
  }, [initialName]);

  const startEdit = React.useCallback(() => setIsEditingName(true), []);

  const commitName = React.useCallback(() => {
    const next = draftName.trim() || "Dispositivo";
    setDeviceName(next);
    setDraftName(next);
    setIsEditingName(false);
  }, [draftName]);

  const cancelName = React.useCallback(() => {
    setDraftName(deviceName);
    setIsEditingName(false);
  }, [deviceName]);

  return {
    deviceName,
    setDeviceName,
    isEditingName,
    setIsEditingName,
    draftName,
    setDraftName,
    startEdit,
    commitName,
    cancelName,
  };
}
