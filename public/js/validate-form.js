const forms = document.querySelectorAll('.needs-validation')
const inputs = document.querySelectorAll('.form-control')

Array.from(forms).forEach(form => {
    form.addEventListener('submit', (event) => {

        validateAll()

        if (document.querySelectorAll('.is-invalid').length > 0) {
            event.preventDefault()
            event.stopPropagation()
        }

    }, false)
})

inputs.forEach(input => {
    input.addEventListener('blur', () => { validate(input) })
})

function validate(input) {

    validateForm[input.name](input.value)

    if (validateForm.errorResult) {

        let errorMessage = validateForm.errorMessages[0].text
        validateForm.cleanErrorMessages()

        input.classList.add('is-invalid')
        input.classList.remove('is-valid')
        input.parentElement.querySelector("div.invalid-feedback").innerHTML = errorMessage

    } else {

        input.classList.add('is-valid')
        input.classList.remove('is-invalid')

    }

}

function validateAll() {

    inputs.forEach((input) => { validate(input) })

}

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/([à-ã]*)([è-ê]*)([ì-î]*)([ò-õ]*)([ù-û]*)(ç*)/g, ($0, $1, $2, $3, $4, $5, $6) => {

            if ($0) {
                $1 = $1 ? "a" : "";
                $2 = $2 ? "e" : "";
                $3 = $3 ? "i" : "";
                $4 = $4 ? "o" : "";
                $5 = $5 ? "u" : "";
                $6 = $6 ? "c" : "";
            }
        
            return $1 + $2 + $3 + $4 + $5 + $6;
        })
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s]+/g, '-')
        .replace(/^-+/g, '')
        .replace(/-+$/g, '')
        .replace(/-+/g, '-')
        .replace(/_/g, '-')
        .substring(0, 70)
}

const validateForm = {
    errorMessages: [],

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

            validateForm.errorMessages.push({ text: "Insira um nome" })

        } else if (name.length < 3) {

            validateForm.errorMessages.push({ text: "Nome deve ter no mínimo 3 caracteres" })

        }

    },

    email: (email) => {

        let emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

        if (!email) {

            validateForm.errorMessages.push({ text: "Insira um email" })

        } else if (!emailRegex.test(email)) {

            validateForm.errorMessages.push({ text: "Email inválido" })

        }

    },

    password: (password) => {

        const repeatedPassword = document.querySelector('input[name="repeatedPassword"]')

        if (repeatedPassword) {
            if (repeatedPassword.value.length > 0) {
                validate(repeatedPassword)
            }
        }


        let passwordRegex = /^\S{4,}$/

        if (!password) {

            validateForm.errorMessages.push({ text: "Insira uma senha" })

        } else if (password.length < 4) {

            validateForm.errorMessages.push({ text: "Senha deve ter no mínimo 4 caracteres" })

        } else if (!passwordRegex.test(password)) {

            validateForm.errorMessages.push({ text: "A senha não pode possuir espaços em branco" })

        }

    },

    repeatedPassword: (repeatedPassword) => {

        const password = document.querySelector('input[name="password"]').value

        if (!repeatedPassword) {

            validateForm.errorMessages.push({ text: "Repita a senha" })

        } else if (password != repeatedPassword) {

            validateForm.errorMessages.push({ text: "As senhas são diferentes" })

        }

    },

    slug: (slug) => {

        let nameOrTitle

        if (document.querySelector('input[name="name"]')) {
            nameOrTitle = document.querySelector('input[name="name"]').value
        } else if (document.querySelector('input[name="title"]')) {
            nameOrTitle = document.querySelector('input[name="title"]').value
        } else {
            nameOrTitle = ""
        }


        let nameOrTitleRegexTest = /[a-z0-9]/i
        let slugSuggestion

        if (nameOrTitleRegexTest.test(nameOrTitle)) {

            slugSuggestion = `, tente algo como "${slugify(nameOrTitle)}"`

        } else {

            slugSuggestion = ""

        }

        let slugRegex = /^[a-z0-9]+(?:(?:-|_)?[a-z0-9]+)*$/

        if (!slug) {

            validateForm.errorMessages.push({ text: `Insira um slug${slugSuggestion}` })

        } else if (!slugRegex.test(slug)) {

            validateForm.errorMessages.push({ text: `Slug inválido${slugSuggestion}` })

        }

    },

    category: (category) => {

        if (category == "0") {

            validateForm.errorMessages.push({ text: "Categoria inválida, registre uma categoria." })

        }
    },

    title: (title) => {

        if (!title) {

            validateForm.errorMessages.push({ text: "Insira um título" })

        } else if (title.length > 70) {

            validateForm.errorMessages.push({ text: "O título deve ter no máximo 70 caracteres." })

        }

    },

    description: (description) => {

        if (!description) {

            validateForm.errorMessages.push({ text: "Insira uma descrição" })

        } else if (description.length > 150) {

            validateForm.errorMessages.push({ text: "A descrição deve ter no máximo 150 caracteres" })

        }

    },

    content: (content) => {

        if (content.length < 300 || content.length > 1000) {

            validateForm.errorMessages.push({ text: "O conteúdo deve ter entre 300 a 1000 caracteres" })

        }

    },

    analyzeAll: (obj, keys) => {

        if (!keys) {

            keys = Object.keys(obj)

            const index = keys.indexOf("_id")

            if (index > -1) {
                keys.splice(index, 1)
            }

        }

        for (const key of keys) {

            validateForm[key](obj[key])

        }
    }
}


let charCountAll = document.querySelectorAll('.char-count')

charCountAll.forEach(charCount => {
    charCount.addEventListener('input', () => {

        validate(charCount)

        let charactersRemaining = charCount.maxLength - charCount.value.length
        
        let countTags = charCount.parentElement.querySelectorAll("small")

        countTags.forEach(countTag => {
            countTag.innerHTML = `${charactersRemaining} caracteres restantes`
        })

    })
})