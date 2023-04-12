const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

require("../models/Category")
const Category = mongoose.model("categories")
require("../models/Post")
const Post = mongoose.model("posts")

const validateForm = require("../helpers/validate-form")
const { isAdmin } = require("../helpers/user-status-query")




router.get("/categories", isAdmin, (req, res) => {

    Category.find().lean().sort({ date: "desc" })
        .then((categories) => {
            res.render("admin/categories", { categories: categories })

        })
        .catch((err) => {

            req.flash("error_msg", "Houve um erro ao listar as categorias")
            res.redirect("/admin")

        })

})

router.get("/categories/add", isAdmin, (req, res) => {
    res.render("admin/categories-add")
})

router.post("/categories/new", isAdmin, (req, res) => {

    validateForm.categoryForms(req.body)

        .then(({ errorResult, errorMessages }) => {

            if (errorResult) {

                res.render("admin/categories-add", { errors: errorMessages, category: req.body })
                validateForm.cleanErrorMessages()

                return

            } else {

                const newCategory = {
                    name: req.body.name,
                    slug: req.body.slug
                }

                return new Category(newCategory).save()

            }

        })
        .then((addedToDatabase) => {

            if (addedToDatabase) {
                req.flash("success_msg", "Categoria criada com sucesso!")
                res.redirect("/admin/categories")
            }


        })
        .catch((err) => {

            req.flash("error_msg", "Erro ao salvar a categoria, tente novamente!")
            res.redirect("/admin/categories")

        })

})

router.get("/categories/edit/:_id", isAdmin, (req, res) => {

    Category.findOne({ _id: req.params._id }).lean()
        .then((category) => {

            res.render("admin/categories-edit", { category: category })

        })
        .catch((err) => {

            req.flash("error_msg", "Essa categoria não existe")
            res.redirect("/admin/categories")

        })

})

router.post("/categories/edit", isAdmin, (req, res) => {

    Category.findOne({ _id: req.body._id })
        .then((originalCategory) => {

            return validateForm.categoryForms(req.body, originalCategory)

        })
        .then(({ errorResult, errorMessages, originalCategory }) => {

            if (errorResult) {

                res.render("admin/categories-edit", { errors: errorMessages, category: req.body })
                validateForm.cleanErrorMessages()
                return


            } else {

                let editedCategory = originalCategory

                editedCategory.name = req.body.name
                editedCategory.slug = req.body.slug

                return editedCategory.save()

            }

        })
        .then((savedCategory) => {

            if (savedCategory) {

                req.flash("success_msg", "Categoria editada com sucesso!")
                res.redirect("/admin/categories")

            }

        })
        .catch((err) => {

            req.flash("error_msg", "Houve um erro interno ao editar a categoria")
            res.redirect("/admin/categories")

        })

})

router.post("/categories/delete", isAdmin, (req, res) => {

    Category.deleteOne({ _id: req.body._id })
        .then(() => {

            req.flash("success_msg", "Categoria deletada com sucesso!")
            res.redirect("/admin/categories")

        })
        .catch((err) => {

            req.flash("error_msg", "Houve um erro ao deletar a categoria")
            res.redirect("/admin/categories")

        })

})

router.get("/posts", isAdmin, (req, res) => {

    Post.find().populate("category").lean().sort({ date: "desc" })
        .then((posts) => {

            res.render("admin/posts", { posts: posts })

        })
        .catch((err) => {

            req.flash("error_msg", "Houve um erro ao listar as postagens")
            res.redirect("/admin")

        })

})

router.get("/posts/add", isAdmin, (req, res) => {

    Category.find().lean()
        .then((categories) => {

            res.render("admin/posts-add", { categories: categories })

        })
        .catch((err) => {

            req.flash("error_msg", "Houve um erro ao carregar as categorias disponiveis")
            res.redirect("/admin/posts")

        })
})

router.post("/posts/new", isAdmin, (req, res) => {

    validateForm.postForms(req.body)
        .then(({ errorResult, errorMessages }) => {

            if (errorResult) {

                Category.find().lean().then((categories) => {

                    res.render("admin/posts-add", { errors: errorMessages, post: req.body, categories: categories })

                }).catch((err) => {

                    req.flash("error_msg", "Houve um erro interno ao salvar a postagem")
                    res.redirect("/admin/posts")

                })

                validateForm.cleanErrorMessages()

                return

            } else {

                const newPost = {
                    title: req.body.title,
                    slug: req.body.slug,
                    description: req.body.description,
                    content: req.body.content,
                    category: req.body.category
                }

                return new Post(newPost).save()

            }

        })
        .then((addedToDatabase) => {

            if (addedToDatabase) {
                req.flash("success_msg", "Postagem criada com sucesso!")
                res.redirect("/admin/posts")
            }


        })
        .catch((err) => {

            req.flash("error_msg", "Erro ao salvar a postagem, tente novamente!")
            res.redirect("/admin/posts")

        })

})

router.get("/posts/edit/:id", isAdmin, (req, res) => {

    Post.findOne({ _id: req.params.id }).lean()
        .then((post) => {

            Category.find().lean()

                .then((categories) => {

                    res.render("admin/posts-edit", { post: post, categories: categories })

                })
                .catch((err) => {

                    req.flash("error_msg", "Houve um erro ao carregar as categorias")
                    res.redirect("/admin/posts")

                })

        })
        .catch((err) => {

            req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
            res.redirect("/admin/posts")

        })

})

router.post("/posts/edit", isAdmin, (req, res) => {

    Post.findOne({ _id: req.body._id })
        .then((originalPost) => {

            return validateForm.postForms(req.body, originalPost)

        })
        .then(({ errorResult, errorMessages, originalPost }) => {

            if (errorResult) {

                Category.find().lean().then((categories) => {

                    res.render("admin/posts-edit", { errors: errorMessages, post: req.body, categories: categories })

                }).catch((err) => {

                    req.flash("error_msg", "Houve um erro interno ao editar a postagem")
                    res.redirect("/admin/posts")

                })

                validateForm.cleanErrorMessages()
                return

            } else {

                let editedPost = originalPost

                editedPost.title = req.body.title
                editedPost.slug = req.body.slug
                editedPost.description = req.body.description
                editedPost.content = req.body.content
                editedPost.category = req.body.category

                return editedPost.save()

            }

        })
        .then((savedPost) => {

            if (savedPost) {

                req.flash("success_msg", "Postagem editada com sucesso!")
                res.redirect("/admin/posts")

            }

        })
        .catch((err) => {

            req.flash("error_msg", "Houve um erro interno ao editar a postagem")
            res.redirect("/admin/posts")

        })

})

router.post("/posts/delete", isAdmin, (req, res) => {

    Post.deleteOne({ _id: req.body._id })
        .then(() => {

            req.flash("success_msg", "Postagem deletada com sucesso!")
            res.redirect("/admin/posts")

        })
        .catch((err) => {

            req.flash("error_msg", "Houve um erro ao deletar a postagem")
            res.redirect("/admin/posts")

        })

})


module.exports = router