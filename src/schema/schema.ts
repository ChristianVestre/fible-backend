import { gql } from 'apollo-server-express';
export default gql`
type Query {
    getUser(id:ID, password:String):User
    getRoutes:[Route]
    getStops:[Stop]
    getPois:[Poi]
    getComponents(ids:String):[Component]
    getHtypeWithComponents(id:String):HtypeWithComponent
    me: User
}
type Mutation {
    setUser(name:String!,email:String!, password:String!):AuthPayload
    setRoute(route:String!):Route
    setStop(stop:String!):Stop
    setPoi(poi:String!):Poi
    setComponent(component:String, parentHtype:String):Boolean
    deleteUser(id:ID):User
    deleteRoute(id:ID):Route
    deleteStop(id:ID):Stop
    deletePoi(id:ID):Poi
    deleteComponent(parentHtype:String, component:String):Boolean
    updateUser(id:ID, name:String, htypeids:[String], htype:String):Boolean
    updateRoute(id:ID, name:String):Route
    updateStop(id:ID):Stop  
    updatePoi(id:ID):Poi
    updateHtype(htype:String):Boolean
    updateComponent(parentHtype:String, component:String):Boolean
    login(email: String!, password: String!): AuthPayload
    logout: Boolean
    syncInputScreen(htype:String, components:String):Boolean
}


type File {
    filename: String!
    mimetype: String!
    encoding: String!
}

type AuthPayload {
    user: User
}

type HtypeWithComponent {
    htype: Htype,
    components:[Component]
}
type Htype{
    route:Route
    stop:Stop
    poi:Poi
}

type User {
    id:String
    name:String
    password:String
    routes:[String]
    stops:[String]
    pois:[String]
    email:String
}

type Route {
    id: String
    ownerid:ID
    ownername:String
    name: String
    image:File
    stops:[String]
    pois:[String]
    components:[String]
    images:String
    location:String
}

type StopPreview {
    id:ID!
    name:String
}

type Stop {
    id: ID!
    ownerid:ID
    ownername:String
    name: String
    image:File
    pois:[String]
    components:[String]
    images:[File]
    location:Location
} 

type Poi {
    id: ID!
    ownerid:ID
    ownername:String
    name: String
    image:File
    components:[String]
    images:[File]
    location:Location
}

enum ComponentType {
    HEADLINE_INPUT
    SUBHEADLINE_INPUT
    MAP
    ATTRACTIONS
    PARAGRAPH_INPUT
    POI_INFO
    IMAGE_CARUSEL
}

type Component{
    id:String
    type:String
    content:String
    links:[String]
    location:Location
}

type Location{
    lat:Float
    lng:Float
    address:String
}


`
/*
image:[Image]
STOPS:[Stop]
POIS:[Poi]
order:[ID]
components:[Component]
images:[Image]
location:[Location]
*/
/*
    id: ID!
    name: String


*/ 