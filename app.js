const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

const app = express()
const admin = require('./routes/admin')
const path = require('path')

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

    app.use((req,res,next) => {
        console.log('I am a middleware')
        next()
    })

    //mongoose
    mongoose.Promise = global.Promise
    mongoose.connect("mongodb://localhost/blog").then(()=> {
        console.log('Conectado ao mongo')
    }).catch((error) => {
        console.log('Erro ao se conectar: ' + error)
    })


//rotas
app.get('/',(req,res) => {
    res.send("Rota principal")
})
app.use('/admin', admin)

app.listen(3000, () => {
    console.log("Servidor rodando")
})