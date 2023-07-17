import gql from "graphql-tag";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";

// Don't require a separate MongoDB instance to run
// Note: contents will be wiped when you stop the server
const mongod = new MongoMemoryServer({
    binary: { version: "6.0.0" },
});

// Connect to the local in-memory MongoDB server:
const mongodb = mongod
    .start()
    .then(() => MongoClient.connect(mongod.getUri()))
    .then((connection) => connection.db("graphql"))
    .catch((error) => {
        console.error("Could not connect to MongoDB");
        console.error(error);
        process.exit(1);
    });

const typeDefs = gql`
    type Query {
        helloWorld: String
    }
`;

const resolvers = {
    Query: {
        helloWorld: () => {
            return "Hello World!";
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server).then(({ url }) => {
    console.log(`GraphQL server running: ${url}`);
});
