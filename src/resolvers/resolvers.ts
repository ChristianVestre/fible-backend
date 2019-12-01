//const imports = require('./db.js');
const bcrypt = require('bcrypt');
import {search, indexUser, indexRoutes,update} from '../db/db'
import uuid from 'uuid/v4'
import { duplicateVariableMessage } from 'graphql/validation/rules/UniqueVariableNames';
import updateMutations from './updateMutations'
import getQueries from './getQueries'
import setMutation from './setMutation'



const saltRounds = 4;
//console.log(imports)
export default  {
    Query: {
        me: (_:any, __:any, context:any) => {
        return context.getUser()
        },
        ...getQueries
    },
    Mutation: {
        setUser: async (_:any,args:any,context:any) => {
            let data = {
                    id:args.id,
                    name:args.name,
                    password:await bcrypt.hash(args.password, saltRounds),
                    ROUTES:[""],
                    STOPS:[""],
                    POIS:[""],
                    email:args.email.toLowerCase(),
            }
            let confirmation = await indexUser({
                index: 'users',
                pipeline: 'rename_id',
                body: data
            })
            return data
        },
        setRoute: async (_:any,args:any,context:any) => {
            const routeId = uuid()
            let route = {
                id:routeId,
                owner: context.getUser().id,
                ownername:context.getUser().name,
                name: "",
                image:"",
                STOPS:[""],
                POIS:[""],
                order:[""],
                components:[""],
                images:[""],
                location:[""],
            }
            indexRoutes(route)
           // console.log(context.getUser().id)
            const body = {
                "script" : {
                    "source": "if (ctx._source.ROUTES == null) {ctx._source.ROUTES = new ArrayList();} ctx._source.ROUTES.add(params.route);",
                    "lang": "painless",
                    "params" : {
                        "route" : context.getUser().id
                    }
                }
            }
            update(body, 'users',context.getUser().id)
            return route
        },
        login: async (_:any, { email, password }:any, context:any) => {

            const { user } = await context.authenticate('graphql-local', { email, password });
            context.login(user)
            return { user }
          },
          logout: (_:any, args:any, context:any) => context.logout(),
          signup: async (_:any, { name, email, password }:any, context:any) => {
            const existingUsers = await search({
                "query": {
                "term": {
                    "email.keyword": {
                        "value": email,
                        "boost": 1.0
                    }
                }
            }
        }, 'users')
            if (existingUsers.body.hits.hits[0] != undefined) {
              throw new Error('User with email already exists');
            }
            const newUser = {
                id:uuid(),
                name:name,
                password:await bcrypt.hash(password, saltRounds),
                ROUTES:null,
                STOPS:null,
                POIS:null,
                email:email.toLowerCase(),
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