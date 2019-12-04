`

PUT /users
{
  "mappings": {
    "_default_":{
        "_timestamp" : {
            "enabled" : true,
            "store" : true
        }
    }
  "mappings": {
    "properties": {
      "id":    { "type": "integer" },  
      "email":  { "type": "keyword"  }, 
      "name":   { "type": "text"  }, 
      "routes": { "type": ["text"]},
      "stops": { "type": ["text"]},  
      "pois": { "type": ["text"]},    
      "birthdate": {"type":"text"}
    }
  }
}
id:ID!
name:String
password:String
ROUTES:String
STOPS:String
POIS:String
email:String

PUT /components
{
  "mappings": {
    "_default_":{
        "_timestamp" : {
            "enabled" : true,
            "store" : true
        }
    }
    "properties": {
      "id":    { "type": "text" },  
      "type": {"type":"text"}
      "parentid":  { "type": "keyword"  }, 
      "ownerid":   { "type": "keyword"  }, 
      "ownername": { "type": "text"},
      "content": { "type": "flattened"},
      "createdat": { "type": "text"},    
      "lasteditat": {"type":"timestamp"}
    }
  }
}


PUT /routes
{
  "mappings": {
    "_default_":{
        "_timestamp" : {
            "enabled" : true,
            "store" : true
        }
    }
  "mappings": {
    "properties": {
      "id":    { "type": "integer" },  
      "email":  { "type": "keyword"}, 
      "name":   { "type": "text"  }, 
      "stops": { "type": ["keyword"]},  
      "pois": { "type": ["keyword"]}, 
      "components":{"type":["keyword"]},
      "location":{"type":["geo_point"]}
      "tags":{"type":[text]}
      "route":{"type":"keyword"}
    }
  }
}
type Route {
  id: ID
  owner:ID
  name: String
  image:File
  stops:String
  pois:String
  order:String
  components:String
  images:String
  location:String
}
`

