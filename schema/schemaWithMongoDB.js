import graphql from "graphql";
import Books from "../models/book.js";
import Authors from "../models/author.js";
import _ from "lodash";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

//BookType
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Authors.findById(parent.authorId);
      },
    },
  }),
});

//AuthorType
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    book: {
      //1 author have many book that's why list here
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Books.find({
          authorId: parent.id,
        });
      },
    },
  }),
});

//root query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Books.findById(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Authors.findById(args.id);
      },
    },

    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Books.find({});
      },
    },

    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Authors.find({});
      },
    },
  },
});

//mutation
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        let authorDBObj = new Authors({
          name: args.name,
          age: args.age,
        });

        return authorDBObj.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let bookDBObject = new Books({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });

        return bookDBObject.save();
      },
    },
  },
});

//export
export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

//query
// {
//     book(id: "5f7423a4db6aa167e045ff83") {
//       name
//       genre
//       author {
//         name
//         age
//         book {
//           name
//         }
//       }
//     }
//   }

//query2
// {
//     author(id: "5f742148c213fb3a008af746") {
//       name
//       age
//       book {
//         name
//         genre
//         author {
//           name
//           age
//           id
//         }
//       }
//     }
//   }
