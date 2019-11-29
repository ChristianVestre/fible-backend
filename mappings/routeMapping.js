`

PUT /users
{
  "mappings": {
    "properties": {
      "id":    { "type": "integer" },  
      "email":  { "type": "keyword"  }, 
      "name":   { "type": "text"  }, 
      "ROUTES": { "type": ["text"]},
      "STOPS": { "type": ["text"]},  
      "POIS": { "type": ["text"]},    
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
`