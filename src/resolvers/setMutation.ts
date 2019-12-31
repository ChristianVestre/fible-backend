import {indexwithpipeline, update, indexRoutes }from './../db/db'
import uuid = require('uuid')
import cookie  from 'cookie'
import { findHtype } from '../helperFunction';

var now = new Date();   
export default  {
    setRoute: async (_:any,{route}:any,context:any) => {
        route = JSON.parse(route)
        console.log(route)
        let newRoute = {
            id:route.id,
            ownerid: context.getUser().id,
            ownername:context.getUser().name,
            name:route.name,
            image:"",
            stops:[],
            pois:[],
            components:[],
            locations:[],
            lasteditat:now,
            createdat:now
        }
        indexRoutes(newRoute)
        const body = {
            "script" : {
                "source": "if (ctx._source.routes == null) {ctx._source.routes = new ArrayList();} ctx._source.routes.add(params.route);",
                "lang": "painless",
                "params" : {
                    "route" : route.id
                }
            }
        }
        
        try{
        await update(body, 'users',context.getUser().id)
        } catch(error){
            console.log(error)
        }


        return route
    },
    setStop: async (_:any,{stop}:any,context:any) => {
        stop = JSON.parse(stop)
        console.log(stop)
        let newStop = {
            id:stop.id,
            ownerid: context.getUser().id,
            ownername:context.getUser().name,
            parentids:[],
            name: stop.name,
            image:"",
            pois:[],
            order:[],
            components:[],
            location:[],
            lasteditat:now,
            createdat:now
        }
        indexwithpipeline(newStop,'stops','rename_id')
        const body = {
            "script" : {
                "source": "if (ctx._source.stops == null) {ctx._source.stops = new ArrayList();} ctx._source.stops.add(params.stop);",
                "lang": "painless",
                "params" : {
                    "stop" : stop.id
                }
            }
        }
        update(body, 'users',context.getUser().id)
    },
    setPoi: async (_:any,{poi}:any,context:any) => {
        poi = JSON.parse(poi)
        console.log(poi)
        let newPoi = {
            id:poi.id,
            ownerid: context.getUser().id,
            ownername:context.getUser().name,
            type:poi.type,
            parentids:[],
            name: poi.name,
            image:"",
            order:[],
            components:[],
            location:[],
            lasteditat:now,
            createdat:now
        }
        indexwithpipeline(newPoi,'pois','rename_id')
        const body = {
            "script" : {
                "source": "if (ctx._source.pois == null) {ctx._source.pois = new ArrayList();} ctx._source.pois.add(params.stop);",
                "lang": "painless",
                "params" : {    
                    "stop" : poi.id
                }
            }
        }
        update(body, 'users',context.getUser().id)
    },
    setComponent:async (_:any,{parentHtype, component}:any,context:any) => {
        console.log(parentHtype)
        console.log(component)
        parentHtype = JSON.parse(parentHtype)
        component = JSON.parse(component)
        const type = findHtype(parentHtype.id)
        const user = context.getUser()
        try{
        await update({
            doc: {
                components:parentHtype.components,
                lasteditat:now
            }}
        ,type,parentHtype.id)
        } catch(error) {
            console.error(error)
        }
        try{
            await indexwithpipeline({
                id: component.id,
                ownerid:user.id,
                ownername:user.name,
                parentid:parentHtype.id,
                content:JSON.parse(component.content),
                type:component.type,
                lasteditat:now,
                createdat:now,
                }
        ,'components','rename_id')
            }catch(error){console.error(error)}
        return true
    }
   /* setComponent: async (_:any,args:any,context:any) => {
          const htypeid = cookie.parse(context.req.headers.cookie).hid || args.parentid
          const content = JSON.parse(args.content.split("'").join('"'))
          const componentId = "cp_" + uuid()
          const component ={
            id: componentId,
            content:content,
            type:args.type,
            ownerid: context.getUser().id,
            ownername:context.getUser().name,
            parentid:htypeid,
            lasteditat:now,
            createdat:now
        }
        await indexwithpipeline(component,'components','rename_id')
        console.log(component)
        let body = {
            "script" : {
                "source": "if (ctx._source.components == null) {ctx._source.components = new ArrayList();} ctx._source.components.add(params.component);",
                "lang": "painless",
                "params" : {
                    "component" : componentId
                }
            }
        }
        update(body, 'routes',htypeid)
        return component
      },*/
}