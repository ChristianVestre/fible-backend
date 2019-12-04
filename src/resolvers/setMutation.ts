import {indexwithpipeline, update, indexRoutes }from './../db/db'
import uuid = require('uuid')
import cookie  from 'cookie'

var now = new Date();   
export default  {
    setRoute: async (_:any,{name}:any,context:any) => {
        const routeId = "rt_"+uuid()
        let route = {
            id:routeId,
            ownerid: context.getUser().id,
            ownername:context.getUser().name,
            name:name,
            image:"",
            stops:[null],
            pois:[null],
            components:[null],
            locations:[null],
            lasteditat:now,
            createdat:now
        }
        indexRoutes(route)
        const body = {
            "script" : {
                "source": "if (ctx._source.routes == null) {ctx._source.routes = new ArrayList();} ctx._source.routes.add(params.route);",
                "lang": "painless",
                "params" : {
                    "route" : routeId
                }
            }
        }
        update(body, 'users',context.getUser().id)
        return route
    },
    setStop: async (_:any,args:any,context:any) => {
        const stopId = "st_" + uuid()
        const parentid = args.parentid == undefined ? '': args.parentid
        let stop = {
            id:stopId,
            ownerid: context.getUser().id,
            ownername:context.getUser().name,
            parentids:[parentid],
            name: args.name,
            image:"",
            POIS:[null],
            order:[null],
            components:[null],
            location:[null],
            lasteditat:now,
            createdat:now
        }
        indexwithpipeline(stop,'stops','rename_id')
        const body = {
            "script" : {
                "source": "if (ctx._source.stops == null) {ctx._source.stops = new ArrayList();} ctx._source.stops.add(params.stop);",
                "lang": "painless",
                "params" : {
                    "stop" : stopId
                }
            }
        }
        update(body, 'users',context.getUser().id)
    },
    setPoi: async (_:any,args:any,context:any) => {
        const poiId = "po_" + uuid()
        const parentid = args.parentid == undefined ? '': args.parentid
        let poi = {
            id:poiId,
            ownerid: context.getUser().id,
            ownername:context.getUser().name,
            type:args.type,
            parentids:[parentid],
            name: args.name,
            image:"",
            order:[null],
            components:[null],
            location:[null],
            lasteditat:now,
            createdat:now
        }
        indexwithpipeline(poi,'pois','rename_id')
        const body = {
            "script" : {
                "source": "if (ctx._source.pois == null) {ctx._source.pois = new ArrayList();} ctx._source.pois.add(params.stop);",
                "lang": "painless",
                "params" : {
                    "stop" : poiId
                }
            }
        }
        update(body, 'users',context.getUser().id)
    },
    setComponent: async (_:any,args:any,context:any) => {
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
      },
}