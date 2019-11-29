import {update }from './../db/db'
export default  {
    updateUser: async (_:any,args:any,context:any) => {
        //  console.log(args)
          let test= await update({
                  body: {
                    doc: {
                      'name' :args.name,
                      'ROUTES':args.ROUTES,
                    }
                  }}
          ,'users',context.getUser().id)
          return test
      },
      updateRoute:async (_:any,args:any,context:any) => {
          console.log(args)
          let test= await update({
                
                    doc: {
                      'name' :args.name,
                    }
                  }
          ,'routes',args.id)
          console.log(test)
          return test.body.hits.hits[0]._source
      },
}