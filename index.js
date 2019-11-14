const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookie = require('cookie');
const cookieParser = require('cookie-parser')
const createLocaleMiddleware = require('express-locale');

const CloudHandler = require('./src/utils/uploadFiles')
const MessageService = require('./src/MessageService')

const SiteText = require("./src/SiteText")

const PORT = process.env.PORT || 8084;
const PAGE = "index"

const service = new MessageService()
const handler = new CloudHandler()

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(createLocaleMiddleware({
    "priority": ["cookie", "default"],
    "default": "en-US"
}))

app.set('view engine', 'pug')
app.set('env production');

app.locals.basedir = app.get('views');

app.use("/public", express.static(path.join(__dirname, 'public')));

function renderPage(req, res){
    res.render(PAGE, {
        page: req.pagez,
        locale: req.locale.toString(),
        ...SiteText[req.locale.language].index,
        ...SiteText[req.locale.language][req.pagez]
    });
}

app.get("/locale/:loc", (req, res) => {
    res.cookie('locale', req.params.loc, {httpOnly: true});
 
    res.statusCode = 302;
    res.setHeader('Location', req.headers.referer || '/');
    res.end();
    return;
})

app.get('/', (req, res, next) => {
    req.pagez="main"
    next()
}, renderPage);

app.get('/about', (req, res, next) => {
    req.pagez="about"
    next()
}, renderPage);

app.get('/contact', (req, res, next) => {
    req.pagez="contact"
    next()
}, renderPage);

app.post('/contact' , async (req, res, next) => {
    if(req.body.files){
        req.body.files = req.body.files.split(",")
    }
    
    let resp = null
    switch(req.body.topic){
        case "other":
        case "legal":
            resp = await service.relayToDeusInfo(req.body)
            break;
        case "art":
        case "job":
        case "story":
        default:
            resp = true
            break
    }
    if(resp==true){
        req.pagez="message_received";   
        next()
    }    
    else{
        res.render(PAGE, {
            page: "message_received",
            locale: req.locale.toString(),
            ...SiteText[req.locale.language].index,
            thanks: "There was an error with your submission",
            ab_style: "text-align:left;",
            ...resp
        });
    }
}, renderPage)

app.get('/join/artist', (req, res, next) => {
    req.pagez="artist_join"
    next()
}, renderPage);

app.post('/join/artist', async (req, res, next) => {
    // console.log(req.body)
    resp = await service.relayToDeusInfo(req.body, "join")
    if(resp==true){
        req.pagez="message_received";   
        next()
    }    
    else{
        res.render(PAGE, {
            page: "message_received",
            locale: req.locale.toString(),
            ...SiteText[req.locale.language].index,
            thanks: "There was an error with your submission",
            ab_style: "text-align:left;",
            ...resp
        });
    }
}, renderPage)

app.post('/upload_document', handler.uploadFile.single('file'), (req, res) => {
    console.log("Upload Complete")
    res.send(true)
})

app.delete('/file/:fileName', (req, res) => {
    handler.deleteFile(req.params.fileName)
    res.send(true)
})

app.listen(PORT)