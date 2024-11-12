const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { buildSubgraphSchema } = require("@apollo/subgraph");

const { readFileSync } = require("fs");
const gql = require("graphql-tag");

const typeDefs = gql(readFileSync("./b-schema.graphql", { encoding: "utf-8" }));

const books = [
  {
    id: "1",
    review: 1,
  },
  {
    id: "2",
    review: 2,
  },
];

const resolvers = {
  Query: {
    topRatedMedia: () => {
      return books;
    },
  },
  Media: {
    __resolveReference: ({ id }, { dataSources }) => {
      return books.find((b) => b.id === id);
    },
  },
};

async function startApolloServer() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  const port = 4001;
  const subgraphName = "subgraph-b";

  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port },
    });

    console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
  } catch (err) {
    console.error(err);
  }
}

startApolloServer();
