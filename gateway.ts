import { createYoga } from "graphql-yoga";
import { createServer } from "http";
import { getLinkSubGraph } from "./subgraphs/Link";
import { getCommentsSubGraph } from "./subgraphs/Comment";

// 1. List all subgraphs that we define in subgraphs folder and we want to start in monolith mode
export const MY_SUBGRAPHS = [
  {
    name: "link",
    getSchema: getLinkSubGraph,
  },
  {
    name: "comment",
    getSchema: getCommentsSubGraph,
  },
];

// 2. Get the schema of a subgraph by its name
const getSubgraphSchemaBySubgraphName = (subgraphName: string) =>
  MY_SUBGRAPHS.find((it) => it.name === subgraphName);

// 3. Start all subgraphs - each subgraph will be started on a different port
export const startSubgraphs = async (httpPort?: number) => {
  console.info("Starting subgraphs... 🚀");

  for (const subgraph of MY_SUBGRAPHS) {
    const subgraphConfig = getSubgraphSchemaBySubgraphName(subgraph.name);
    const schema = subgraphConfig?.getSchema();

    // 3.1. Create a new instance of Yoga server for each subgraph
    const yoga = createYoga({
      schema,
      graphiql: true,
      landingPage: false,
      cors: true,
      graphqlEndpoint: `/${subgraph.name}/graphql`,
      context: async ({ request }) => ({
        headers: Object.fromEntries(request.headers),
      }),
    });

    // 3.2. Start the server on a different port for each subgraph
    const server = createServer(yoga);

    // 3.3. Calculate the port for the subgraph
    const port = Number(httpPort) + MY_SUBGRAPHS.indexOf(subgraph);

    // 3.4.  Start the Yoga server
    await new Promise<void>((resolve) => {
      server.listen(port, () => {
        console.log(
          `Setting up [${subgraph.name}] subgraph at http://localhost:${port}/${subgraph.name}/graphql`,
        );
        resolve();
      });
    });
  }

  console.info("Subgraphs started! 🎉");
};
