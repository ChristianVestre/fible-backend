import {indexwithpipeline, update, indexRoutes }from './../db/db'
import uuid = require('uuid')
import cookie  from 'cookie'
export default  {
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
        const body = {
            "script" : {
                "source": "if (ctx._source.ROUTES == null) {ctx._source.ROUTES = new ArrayList();} ctx._source.ROUTES.add(params.route);",
                "lang": "painless",
                "params" : {
                    "route" : routeId
                }
            }
        }
        update(body, 'users',context.getUser().id)
        return route
    },
    setComponent: async (_:any,args:any,context:any) => {
          const routeid = cookie.parse(context.req.headers.cookie).hid
          const content = JSON.parse(args.content.split("'").join('"'))
          const componentId = "cp_" + uuid()
          const component ={
            id: componentId,
            content:content,
            type:args.type,
            ownerid: context.getUser().id,
            ownername:context.getUser().name,
            parentid:routeid
        }
        await indexwithpipeline(component,'components','indexed_at_and_rename_id')
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
        update(body, 'routes',routeid)
        return component
      },
}