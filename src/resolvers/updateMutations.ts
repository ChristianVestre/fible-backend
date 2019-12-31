import { findHtype } from '../helperFunction';
import { indexwithpipeline, index } from '../db/db';
import { update } from './../db/db'
var now = new Date();
export default {
  updateUser: async (_: any, {user}: any, context: any) => {
    user = JSON.parse(user)
    let test = await update({
      body: {
        doc: {
          name: user.name,
          routes: user.routes,
          stops:user.stops,
          pois:user.pois,
          lasteditat: now
        }
      }
    }
      , 'users', context.getUser().id)
    return test
  },
  updateRoute: async (_: any, args: any, context: any) => {
    //console.log(args)
    let test = await update({
      doc: {
        'name': args.name,
        lasteditat: now
      }
    }
      , 'routes', args.id)
    //console.log(test)
    return test.body.hits.hits[0]._source
  },
  updateHtype: async (_: any, { htype }: any, context: any) => {
    htype = JSON.parse(htype)
    console.log(htype)
    const type = findHtype(htype.id)
    switch (type) {
      case 'routes': {
        try {
          update({
            doc: {
              name: htype.name,
              components: htype.components,
              stops: htype.stops,
              pois: htype.pois,
              lasteditat: now
            }
          }
            , type, htype.id)
            return true
        } catch (error) { console.log(error) 
        return error}
      }
      case 'stops': {
        try {
          update({
            doc: {
              name: htype.name,
              components: htype.components,
              pois: htype.pois,
              lasteditat: now
            }
          }
            , type, htype.id)
            return true
        } catch (error) { 
          console.error(error)
          return error }
      }
      case 'pois': {
        try {
          update({
            doc: {
              name: htype.name,
              components: htype.components,  
              lasteditat: now
            }
          }
            , type, htype.id)
            return true
        } catch (error) {
          console.error(error)
          return error }
      }
    }
  },
  updateComponent: async (_: any, { parentHtype, component }: any, context: any) => {
    parentHtype = JSON.parse(parentHtype)
    console.log(parentHtype.components)
    console.log("parentHtype")
    component = JSON.parse(component)
    const type = findHtype(parentHtype.id)
    console.log(type)
    try {
      await update({
        doc: {
          components: parentHtype.components,
          lasteditat: now
        }
      }
        , type, parentHtype.id)
    } catch (error) {
      console.error(error)
      return error
    }
    try {
      await update({
        doc: {
          content: JSON.parse(component.content),
          lasteditat: now
        }
      }
        , 'components', component.id)
    } catch (error) {
      console.error(error)
      return error
    }
    return true
  },

  syncInputScreen: async (_: any, { htype, components }: any, context: any) => {
    htype = JSON.parse(htype)
    htype = htype[Object.keys(htype)[0]]
    components = JSON.parse(components)
    const user = context.getUser()

    const type = findHtype(htype.id)

    /*
            if(user[type].indexOf(htype.id) != -1 ){
              const userBody = {
                "script" : {
                    "source": "if (ctx._source"+type+" == null) {ctx._source."+type+" = new ArrayList();} ctx._source."+type+".add(params.htype);",
                    "lang": "painless",
                    "params" : {
                        "htype" : htype.id
                    }
                }
            }
            let resp = await update(userBody, 'users',user.id)
            console.log(resp)
            }
            */

    try {
      const resp = await update({
        doc: {
          name: htype.name,
          components: htype.components,
          lastedita: now
        }
      }
        , 'routes', htype.id)
    } catch (error) { console.error(error) }
    console.log(components)
    console.log(htype.components)
    for (let i of Object.keys(components)) {
      let currentComponent = components[i]
      console.log(currentComponent)
      if (htype.components.indexOf(currentComponent.id) != -1) {
        await update({
          doc: {
            content: currentComponent.content,
            lastedita: now
          }
        }
          , 'components', currentComponent.id)
      } else {
        await indexwithpipeline({
          id: components[i].id,
          ownerid: user.id,
          ownername: user.name,
          parentid: htype.id,
          content: JSON.parse(components[i].content),
          type: components[i].type,
          lasteditat: now,
          createdat: now,
        }
          , 'components', 'rename_id')
      }
    }
    return true

  }

}