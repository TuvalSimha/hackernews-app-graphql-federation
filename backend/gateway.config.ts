import { defineConfig } from "@graphql-hive/gateway";

export const gatewayConfig = defineConfig({
  landingPage: true,
  graphiql: true,
  cors: true,
  supergraph: {
    type: "hive",
    endpoint:
      "https://cdn.graphql-hive.com/artifacts/v1/f133ba73-44d2-435a-8d44-aed29bb0ae3c",
    key: process.env.HIVE_CDN_KEY ?? "",
  },
});
