const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

require("../models/User")
const User = mongoose.model("users")




module.exports = function (passport) {

    passport.use(new localStrategy({ usernameField: "email" }, (email, password, done) => {

        User.findOne({ email: email }).then((user) => {

            if (!user) {
                return done(null, false, { message: "Esta conta não existe" })
            }

            bcrypt.compare(password, user.password, (err, result) => {

                if (result) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: "Senha incorreta" })
                }

            })

        })

    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {

        User.find({ _id: id }).lean().then((user) => {

            delete user[0].__v
            delete user[0]._id
            delete user[0].password

            done(null, user)
        })

    })

}