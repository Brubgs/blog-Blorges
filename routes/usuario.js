const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")

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
        Usuario.findOne({email : req.body.email}).lean().then((usuario)=> {
            if(usuario){
                req.flash("error_msg", "Email já cadastrado")
                res.redirect("/usuarios/cadastro")
            }
            else {
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(req.body.senha, salt)
                const userData = {
                    nome: req.body.nome,
                    email:req.body.email,
                    senha: hash
                }

                new Usuario(userData).save().then(() => {
                    req.flash("success_msg", "Usuário cadastrado com sucesso")
                    res.redirect("/")
                }).catch((err) => {
                    req.flash('error_msg', 'Erro ao cadastrar o usuario')
                    res.redirect("/usuarios/cadastro")
                })            
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao cadastrar")
            res.redirect("/")
        })
    }
})

module.exports = router