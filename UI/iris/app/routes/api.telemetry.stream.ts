import { _getTelemetryBuffer } from "./api.telemetry";

export async function loader() {
  const encoder = new TextEncoder();

  let lastIdx = 0;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(`event: hello\ndata: {}\n\n`));

      const flush = () => {
        const buf = _getTelemetryBuffer();

        while (lastIdx < buf.length) {
          const data = JSON.stringify(buf[lastIdx++]);
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
      };

      const interval = setInterval(flush, 300);

      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(`: ping\n\n`));
      }, 15000);

      return () => {
        clearInterval(interval);
        clearInterval(keepAlive);
      };
    },
    cancel() {},
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
