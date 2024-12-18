import { defineConfig } from "@graphql-hive/gateway";

export const gatewayConfig = defineConfig({
  landingPage: true,
  graphiql: true,
  cors: true,
});
