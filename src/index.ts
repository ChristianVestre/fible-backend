import { ApolloServer } from 'apollo-server-express';
import resolvers from './resolvers/resolvers';
import typeDefs from './schema/schema'
import express from 'express';
import passport from 'passport';
import session from 'express-session'
import uuid from 'uuid/v4';
import redis from 'redis';
import initPassport from './initPassport'
import cors from 'cors'
// @ts-ignore
import {buildContext} from 'graphql-passport';
const passwords = require('../passwords.json')


const app = express()
let RedisStore = require('connect-redis')(session)
const PORT = process.env.PORT || 8000




const SESSION_SECRECT = 'bad secret';

initPassport();

const client = redis.createClient({
    port:14082,
    host:'redis-14082.c55.eu-central-1-1.ec2.cloud.redislabs.com',
    password: passwords.redis
})

const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true,
  };
  app.use(cors(corsOptions));

  
  app.use(session({
    genid: (req) => uuid(),
    store: new RedisStore({ client,ttl:1000*60*60*2 }),
    name:"qid",
    secret: SESSION_SECRECT,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly:true,
 //       secure: process.env.NODE_ENV == 'production',
        maxAge: 1000 *60 *60 *2 }
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req ,res }) => (
        buildContext({ req, res })),
    playground: {
      settings: {
        'request.credentials': 'same-origin',
      },
    },
    introspection:true
  });
  
  server.applyMiddleware({ app, cors: false });
  
  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
/*
const server = new ApolloServer ({
    typeDefs,
    resolvers,
    context:{
        db: database
    },
    playground: true,
	introspection:true
})
server.applyMiddleware({ app, path: `/${graphqlPath}` })
//app.listen({ port: process.env.PORT || 5000 }).then(({url}) => {
  //  console.log(`🚀 Server ready at ${url}`)
//});
var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true // <-- REQUIRED backend setting
  };
  app.use(cors(corsOptions));
app.listen(PORT, () => console.log(`graphql listening on port ${PORT}`))
*/