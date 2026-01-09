import * as React from "react";
import { Pencil } from "lucide-react";
import { Input } from "~/components/ui/input";
import { cx } from "~/lib/cx";

export function DeviceHeader(props: {
  deviceName: string;
  isEditingName: boolean;
  draftName: string;
  onDraftNameChange: (v: string) => void;
  onStartEdit: () => void;
  onCommit: () => void;
  onCancel: () => void;
  isDeviceConnected: boolean;
}) {
  const {
    deviceName,
    isEditingName,
    draftName,
    onDraftNameChange,
    onStartEdit,
    onCommit,
    onCancel,
    isDeviceConnected,
  } = props;

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <Input
              value={draftName}
              onChange={(e) => onDraftNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onCommit();
                if (e.key === "Escape") onCancel();
              }}
              onBlur={onCommit}
              className="h-10 w-90 max-w-full bg-card/30 border-border/60 text-xl font-semibold"
              autoFocus
            />
          ) : (
            <>
              <h1 className="truncate text-4xl font-semibold tracking-tight">
                {deviceName}
              </h1>
              <button
                type="button"
                onClick={onStartEdit}
                className="rounded-md p-1 text-muted-foreground/70 hover:text-muted-foreground hover:bg-card/30 transition-colors"
                aria-label="Editar nombre del dispositivo"
                title="Editar nombre"
              >
                <Pencil className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <span
          className={cx(
            "h-2.5 w-2.5 rounded-full",
            isDeviceConnected ? "bg-emerald-500" : "bg-red-500"
          )}
        />
        <span
          className={cx(
            "text-sm font-medium",
            isDeviceConnected ? "text-emerald-400" : "text-red-400"
          )}
        >
          {isDeviceConnected ? "Conectado" : "Desconectado"}
        </span>
      </div>
    </div>
  );
}