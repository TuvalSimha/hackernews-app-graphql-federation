import { createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import { getLinkSubGraph, createLinkContext } from './subgraphs/Link';
import { getCommentsSubGraph, createCommentContext } from './subgraphs/Comment';
import { prisma } from './prisma';

export const MY_SUBGRAPHS = [
  {
    name: 'link',
    getSchema: getLinkSubGraph,
    context: () => createLinkContext(prisma),
  },
  {
    name: 'comment',
    getSchema: getCommentsSubGraph,
    context: () => createCommentContext(prisma),
  },
];

export const startSubgraphs = async () => {
  for (const subgraph of MY_SUBGRAPHS) {
    const schema = subgraph.getSchema();

    const yoga = createYoga({
      schema,
      context: subgraph.context,
      landingPage: false,
      cors: true,
      graphqlEndpoint: `/${subgraph.name}/graphql`,
      graphiql: {
        title: subgraph.name,
      },
    });

    const server = createServer(yoga);
    const port = 4001 + MY_SUBGRAPHS.indexOf(subgraph);

    await new Promise<void>((resolve) => {
      server.listen(port, () => {
        console.log(
          `${subgraph.name} subgraph at http://localhost:${port}/${subgraph.name}/graphql`
        );
        resolve();
      });
    });
  }
  console.info('Subgraphs started! 🎉');
};
