const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")


router.get('/', (req,res) => {
    res.render("admin/index")
})

router.get('/posts', (req,res) => {
    res.send("Página de posts")
})

router.get('/categorias', (req,res) => {
    Categoria.find().lean().sort({date: 'desc'}).then((categorias)=> {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((erro)=> {
        req.flash("error_msg", "Houve um erro ao listar categorias")
        req.redirect("/admin")
    })
})

router.get("/categorias/add", (req, res) => {
    res.render("admin/addcategoria")
})

router.post("/categorias/nova", (req,res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria muito pequeno"})
    }
    if(erros.length > 0){
        res.render("admin/addcategoria", {erros: erros})
    }
    else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso")
            res.redirect('/admin/categorias')
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria. Tente novamente,")
            res.redirect('/admin')
        })
    }
})

router.get("/categorias/edit/:id", (req,res) => {
    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) =>{
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", (req,res) => {
    Categoria.findOne({_id: req.body.id}).then((categoria) => {
        var erros = []
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: "Nome inválido"})
        }
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            erros.push({texto: "Slug inválido"})
        }
        if(req.body.nome.length < 2){
            erros.push({texto: "Nome da categoria muito pequeno"})
        }
        if(erros.length > 0){
            Categoria.findOne({ _id: req.body.id }).lean().then((categoria) => {
                res.render("admin/editcategorias", { categoria: categoria, erros: erros})
            }).catch((err) => {
                req.flash("error_msg", "Erro ao pegar os dados")
                res.redirect("admin/categorias")
            })
        }
        else {
            categoria.nome = req.body.nome,
            categoria.slug = req.body.slug

            categoria.save().then(() => {
                req.flash("success_msg", "Categoria editada com sucesso")
                res.redirect("/admin/categorias")
            }).catch((err) => {
                req.flash("error_msg","Erro interno ao salvar edição da categoria")
                res.redirect("/admin/categorias")
            })
        }
        
    }).catch((err)=>{
        req.flash("error_msg", "Erro ao editar categoria")
        res.redirect("/admin/categorias")
    })

})

router.post('/categorias/deletar', (req,res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg","Categoria deletada com sucesso")
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash("error_msg", "Erro ao deletar categoria")
        res.redirect('/admin/categorias')
    })
})

router.get("/postagens", (req,res) => {
    Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens)=>{
        res.render('admin/postagens', {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Erro ao listar postagens")
        res.redirect("/admin")
    })
    
})

router.get("/postagens/add", (req,res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar formulário")
        res.redirect('/admin/postagens')
    })
})

router.post("/postagens/nova", (req,res) => {
    var erros = []

    if(req.body.categoria == "0"){
        erros.push({texto:"Categoria inválida. Registre uma categoria"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagem", {erros:erros})
    }
    else {
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(() =>{
            req.flash("success_msg", "Postagem criada com sucesso")
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash("error_msg","Erro ao salvar postagem")
            res.redirect("/admin/postagens")
        })
    }
})

router.get("/postagens/edit/:id", (req,res) => {

    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem})
        }).catch((err) => {
            req.flash("error_msg", "Erro ao listar categorias")
            res.redirect("/admin/postagens")
        })
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar formulário")
        res.redirect("/admin/postagens")
    })
})

router.post("/postagem/edit", (req,res) => {
    
    Postagem.findOne({_id: req.body.id}).then((postagem) => {
        
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Erro interno")
            res.redirect("/admin/postagens")
        })
    }).catch((err) => {
        req.flash("error_msg", "Erro ao salvar edição")
        res.redirect("/admin/postagens")
    })
})


router.get('/postagens/deletar/:id',(req,res) => {
    Postagem.deleteOne({_id: req.params.id}).then(()=>{
        req.flash("success_msg", "Postagem deletada com sucesso")
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash("error_msg", "Erro ao deletar postagem")
        res.redirect("/admin/postagens")
    })
})
module.exports = router