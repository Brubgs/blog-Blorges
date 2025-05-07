const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

const app = express()
const admin = require('./routes/admin')
const path = require('path')
require("./models/Postagem")
const Postagem = mongoose.model('postagens')

//Configs  
    //sessao
    app.use(session({
        secret: "cursonode",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())

    //middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    app.use(express.urlencoded({extended: true}))
    app.use(express.json())

    //Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');
    app.set('views', './views');

    //public
    app.use(express.static(path.join(__dirname + "/public")))

    //mongoose
    mongoose.Promise = global.Promise
    mongoose.connect("mongodb://localhost/blog").then(()=> {
        console.log('Conectado ao mongo')
    }).catch((error) => {
        console.log('Erro ao se conectar: ' + error)
    })


//rotas
app.get('/',(req,res) => {
    Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
        res.render("index", {postagens:postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/404")
    })
    
})

app.get("/postagem/:slug", (req,res) => {
    Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
        if(postagem){
            res.render("postagem/index", {postagem: postagem})
        }
        else {
            res.flash("error_msg", "Essa postagem não existe")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/")
    })
})

app.get("/404", (req,res) => {
    res.send("Erro 404")
})

app.use('/admin', admin)

app.listen(3000, () => {
    console.log("Servidor rodando")
})