const express=require('express')
const app=express()

const path=require("path")
const bodyParser=require("body-parser")
const session= require("express-session")
const connectFlash = require('connect-flash')

const nocache=require("nocache")
const morgan=require("morgan")

const PORT=process.env.PORT||7000

const dotenv=require("dotenv")
dotenv.config()

require("./config/database")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
    secret:process.env.SESSION_SECRET_KEY,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:72 * 60 * 60 * 1000,
        httpOnly:true
    }
}))

app.use(connectFlash());
app.use((req, res, next) => {
    res.locals.messages = req.flash()
    next();
})
app.set("view engine", "ejs")
app.set("views",[path.join(__dirname,"views/users"),path.join(__dirname,"views/admin")])

// app.use(express.static(path.join(__dirname,"public")))
app.use(express.static(path.join(__dirname,"public")))
app.use(express.static("public"))
const userRoutes=require("./routes/userRoute")
const adminRoutes=require("./routes/adminRoute")

app.use("/",userRoutes)
app.use("/admin",adminRoutes)

app.get('*', function(req,res){
    res.redirect("/pageNotFound")
})

app.listen(PORT,()=>console.log(`server running on http://localhost:${PORT}`));

