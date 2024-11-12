const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { buildSubgraphSchema } = require("@apollo/subgraph");

const { readFileSync } = require("fs");
const gql = require("graphql-tag");

const typeDefs = gql(readFileSync("./a-schema.graphql", { encoding: "utf-8" }));

const books = [
  {
    __typename: "Book",
    id: "1",
    title: "TITLE 1",
  },
  {
    __typename: "Book",
    id: "2",
    title: "TITLE 2",
  },
];

const resolvers = {
  Book: {
    __resolveReference: ({ id }) => {
      return books.find((b) => b.id === id);
    },
  },
  Media: {
    __resolveReference: ({ id }) => {
      return books.find((b) => b.id === id);
    },
  },
};

async function startApolloServer() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  const port = 4002;
  const subgraphName = "subgraph-a";

  try {
    const { url } = await startStandaloneServer(server, { listen: { port } });
    console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
  } catch (err) {
    console.error(err);
  }
}

startApolloServer();
