

const { Client } = require('@elastic/elasticsearch')

const elasticsearchClient = new Client({
    cloud:{
        id:'fible-backend:ZXVyb3BlLXdlc3QzLmdjcC5jbG91ZC5lcy5pbyRhNDNmYzM2NWMyMTA0YTMxYjY2YmM5NzNjOGZlZDZmMiQ3YmFjOTJlNDBhZGM0ZWNiOGJiMzFlZWIyZDEyNmYzNQ==',
    },
    auth: {
        username: 'elastic',
        password: 'wu8COQ4y539KHpMxPMWCj11k',
    }
  })


export const search = async  function (body:any, index:String) {
    return await elasticsearchClient.search({ index: index,
body:body})
  
}

export const indexUser =  async function (body:Object){
  return await elasticsearchClient.index({index: 'users',
  pipeline: 'rename_id',
  body:body})
}

export const indexRoutes =  async function (body:Object){
  return await elasticsearchClient.index({index: 'routes',
  pipeline: 'rename_id',
  body:body})
}

export const index =  async function (body:Object, index:String){
  return await elasticsearchClient.index({index: index,
  pipeline: 'rename_id',
  body:body})
}

export const update =  async function (body:Object, index:String, id:String){
  return await elasticsearchClient.update({index: index,
  id:id,
  type:"_doc",
  body:body})
}

