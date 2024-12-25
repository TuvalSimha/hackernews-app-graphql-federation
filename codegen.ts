import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:4000/graphql",
  documents: ["./client/app/**/*.tsx"],
  ignoreNoDocuments: true,
  generates: {
    "./client/app/__generated__/": {
      preset: "client",
    },
    "./backend/__generated__/types-resolver.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        useIndexSignature: true,
      },
    },
  },
};

export default config;
