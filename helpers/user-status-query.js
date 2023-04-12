const mongoose = require("mongoose")

require("../models/User")
const User = mongoose.model("users")



module.exports = {
    isAdmin: function (req, res, next) {

        if (req.user) {
            
            User.findOne({ _id: req.session.passport.user }).lean()
            .then((user) => {

                if (req.isAuthenticated() && user.isAdmin === true) {

                    return next()

                } else {

                    req.flash("error_msg", "Você deve ser administrador para acessar essa página")
                    res.redirect("/")

                }

            })
            .catch((err) => {

                req.flash("error_msg", "Falha na autenticação")
                res.redirect("/")


            })
            
        } else {
            res.redirect("/")
        }

        

    },

    redirectIfLogged: function (req, res, next) {

        if (req.isAuthenticated()) {

            res.redirect("/")

        } else {

            return next()

        }
    },

    passIfLogged: function (req, res, next) {

        if (req.isAuthenticated()) {

            return next()

        } else {

            res.redirect("/")

        }
    }
}