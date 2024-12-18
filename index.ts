import { startSubgraphs } from "./gateway";

// 1. Start all subgraphs in monolith mode
async function main() {
  // 1.1. If we are in development mode, we start the subgraphs from port 4001
  let port = undefined;
  if (process.env.NODE_ENV === "dev") {
    // 1.2. We start the subgraphs from port 4001
    port = 4001;
  }
  // 1.3. Start all subgraphs function
  await startSubgraphs(port);
}

// 2. Start the main function
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
