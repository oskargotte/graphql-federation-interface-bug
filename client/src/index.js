import React from "react";
import { createRoot } from "react-dom/client";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import App from "./App.js";

const httpLink = createHttpLink({
  uri: "http://127.0.0.1:4000",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const root = createRoot(document.getElementById("root"));

root.render(
  <ApolloProvider client={client}>
    <div style={{ padding: 20 }}>
      <App />
    </div>
  </ApolloProvider>,
);
