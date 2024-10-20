const { ApolloServer } = require("apollo-server");
const neo4j = require("neo4j-driver");
require("dotenv").config();
const typeDefs = require("./schema");

//db connection
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const resolver = {
  Query: {
    users: async () => {
      const session = driver.session();
      try {
        const result = await session.run("MATCH(u:user) RETURN u");
        return result.records.map((record) => record.get("u").properties);
      } finally {
        await session.close();
      }
    },
  },
};

const server = new ApolloServer({typeDefs,resolver});

server.listen({port:process.env.PORT}).then(({url})=>{
    console.log(`🚀 Server ready at ${url}`);
})