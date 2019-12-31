

const { Client } = require('@elastic/elasticsearch')
const passwords = require('./../../passwords.json')
console.log(passwords.elasticsearch)
/*
const elasticsearchClient = new Client({
    cloud:{
        id:'fible-backend:ZXVyb3BlLXdlc3QzLmdjcC5jbG91ZC5lcy5pbyRhNDNmYzM2NWMyMTA0YTMxYjY2YmM5NzNjOGZlZDZmMiQ3YmFjOTJlNDBhZGM0ZWNiOGJiMzFlZWIyZDEyNmYzNQ==',
    },
    auth: {
        username: 'elastic',
        password: passwords.elasticsearch,
    }
  })
*/
const elasticsearchClient = new Client({
  node: 'http://46.101.144.52:9200',
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true
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



export const indexwithpipeline =  async function (body:Object, index:String,pipeline:String){
  return await elasticsearchClient.index({index: index,
  pipeline: pipeline,
  body:body})
}

export const update =  async function (body:Object, index:String, id:String){
  return await elasticsearchClient.update({index: index,
  id:id,
  body:body})
}

export const remove =  async function (index:String, id:String){
  return await elasticsearchClient.delete({index: index,
  id:id,
  refresh:"wait_for"})
}
