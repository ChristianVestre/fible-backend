import {update }from './../db/db'
var now = new Date();   
export default  {
    updateUser: async (_:any,args:any,context:any) => {
        //  console.log(args)
          let test= await update({
                  body: {
                    doc: {
                      'name' :args.name,
                      [args.htype]:args.htypeid,
                      lasteditat:now
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
                      lasteditat:now
                    }
                  }
          ,'routes',args.id)
          console.log(test)
          return test.body.hits.hits[0]._source
      },


}