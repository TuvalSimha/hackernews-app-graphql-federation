import { startSubgraphs } from "./subgraph";

// 1. Start all subgraphs in monolith mode
async function main() {
  await startSubgraphs();
}

// 2. Start the main function
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
