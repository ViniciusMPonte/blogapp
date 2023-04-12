require('dotenv').config()

const express = require("express")
const session = require("express-session")
const path = require("path")
const bodyParser = require("body-parser")
const handlebars = require("express-handlebars")
const passport = require("passport")
const flash = require("connect-flash")

const app = express()

const connectDB = require("./config/db")
const registerPassport = require("./config/auth")

const homeRoutes = require("./routes/home")
const adminRoutes = require("./routes/admin")
const userRoutes = require("./routes/user")


//CONFIG
//Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Public
app.use(express.static(path.join(__dirname, "public")))


//Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))


// Passport
registerPassport(passport)
app.use(passport.initialize())
app.use(passport.session())


// Flash messages
app.use(flash())


//Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  res.locals.user = req.user || null
  next()
})


//Handlebars
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.set("views", "./views")


//ROUTES
app.use("/", homeRoutes)
app.use("/admin", adminRoutes)
app.use("/user", userRoutes)


// SERVER
const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log("Servidor rodando")
    });
  } catch (error) {
    console.error(`Erro ao iniciar o server: ${error.message}`)
  }
})()