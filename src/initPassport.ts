
import passport from 'passport';
// @ts-ignore
import { GraphQLLocalStrategy } from 'graphql-passport';
import { search } from './db/db'
import bcrypt from 'bcrypt'



const initPassport = () => {
  passport.use(
    new GraphQLLocalStrategy(async (email: any, password: any, done: any) => {
      let user = await search({
        "query": {
          "term": {
            "email": {
              "value": email
            }
          }
        }
      },'users')
      //console.log(user)
      let error = null
      if (user.body.hits.total.value == 0) {
        console.log('hits = 0')
        user = {}
        error = new Error('email does not exist')
      } else {
        user = user.body.hits.hits[0]._source
        const compare = await bcrypt.compare(password, user.password)
        error = compare ? null : new Error('wrong password');
        
      }
      done(error, user);
    }),
    
  );


  passport.serializeUser((user: any, done) => {

    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    //todo implement get users
    let user = await search({ query: { match: { id: id } } },'users')

    if(user.body.hits.hits[0] != undefined){
    user = user.body.hits.hits[0]._source
    }

    //const matchingUser = users.find((user:any) => user.id === id);
    done(null, user);
  });
}

export default initPassport;