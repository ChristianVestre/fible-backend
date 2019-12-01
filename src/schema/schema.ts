import { gql } from 'apollo-server-express';
export default gql`
type Query {
    getUser(id:ID, password:String):User
    getRoutes:[Route]
    getStops:[Stop]
    getPoi:[Poi]
    getRouteWithComponents:[RouteWithComponent]
    me: User
}
type Mutation {
    setUser(id:ID,name:String,email:String, password:String):User
    setRoute(name:String, ROUTES:String, POIS:String, STOPS:String):Route
    setStop:Stop
    setPoi:Poi
    setComponent(content:String, type:String):Component
    deleteUser(id:ID):User
    deleteRoute(id:ID):Route
    deleteStop(id:ID):Stop
    deletePoi(id:ID):Poi
    deleteComponent(id:ID):Component
    updateUser(id:ID, name:String, ROUTES:String):User
    updateRoute(id:ID, name:String):Route
    updateStop(id:ID):Stop
    updatePoi(id:ID):Poi
    updateComponent(id:ID):Component
    signIn(id:String,password:String):User
    signup(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    logout: Boolean
}


type AuthPayload {
    user: User
  }

type RouteWithComponent {
    route: Route,
    components:[Component]
}

type User {
    id:ID!
    name:String
    password:String
    ROUTES:[String]
    STOPS:[String]
    POIS:[String]
    email:String
}

type Route {
    id: ID
    owner:ID
    name: String
    image:String
    STOPS:String
    POIS:String
    order:String
    components:String
    images:String
    location:String
}

type StopPreview {
    id:ID!
    name:String
}

type Stop {
    id: ID!
    owner:ID
    name: String
    image:[Image]
    POIS:[Poi]
    order:[ID]
    components:[Component]
    images:[Image]
    location:Location
} 

type Poi {
    id: ID!
    owner:ID
    name: String
    image:[Image]
    POIS:[Poi]
    order:[ID]
    components:[Component]
    images:[Image]
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
    id:ID!
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

type Image{
    id:ID!
    url:String
    name:String
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