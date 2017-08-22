/**
 * GraphQL 插件
 * http://graphql.org/
 *
 * // app/schema/user.js
 * exports.schema = `
 *   enum ROLE {
 *     STUDENT: 1
 *     PARENT: 2
 *     TEACHER: 3
 *   }
 *
 *   type User {
 *     id: ID!
 *     role: ROLE!
 *     username: String
 *     phone: String
 *   }
 *
 *   extend Query {
 *     userByPhone(phone: String!): User
 *   }
 * `;
 *
 * exports.resolver = {
 *   Query: {
 *     userByPhone(root, params, ctx) {
 *       const { phone } = params;
 *       return ctx.app.knex('users').where({ phone }).first();
 *     }
 *   }
 * };
 *
 * // controller / service / anywhere with ctx
 * ...
 * const phone = "12345678901";
 * const { id, role, username } = await ctx.gql`
 *   {
 *     userByPhone(phone: ${phone}) {
 *       id
 *       role
 *       username
 *     }
 *   }
 * `;
 * ...
 */
const { execute, formatError } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const jsonResolver = require('graphql-type-json');
const gql = require('graphql-tag');
const extend = require('extend2');
const path = require('path');

const defaultConfig = {
  schemaDir: 'app/schema',
  schemaField: 'schema',
  resolverField: 'resolver',
};

const initSchema = `
  scalar JSON
  type Query { app: String! }
  type Mutation { app: String! }
  schema { query: Query, mutation: Mutation }
`;

const initResolver = {
  JSON: jsonResolver,
  Query: { app: () => 'shensz_service' },
  Mutation: { app: () => 'shensz_service' },
};

function loadSchema(app, options) {
  const typeDefs = [initSchema];
  const resolvers = { ...initResolver };
  const loader = new app.loader.FileLoader({
    directory: path.join(app.baseDir, options.schemaDir),
    target: {},
  });
  loader.parse().forEach(({ exports }) => {
    const schema = exports[options.schemaField];
    const resolver = exports[options.resolverField];
    if (schema) typeDefs.push(schema);
    if (resolver) extend(true, resolvers, resolver);
  });
  return {
    typeDefs,
    resolvers,
  };
}

async function graphql(ctx, ...args) {
  const { data, errors } = await execute(
    ctx.app.schema,
    gql(...args),
    null,
    ctx
  );
  if (errors) {
    const throwError = error => {
      const { message, locations: info } = formatError(error);
      ctx.error({
        message,
        error,
        info,
      });
    };
    errors.map(throwError);
  }
  return data;
}

module.exports = app => {
  const config = { ...defaultConfig, ...app.config.graphql };
  Object.defineProperty(app, 'schema', {
    value: makeExecutableSchema(loadSchema(app, config)),
  });
  Object.defineProperty(app.context, 'gql', {
    get() {
      return graphql.bind(null, this);
    },
  });
};
