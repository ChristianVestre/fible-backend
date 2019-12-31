import {search} from './../db/db'
import { findHtype } from '../helperFunction'

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
            console.log(poiIds)
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
            let pois = await search(body,'pois')
            //console.log(pois)
            pois = pois.body.hits.hits.map((route:any) => route._source )
            return pois
            }
            return [null]
            },
        getComponents: async (_:any, {ids}:any,context:any) => {
          ids = JSON.parse(ids)
          try{
          const componentsBody = {
            "query": {
              "bool": {
                "should": [
                  {
                    "ids": {
                      "values": ids
                    }
                  }
                ]
              }
            }
          }
          let components = await search(componentsBody , 'components')
                    //console.log(components)
                    components = components.body.hits.hits.map((component:any) => component._source)
                    //components = components.map((component:any) => component. )
                    if(components.length > 0) {
                    components = components.reduce((result:any, item:any,) => { 
                      item = {...item,
                        content:JSON.stringify(item.content)
                      }
                      result.push(item) //a, b, 
                  return result;
                  }, []) 
                }
                return components
        }catch(error){
          console.error(error)
          return error
        }
        },
        getHtypeWithComponents: async (_:any, {id}:any, context:any) => {
          //console.log(context.req.headers)
          console.log(context)

         // const htypeId = cookie.parse(context.req.headers.cookie_2).hid
          const htypeId = id
          let htype = findHtype(htypeId)
          //console.log(htype)
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
          result.components[0] == null ? result.components = []:result.components
          //console.log(result.components)
          const componentsBody = {
            "query": {
              "bool": {
                "should": [
                  {
                    "ids": {
                      "values": result.components
                    }
                  }
                ]
              }
            }
          }
          let components = await search(componentsBody , 'components')
          //console.log(components)
          components = components.body.hits.hits.map((component:any) => component._source)
          //components = components.map((component:any) => component. )
          if(components.length > 0) {
          components = components.reduce((result:any, item:any,) => { 
            item = {...item,
              content:JSON.stringify(item.content)
            }
            result.push(item) //a, b, 
        return result;
        }, []) 
      }
          console.log(components)
          const htypeObj= {[htype.substring(0, htype.length - 1)]:result}
          return {htype:htypeObj,components:components}
        }
}