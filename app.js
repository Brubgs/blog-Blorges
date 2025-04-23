const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')

const app = express()
const admin = require('./routes/admin')
const path = require('path')

//Configs  
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())

    //Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');
    app.set('views', './views');

    //public
    app.use(express.static(path.join(__dirname + "/public")))


//rotas
app.get('/',(req,res) => {
    res.send("Rota principal")
})
app.use('/admin', admin)



app.listen(3000, () => {
    console.log("Servidor rodando")
})