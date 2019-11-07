const path = require('path')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MessageService = require('./src/MessageService')

const PORT = process.env.PORT || 8084;

const PAGE = process.env.PAGE || "index"

let service = new MessageService()

app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'pug')
app.set('env production');

app.locals.basedir = app.get('views');

app.use("/public", express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render(PAGE, {page: 'home'});
});

app.get('/about', (req, res) => {
    res.render(PAGE, {page: "about"});
});

app.get('/contact', (req, res) => {
    res.render(PAGE, {page:"contact"});
});

app.post('/contact', (req, res) => {
    let resp = null
    switch(req.body.topic){
        case "other":
        case "legal":
            resp = service.relayToDeusInfo(req.body)
            break;
        case "art":
        case "job":
        case "story":
        default:
            break
    }
    if(resp)
        res.render(PAGE, {page: "message_received"});
    else
        res.render(PAGE, {page: "message_received"})
});

app.listen(PORT)