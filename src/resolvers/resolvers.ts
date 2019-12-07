//const imports = require('./db.js');
const bcrypt = require('bcrypt');
import {search, indexUser, indexRoutes,update} from '../db/db'
import uuid from 'uuid/v4'
import { duplicateVariableMessage } from 'graphql/validation/rules/UniqueVariableNames';
import updateMutations from './updateMutations'
import getQueries from './getQueries'
import setMutation from './setMutation'
var now = new Date();   


const saltRounds = 4;
//console.log(imports)
export default  {
    Query: {
        me: (_:any, __:any, context:any) => {
            console.log(context)
            console.log(context.getUser())
        return context.getUser()
        },
        ...getQueries
    },
    Mutation: {
        login: async (_:any, { email, password }:any, context:any) => {

            const { user } = await context.authenticate('graphql-local', { email, password });
            //set lastlogin on the user in elasticsearch
            context.login(user)
            return { user }
          },
          logout: (_:any, args:any, context:any) => context.logout(),
          setUser: async (_:any, { name, email, password }:any, context:any) => {
          const  existingUser = await search({
                "query": {
                "term": {
                    "email": {
                        "value": email,
                        "boost": 1.0
                    }
                }
            }
        }, 'users')
            if (existingUser.body.hits.hits[0] != undefined) {
              throw new Error('User with email already exists');
            } 
            const newUser = {
                id:"uu_"+uuid(),
                name:name,
                password:await bcrypt.hash(password, saltRounds),
                routes:null,
                stops:null,
                pois:null,
                email:email.toLowerCase(),
                lastlogin:now,
                createdat:now
            }
            indexUser(newUser)
            context.login(newUser);
            return { user: newUser };
          },
          ...updateMutations,
          ...setMutation
    }
};



 /*       getUser: async (_:any,args:any) => {
                let test = await search({ query:{match:{id:args.id }}})
                const compare = await bcrypt.compare(args.password, test.body.hits.hits[0]._source.password)
                if(compare == true){
                return test.body.hits.hits[0]._source
                } else {
                return {
                    id:args.id,
                    name:args.name,
                    ROUTES:"",
                    STOPS:"",
                    POIS:"",
                    loggedIn:false,
                }
                }               
        }*/