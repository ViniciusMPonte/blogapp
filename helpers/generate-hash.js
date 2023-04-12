const bcrypt = require("bcryptjs")


function generateHash(password) {

    return new Promise(async function (resolve, reject) {

        const saltRounds = 10;

        try {

            const salt = await bcrypt.genSalt(saltRounds)
            const hash = await bcrypt.hash(password, salt)

            resolve(hash)

        } catch (err) {

            reject(err)

        }
    })
}


module.exports = generateHash