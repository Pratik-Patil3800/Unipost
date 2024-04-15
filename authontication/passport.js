const LocalStrategy=require('passport-local').Strategy;
const mangoose=require('mongoose');
const bcrypt=require('bcryptjs');
const {User}=require('../authontication/user');

module.exports=function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
           
            User.findOne({email:email})
                .then(user=>{
                    if(!user){
                        return done(null,false,{message:'Email not registered'});
                    }
                    bcrypt.compare(password,user.password,(err,ismatch)=>{
                        if(err) throw err;
                        if(ismatch){
                            return done(null,user);
                        }
                        else{
                            return done(null,false,{message:'incorrect password'});
                        }
                        
                    })
                }).catch(err =>console.log(err));
        })
    );
    passport.serializeUser((user, done)=> {
        done(null, user.id);
      });
    
    passport.deserializeUser((id, done)=> {
        try {
            const user =  User.findById(id).exec();
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};