import {search} from './../db/db'
import cookie from 'cookie'

export default  {

        getRoutes: async (_:any, __:any, context:any) => {
            console.log(context.getUser())
        const routeIds:Array<String> =  context.getUser().ROUTES
        const body = {
            "query": {
              "bool": {
                "should": [
                  {
                    "ids": {
                      "values": routeIds
                    }
                  }
                ]
              }
            }
          }
        let routes = await search(body,'routes')
        routes = routes.body.hits.hits.map((route:any) => route._source )
        console.log(routes)
        return routes
        },
        getRouteWithComponents: async (_:any, __:any, context:any) => {
          //console.log(cookie.parse(context.req.headers.cookie))
          const routeBody = {
            "query": {
              "bool": {
                "should": [
                  {
                    "ids": {
                      "values": cookie.parse(context.req.headers.cookie).hid
                    }
                  }
                ]
              }
            }
          }
          let route = await search(routeBody, 'routes')
          route = route.body.hits.hits[0]._source
          const componentsBody = {
            "query": {
              "bool": {
                "should": [
                  {
                    "ids": {
                      "values": route.id
                    }
                  }
                ]
              }
            }
          }
          
          let components = await search(componentsBody , 'components')
          components = components.body.hits.hits.map((component:any) => component._source)
          return {route:route,components:components}
        }
}