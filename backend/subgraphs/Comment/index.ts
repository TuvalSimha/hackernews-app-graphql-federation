import { parse } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { resolvers } from "./resolver";
import { GraphQLContext } from "../../prisma";

const currentDirname = dirname(fileURLToPath(import.meta.url));
const typeDefs = parse(
  readFileSync(resolve(currentDirname, "schema.graphql"), "utf8"),
);

export const getCommentsSubGraph = () =>
  buildSubgraphSchema([{ typeDefs, resolvers }]);

export async function createCommentContext(prisma: GraphQLContext["prisma"]) {
  return { prisma };
}
