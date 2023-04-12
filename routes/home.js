const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

require("../models/Category")
const Category = mongoose.model("categories")
require("../models/Post")
const Post = mongoose.model("posts")


router.get("/", (req, res) => {

    Post.find().populate("category").lean().sort({ date: "desc" })
    .then((posts) => {

        res.render("index", { posts: posts })

    })
    .catch((err) => {

        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/404")

    })


})

router.get("/posts/:slug", (req, res) => {

    Post.findOne({ slug: req.params.slug }).lean()
    .then((post) => {

        if (post) {
            res.render("posts/index", { post: post })
        } else {
            req.flash("error_msg", "Essa postagem não exite")
            res.redirect("/")
        }

    })
    .catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/")
    })
})



router.get("/categories", (req, res) => {

    Category.find().lean()
    .then((categories) => {

        res.render("categories/index", { categories: categories })

    })
    .catch((err) => {
        req.flash("error_msg", "houve um erro interno ao listar as categorias")
        res.redirect("/")
    })

})

router.get("/categories/:slug", (req, res) => {

    Category.findOne({ slug: req.params.slug }).lean()
    .then((category) => {

        Post.find({ category: category._id }).lean().sort({ date: "desc" })
        .then((post) => {

            res.render("categories/posts", { post: post, category: category })

        })
        .catch((err) => {

            req.flash("error_msg", "Essa categoria não existe")
            res.redirect("/")
    
        })

    })
    .catch((err) => {

        req.flash("error_msg", "Houve um erro ao carregar a categoria")
        res.redirect("/")

    })

})

router.get("/404", (req, res) => {
    res.send("Erro 404!")
})

module.exports = router