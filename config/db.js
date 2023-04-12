const mongoose = require("mongoose")

module.exports = connectDB = async () => {

    let mongoURI

    if (process.env.NODE_ENV == "production") {
        mongoURI = process.env.MONGO_URI
    } else {
        mongoURI = "mongodb://0.0.0.0:27017/blogapp"
    }

    mongoose.connect(mongoURI).then(() => {
        console.log("Conectado ao MongoDB")
    }).catch((err) => {
        console.log("Erro ao conectar com o MongoDB: " + err)
    })
}




