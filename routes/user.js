const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const passport = require("passport")
const bcrypt = require("bcryptjs")

require("../models/User")
const User = mongoose.model("users")

const validateForm = require("../helpers/validate-form")
const generateHash = require("../helpers/generate-hash")

const { redirectIfLogged, passIfLogged } = require("../helpers/user-status-query")



router.get("/register", redirectIfLogged, (req, res) => {
    res.render("users/register")
})

router.post("/register", redirectIfLogged, (req, res) => {

    validateForm.userForms(req.body)
        .then(({ errorResult, errorMessages }) => {

            if (errorResult) {

                res.render("users/register", { errors: errorMessages, userRegister: req.body })
                validateForm.cleanErrorMessages()

                return

            } else {

                return generateHash(req.body.password)

            }

        })
        .then((hash) => {

            if (hash) {

                let newUser = {
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                }

                if (req.body.isAdmin === "true") {
                    newUser.isAdmin = true
                }

                return new User(newUser).save()

            } else {

                return

            }

        })
        .then((addedToDatabase) => {

            if (addedToDatabase) {
                req.flash("success_msg", "Usuário criado com sucesso!")
                res.redirect("/")
            }


        })
        .catch((err) => {

            req.flash("error_msg", "Houve um erro durante o salvamento do usuário")
            res.redirect("/user/register")

        })

})

router.get("/login", redirectIfLogged, (req, res) => {
    res.render("users/login")
})

router.post("/login", redirectIfLogged, (req, res, next) => {

    passport.authenticate("local", {

        successRedirect: "/",
        failureRedirect: "/user/login",
        failureFlash: true

    })(req, res, next)

})

router.get("/delete", passIfLogged, (req, res) => {

    res.render("users/delete")

})

router.post("/delete", passIfLogged, (req, res) => {

    if (req.body.password != req.body.repeatedPassword) {

        req.flash("error_msg", "As senhas são diferentes, tente novamente!")
        res.redirect("/user/delete")
        return

    } else if (req.body.email != req.user[0].email) {

        req.flash("error_msg", "Email incorreto, tente novamente!")
        res.redirect("/user/delete")
        return

    }

    const userToDelete = {
        _id: req.session.passport.user,
        name: req.user[0].name,
        email: req.body.email
    }

    User.findOne(userToDelete)
        .then((deleteUser) => {

            if (deleteUser) {

                if (bcrypt.compareSync(req.body.password, deleteUser.password)) {

                  return  User.deleteOne(deleteUser)

                } else {

                    req.flash("error_msg", "Senha incorreta, tente novamente!")
                    res.redirect("/user/delete")
                    return

                }
                
            } else {
                
                req.flash("error_msg", "Essa conta não existe")
                res.redirect("/")
                return
                    
            }

        })
        .then((deleteUser) => {

            if (deleteUser) {
                req.logout((err) => {

                    if (err) {
    
                        req.flash("error_msg", "Conta deletada com sucesso! Faça logout para finalizar o processo")
                        res.redirect("/")
    
                    } else {
    
                        req.flash("success_msg", "Conta deletada com sucesso!")
                        res.redirect("/")
    
                    }
                })
            }

        })
        .catch((err) => {

            req.flash("error_msg", "Houve um erro ao deletar a conta")
            res.redirect("/")

        })

})

router.get('/logout', passIfLogged, (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash("error_msg", "Houve ao tentar deslogar, tente novamente")
            res.redirect("/")
        } else {
            req.flash("success_msg", "Deslogado com sucesso!")
            res.redirect("/")
        }
    })
})


module.exports = router