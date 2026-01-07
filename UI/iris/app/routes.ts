import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // RUTAS NAVIGATION
  route("customers", "routes/customers.tsx"),
  route("products", "routes/products.tsx"),
  route("settings", "routes/settings.tsx"),

    // FLUJO OVERVIEW
  route("overview", "routes/overview.products.tsx"),
  route("overview/:productId", "routes/overview.devices.tsx"),
  route("overview/:productId/:deviceId", "routes/overview.dashboard.tsx"),

  // API: HTTP POST + SSE
  route("api/telemetry", "routes/api.telemetry.ts"),
  route("api/telemetry/stream", "routes/api.telemetry.stream.ts"),
] satisfies RouteConfig;
