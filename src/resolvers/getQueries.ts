import {search} from './../db/db'
import cookie from 'cookie'

export default  {
        getRoutes: async (_:any, __:any, context:any) => {
        const routeIds:Array<String> =  context.getUser().routes
        console.log(routeIds)
        if(routeIds){
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
        return routes
        }
        return [null]
        },
        getStops: async (_:any, __:any, context:any) => {
          const stopIds:Array<String> =  context.getUser().stops
          console.log(stopIds)
          if(stopIds){
          const body = {
              "query": {
                "bool": {
                  "should": [
                    {
                      "ids": {
                        "values": stopIds
                      }
                    }
                  ]
                }
              }
            }
          let stops = await search(body,'stops')
          stops = stops.body.hits.hits.map((stop:any) => stop._source )
          return stops
          }
          return [null]
          },
          getPois: async (_:any, __:any, context:any) => {
            const poiIds:Array<String> =  context.getUser().pois
            if(poiIds){
            const body = {
                "query": {
                  "bool": {
                    "should": [
                      {
                        "ids": {
                          "values": poiIds
                        }
                      }
                    ]
                  }
                }
              }
            let pois = await search(body,'routes')
            console.log(pois)
            pois = pois.body.hits.hits.map((route:any) => route._source )
            return pois
            }
            return [null]
            },
        getRouteWithComponents: async (_:any, __:any, context:any) => {
          //console.log(context)
          console.log(cookie.parse(context.req.headers.cookie_2))
          const routeBody = {
            "query": {
              "bool": {
                "should": [
                  {
                    "ids": {
                      "values": cookie.parse(context.req.headers.cookie_2).hid
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