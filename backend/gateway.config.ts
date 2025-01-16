import { defineConfig } from "@graphql-hive/gateway";

export const gatewayConfig = defineConfig({
  landingPage: true,
  graphiql: true,
  cors: true,
  supergraph: {
    type: "hive",
    endpoint: process.env.HIVE_CDN_ENDPOINT ?? "",
    key: process.env.HIVE_CDN_KEY ?? "",
  },
});
