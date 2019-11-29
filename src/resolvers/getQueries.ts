import {search} from './../db/db'

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

    
}