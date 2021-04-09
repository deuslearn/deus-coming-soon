require('dotenv').config()
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createLocaleMiddleware = require('express-locale');
const logger = require('./src/utils/logger')

const FileHandler = require('./src/utils/uploadFiles');
const MessageService = require('./src/MessageService');

const SiteText = require("./src/SiteText");

const PORT = process.env.PORT;
const PAGE = "index";

const service = new MessageService(logger);
const handler = new FileHandler(logger);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(createLocaleMiddleware({
    "priority": ["cookie", "default"],
    "default": "en-US"
}));

app.set('view engine', 'pug');
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
        case "art":
        case "job":
        case "story":
            resp = await service.relayToDeusInfo(req.body)
            break;
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
}, renderPage);

app.get('/subscribed', (req, res) => {
    res.render(PAGE, {
        page: "message_received",
        locale: req.locale.toString(),
        ...SiteText[req.locale.language].index,
        thanks2: "Thank you for subscribing!",
        confirm: "Please confirm your email address in the confirmation email sent to start receiving updates."
    });
});

app.get('/artist', (req, res, next) => {
    req.pagez="artist_join"
    next()
}, renderPage);

app.post('/artist', async (req, res, next) => {
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
}, renderPage);

app.post('/upload_document', handler.uploadFile.single('file'), (req, res) => {
    logger.info("Upload Complete")
    res.send(true)
});

app.delete('/file/:fileName', (req, res) => {
    handler.deleteFile(req.params.fileName)
    res.send(true)
});

app.get("/locale/:loc", (req, res) => {
    res.cookie('locale', req.params.loc, {httpOnly: true});
    res.statusCode = 302;
    res.setHeader('Location', req.headers.referer || '/');
    res.end();
    return;
});

logger.info(`Application listening on port ${PORT}`)
app.listen(PORT);