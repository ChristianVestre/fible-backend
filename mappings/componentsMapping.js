`
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
`
`PUT _ingest/pipeline/indexed_at_and_rename_id
{
  "description": "Adds indexed_at timestamp to documents",
  "processors": [
    {
      "set": {
        "field": "_source.createdat",
        "value": "{{_ingest.timestamp}}"
      }
    },
        {
      "set": {
        "field": "_source.lasteditat",
        "value": "{{_ingest.timestamp}}"
      }
    },
    {
        "set":{
        "field" : "_id",
        "value" : "{{id}}"
      }
    }
  ]
}
`