import Express from "express";
import graphqlHTTP from "express-graphql"; // ES6
// import schema from "./schema/schema.js";
import schema from "./schema/schemaWithMongoDB.js";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

const app = new Express();

app.use(cors());

mongoose.connect(
  "mongodb+srv://Talha:Talha1234@cluster0.lkdbo.mongodb.net/MyData?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("DB connected")
);

//setting middleware
const __dirname = path.resolve();
app.use("/static", Express.static(path.join(__dirname, "public")));

app.use(
  "/graphql",
  graphqlHTTP.graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("server runing  at 4000");
});

export default app;
//
