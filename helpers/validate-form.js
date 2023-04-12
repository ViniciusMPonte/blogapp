const mongoose = require("mongoose")

require("../models/User")
const User = mongoose.model("users")
require("../models/Category")
const Category = mongoose.model("categories")
require("../models/Post")
const Post = mongoose.model("posts")




const validateForm = {
    errorMessages: [],

    errorTexts: {

        repeatedValue: {

            unmodifiedEdit: "Nenhuma alteração detectada",
            email: "Já existe uma conta com este email no nosso sistema",
            name: "Este nome já esta sendo usado, tente outro.",
            slug: "Este slug já esta sendo usado, tente outro.",
            title:"Este título já esta sendo usado, tente outro.",
            description:"Esta descrição já esta sendo usada, tente outra.",
            content: "Este conteúdo já foi postado, tente outro."

        }

    },

    get errorResult() {
        if (validateForm.errorMessages.length > 0) {
            return true
        } else {
            return false
        }
    },

    cleanErrorMessages: () => {
        validateForm.errorMessages = []
    },

    name: (name) => {

        if (!name) {

            validateForm.errorMessages.push({ text: "Nome inválido" })

        } else if (name.length < 3) {

            validateForm.errorMessages.push({ text: "Nome deve ter no mínimo 3 caracteres" })

        }

    },

    email: (email) => {

        let emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

        if (!email) {

            validateForm.errorMessages.push({ text: "Email inválido" })

        } else if (!emailRegex.test(email)) {

            validateForm.errorMessages.push({ text: "Email inválido" })

        }

    },

    password: (password, repeatedPassword) => {

        let passwordRegex = /^\S{4,}$/

        if (!password) {

            validateForm.errorMessages.push({ text: "Senha inválida" })

        } else if (password.length < 4) {

            validateForm.errorMessages.push({ text: "Senha deve ter no mínimo 4 caracteres" })

        }else if (!passwordRegex.test(password)) {

            validateForm.errorMessages.push({ text: "A senha não pode possuir espaços em branco" })

        } else if (password != repeatedPassword) {

            validateForm.errorMessages.push({ text: "As senhas são diferentes, tente novamente!" })

        }

    },

    slug: (slug) => {

        let slugRegex = /^[a-z0-9]+(?:(?:-|_)?[a-z0-9]+)*$/

        if (!slug) {

            validateForm.errorMessages.push({ text: "Slug inválido" })

        } else if (!slugRegex.test(slug)) {

            validateForm.errorMessages.push({ text: "Slug inválido" })

        }

    },

    category: (category) => {

        if (category == "0") {

            validateForm.errorMessages.push({ text: "Categoria inválida, registre uma categoria." })

        }
    },

    title: (title) => {

        if (!title) {

            validateForm.errorMessages.push({ text: "Título inválido" })

        } else if (title.length > 70) {

            validateForm.errorMessages.push({ text: "O título deve ter no máximo 70 caracteres." })

        }

    },

    description: (description) => {

        if (!description) {

            validateForm.errorMessages.push({ text: "Descrição inválida" })

        } else if (description.length > 150) {

            validateForm.errorMessages.push({ text: "A descrição deve ter no máximo 150 caracteres" })

        }

    },

    content: (content) => {

        if (content.length < 300 || content.length > 1000) {

            validateForm.errorMessages.push({ text: "O conteúdo deve ter entre 300 a 1000 caracteres" })

        }

    },

    isAdmin: (isAdmin) => {

        if (isAdmin !== "true") {

            validateForm.errorMessages.push({ text: "Formulário inválido" })

        }

    },

    analyzeAll: (obj, keys) => {

        if (!keys) {

            keys = Object.keys(obj)

            const index = keys.indexOf("_id")

            if (index > -1) {
                keys.splice(index, 1);
            }

        }

        for (const key of keys) {

            validateForm[key](obj[key])

        }
    },

    userForms: async (newUser, originalUser, keys) => {

        if (!keys && Array.isArray(originalUser)) {

            keys = originalUser
            originalUser = undefined

        } else if (!keys) {

            keys = Object.keys(newUser)

            let index = keys.indexOf("_id")

            if (index > -1) {
                keys.splice(index, 1)
            }

        }

        if (originalUser) {

            let unmodifiedEdit = true

            for (const key of keys) {

                if (newUser[key] != originalUser[key]) {

                    unmodifiedEdit = false

                }

            }

            if (unmodifiedEdit) {

                validateForm.errorMessages.push({
                    text: validateForm.errorTexts.repeatedValue["unmodifiedEdit"]
                })

                let result = {
                    errorResult: validateForm.errorResult,
                    errorMessages: validateForm.errorMessages,
                    originalUser: originalUser
                }

                return result

            }

        }

        if (keys.includes("password")) {
            
            validateForm.password(newUser.password, newUser.repeatedPassword)
            
            keys.splice(keys.indexOf("password"), 1)
            keys.splice(keys.indexOf("repeatedPassword"), 1)

        }
  
        validateForm.analyzeAll(newUser, keys)

        var index = keys.indexOf("name")

        if (index > -1) {
            keys.splice(index, 1)
        }

        var index = keys.indexOf("isAdmin")

        if (index > -1) {
            keys.splice(index, 1)
        }

        await validateForm.checkValueAvailability.tools.asyncLoop(newUser, originalUser, keys, "userDB")

        let result = {
            errorResult: validateForm.errorResult,
            errorMessages: validateForm.errorMessages
        }

        if (originalUser) {
            result["originalUser"] = originalUser
        }

        return result

    },

    categoryForms: async (newCategory, originalCategory, keys) => {

        if (!keys && Array.isArray(originalCategory)) {

            keys = originalCategory
            originalCategory = undefined

        } else if (!keys) {

            keys = Object.keys(newCategory)

            const index = keys.indexOf("_id")

            if (index > -1) {
                keys.splice(index, 1);
            }

        }

        if (originalCategory) {

            let unmodifiedEdit = true

            for (const key of keys) {

                if (newCategory[key] != originalCategory[key]) {

                    unmodifiedEdit = false

                }

            }

            if (unmodifiedEdit) {

                validateForm.errorMessages.push({
                    text: validateForm.errorTexts.repeatedValue["unmodifiedEdit"]
                })

                let result = {
                    errorResult: validateForm.errorResult,
                    errorMessages: validateForm.errorMessages,
                    originalCategory: originalCategory
                }

                return result

            }

        }

        validateForm.analyzeAll(newCategory, keys)

        await validateForm.checkValueAvailability.tools.asyncLoop(newCategory, originalCategory, keys, "categoryDB")

        let result = {
            errorResult: validateForm.errorResult,
            errorMessages: validateForm.errorMessages
        }

        if (originalCategory) {
            result["originalCategory"] = originalCategory
        }

        return result

    },

    postForms: async (newPost, originalPost, keys) => {

        if (!keys && Array.isArray(originalPost)) {

            keys = originalPost
            originalPost = undefined

        } else if (!keys) {

            keys = Object.keys(newPost)

            let index = keys.indexOf("_id")

            if (index > -1) {
                keys.splice(index, 1);
            }

        }

        if (originalPost) {

            let unmodifiedEdit = true

            for (const key of keys) {

                if (newPost[key] != originalPost[key]) {

                    unmodifiedEdit = false

                }

            }

            if (unmodifiedEdit) {

                validateForm.errorMessages.push({
                    text: validateForm.errorTexts.repeatedValue["unmodifiedEdit"]
                })

                let result = {
                    errorResult: validateForm.errorResult,
                    errorMessages: validateForm.errorMessages,
                    originalPost: originalPost
                }

                return result

            }

        }

        let index = keys.indexOf("category")

        if (index > -1) {
            keys.splice(index, 1);
        }

        validateForm.analyzeAll(newPost, keys)

        await validateForm.checkValueAvailability.tools.asyncLoop(newPost, originalPost, keys, "postDB")

        let result = {
            errorResult: validateForm.errorResult,
            errorMessages: validateForm.errorMessages
        }

        if (originalPost) {
            result["originalPost"] = originalPost
        }

        return result

    },

    checkValueAvailability: {

        userDB: async (newUser, originalUser, key) => {

            await ((newUser, originalUser, key) => {
                return new Promise(async function (resolve, reject) {
        
                    try {
        
                        let evaluationKeyValue = {}
        
                        if (!originalUser) {
                            //Criando Documento
                            evaluationKeyValue[key] = newUser[key]
        
                        } else if (newUser[key] != originalUser[key]) {
                            //editando documento existente DB
                            evaluationKeyValue[key] = newUser[key]
        
                        }
                        //edição sem alterações detectada
                        if (Object.keys(evaluationKeyValue).length !== 0) {
        
                            let userWithSameValue = await User.findOne(evaluationKeyValue).lean()
        
                            if (userWithSameValue) {
        
                                validateForm.errorMessages.push({
                                    text: validateForm.errorTexts.repeatedValue[key]
                                })
        
                            }
        
                        }
        
                        resolve()
        
                    } catch (err) {
        
                        reject(err)
        
                    }
        
                })
            })(newUser, originalUser, key)
        
        },

        categoryDB: async (newCategory, originalCategory, key) => {

            await ((newCategory, originalCategory, key) => {
                return new Promise(async function (resolve, reject) {
        
                    try {
        
                        let evaluationKeyValue = {}
        
                        if (!originalCategory) {
                            //Criando Documento
                            evaluationKeyValue[key] = newCategory[key]
        
                        } else if (newCategory[key] != originalCategory[key]) {
                            //editando documento existente DB
                            evaluationKeyValue[key] = newCategory[key]
        
                        }
                        //edição sem alterações detectada
                        if (Object.keys(evaluationKeyValue).length !== 0) {
        
                            let categoryWithSameValue = await Category.findOne(evaluationKeyValue).lean()
        
                            if (categoryWithSameValue) {
        
                                validateForm.errorMessages.push({
                                    text: validateForm.errorTexts.repeatedValue[key]
                                })
        
                            }
        
                        }
        
                        resolve()
        
                    } catch (err) {
        
                        reject(err)
        
                    }
        
                })
            })(newCategory, originalCategory, key)
        
        },

        postDB: async (newPost, originalPost, key) => {

            await ((newPost, originalPost, key) => {
                return new Promise(async function (resolve, reject) {
        
                    try {
        
                        let evaluationKeyValue = {}
        
                        if (!originalPost) {
                            //Criando Documento
                            evaluationKeyValue[key] = newPost[key]
        
                        } else if (newPost[key] != originalPost[key]) {
                            //editando documento existente DB
                            evaluationKeyValue[key] = newPost[key]
        
                        }
                        //edição sem alterações detectada
                        if (Object.keys(evaluationKeyValue).length !== 0) {
        
                            let postWithSameValue = await Post.findOne(evaluationKeyValue).lean()
        
                            if (postWithSameValue) {
        
                                validateForm.errorMessages.push({
                                    text: validateForm.errorTexts.repeatedValue[key]
                                })
        
                            }
        
                        }
        
                        resolve()
        
                    } catch (err) {
        
                        reject(err)
        
                    }
        
                })
            })(newPost, originalPost, key)
        
        },

        tools: {

            asyncLoop: (newDocument, originalDocument, keys, collectionDB) => {
                if (keys.length === 0) {
            
                    return Promise.resolve()
            
                } else {
            
                    return validateForm.checkValueAvailability[collectionDB](newDocument, originalDocument, keys.shift())
                        .then(() => {
            
                            return validateForm.checkValueAvailability.tools.asyncLoop(newDocument, originalDocument, keys, collectionDB)
            
                        })
            
                }
            }

        }

    }
}




module.exports = validateForm