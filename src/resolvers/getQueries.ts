import {search} from './../db/db'
import cookie from 'cookie'

export default  {
        getRoutes: async (_:any, __:any, context:any) => {
        const routeIds:Array<String> =  context.getUser().routes
       // console.log(routeIds)
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
         // console.log(stopIds)
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
            //console.log(pois)
            pois = pois.body.hits.hits.map((route:any) => route._source )
            return pois
            }
            return [null]
            },
        getHtypeWithComponents: async (_:any, __:any, context:any) => {
          console.log(context.req.headers)
          const htypeId = cookie.parse(context.req.headers.cookie_2).hid
          let findHtype = (htypeId:any) => {
            console.log(htypeId)
            let type = htypeId.substring(0,2)
            switch (type){
              case "rt":
                return "routes"
              case "st":
                  return "stops"
              case "po":
                  return "pois"
              default:
                  return "routes"
              }
          }
          let htype = findHtype(htypeId)
          console.log(htype)
          const htypeBody = {
            "query": {
              "bool": {
                "should": [
                  {
                    "ids": {
                      "values":htypeId
                    }
                  }
                ]
              }
            }
          }
          let result = await search(htypeBody, htype)
          result = result.body.hits.hits[0]._source
          console.log(result.components)
          const componentsBody = {
            "query": {
              "bool": {
                "should": [
                  {
                    "ids": {
                      "values": ['cp_bfbbe197-e4a6-41e6-8d96-31357bf1d3c0',
                      'cp_4ad2b077-7043-45ad-b497-bf9d625919a5' ]
                    }
                  }
                ]
              }
            }
          }
          let components = await search(componentsBody , 'components')
         // console.log(components)
          components = components.body.hits.hits.map((component:any) => component._source)
          //components = components.map((component:any) => component. )
          components = components.reduce((result:any, item:any,) => { 
            item = {...item,
              content:JSON.stringify(item.content)
            }
            result.push(item) //a, b, 
        return result;
        }, []) 
          console.log(components)
          const htypeObj= {[htype.substring(0, htype.length - 1)]:result}
          return {htype:htypeObj,components:components}
        }
}