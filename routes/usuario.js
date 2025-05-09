const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

router.get("/cadastro", (req,res) => {
    res.render("usuarios/cadastro")
})

router.post("/cadastro", (req,res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    else if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido"})
    }

    else if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválida"})
    }

    else if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta"})
    }

    else if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas não correspondem"})
    }

    if(erros.length > 0) {
        res.render("usuarios/cadastro", {erros:erros})
    }else {

    }
})

module.exports = router