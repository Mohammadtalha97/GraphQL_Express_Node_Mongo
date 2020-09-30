import graphql from "graphql";
import _ from "lodash";
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;

//BooksData
let books = [
  { name: "Book1", genre: "Fantacy", id: "1", authorId: "1" },
  { name: "Book2", genre: "Fantacy", id: "2", authorId: "2" },
  { name: "Book3", genre: "Sci-Fi", id: "3", authorId: "3" },
  { name: "Book4", genre: "Fantacy", id: "4", authorId: "2" },
  { name: "Book5", genre: "Fantacy", id: "5", authorId: "3" },
  { name: "Book6", genre: "Sci-Fi", id: "6", authorId: "3" },
];

//AuthorsData
let author = [
  { name: "talha", age: 23, id: "1" },
  { name: "shahid", age: 20, id: "2" },
  { name: "swaraj", age: 10, id: "3" },
];

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
        return _.find(author, { id: parent.authorId });
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
        return _.filter(books, { authorId: parent.id });
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
        //code to get data from db/other resource
        return _.find(books, { id: args.id });
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(author, { id: args.id });
      },
    },

    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      },
    },

    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return author;
      },
    },
  },
});

//export
export default new GraphQLSchema({ query: RootQuery });
