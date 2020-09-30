import graphql from "graphql";
import _ from "lodash";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLSchema,
} = graphql;

let teacher = [
  { id: "1", name: "talha", age: 45 },
  { id: "2", name: "shahid", age: 20 },
  { id: "3", name: "swaraj", age: 30 },
];

let subject = [
  { id: "1", name: "english", teacherID: "1" },
  { id: "2", name: "gujarati", teacherID: "2" },
  { id: "3", name: "sanskrit", teacherID: "3" },
  { id: "4", name: "samaj", teacherID: "1" },
  { id: "5", name: "urdu", teacherID: "1" },
];

//subject type
const SubjectType = new GraphQLObjectType({
  name: "subject",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    teacher: {
      type: TeacherType,
      resolve(parent, args) {
        return _.find(teacher, { id: parent.teacherID });
      },
    },
  }),
});

//teacher type
const TeacherType = new GraphQLObjectType({
  name: "teacher",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    subject: {
      type: new GraphQLList(SubjectType),
      resolve(parent, args) {
        return _.filter(subject, { teacherID: parent.id });
      },
    },
  }),
});

//RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    subject: {
      type: SubjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(subject, { id: args.id });
      },
    },
    teacher: {
      type: TeacherType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(teacher, { id: args.id });
      },
    },
  },
});

export default new GraphQLSchema({ query: RootQuery });
