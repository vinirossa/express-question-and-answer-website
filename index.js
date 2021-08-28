const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

connection
    .authenticate()
    .then(() => {
        console.log("Conexão realizada com o banco de dados.")
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })

app.set("view engine","ejs")
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.get("/",(req, res) => {
    res.locals.title = "Guia Perguntas - Home"

    Pergunta.findAll({raw: true, order:[['id','DESC']]})
    .then(perguntas => {
        res.render("index",{
            perguntas: perguntas
        })
    })
})

app.get("/perguntar",(req, res) => {
    res.locals.title = "Guia Perguntas - Perguntar"
    res.render("perguntar")
})

app.post("/salvarpergunta",(req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    console.log("Salvando dados...")
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/")
    })
})

app.get("/pergunta/:id",(req, res) => {
    res.locals.title = "Guia Perguntas - Pergunta"
    var id = req.params.id

    Pergunta.findOne({raw: true, where: {id: id}})
    .then(pergunta => {
        if(pergunta != undefined) {

            Resposta.findAll({raw: true, where: {perguntaId: pergunta.id}, order: [['id','DESC']]})
            .then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
            
        } else {
            res.redirect("/")
        }
    })
})

app.post("/responder",(req, res) => {
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('back')
    })
})

app.listen(8080, ()=> { console.log("App rodando...") })
