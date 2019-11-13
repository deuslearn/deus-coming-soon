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

app.get('/', (req, res) => {
    let l = req.locale
    console.log(l.toString())
    res.render(PAGE, {
        page: 'home',
        locale: l.toString(),
        ...SiteText[l.language].index,
        ...SiteText[l.language].main,
    });
});

app.get('/about', (req, res) => {
    let l = req.locale.language
    res.render(PAGE, {
        page: "about",
        locale: l,
        ...SiteText[l].index,
        ...SiteText[l].about
    });
});

app.get('/contact', (req, res) => {
    let l = req.locale.language
    res.render(PAGE, {
        page:"contact",
        locale: l,
        ...SiteText[l].index,
        ...SiteText[l].contact
    });
});

app.get('/join/artist', (req, res) => {
    let l = req.locale.language
    res.render(PAGE, {
        page:"artist",
        locale: l,
        ...SiteText[l].index,
        ...SiteText[l].artist_join
    });
});

app.post('/contact' , async (req, res) => {
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
            break
    }
    if(resp)
        res.render(PAGE, {page: "message_received"})
    else
        res.render(PAGE, {page: "submit_error"});
});

app.get("/locale/:loc", (req, res) => {
    res.cookie('locale', req.params.loc, {httpOnly: true});
 
    res.statusCode = 302;
    res.setHeader('Location', req.headers.referer || '/');
    res.end();
    return;
})

app.post('/join/artist', (req, res) => {
    res.render(PAGE, {page: "message_received"})
})

app.post('/upload_document', handler.uploadFile.single('file'), (req, res) => {
    console.log("Upload Complete")
    res.send(true)
})

app.delete('/file/:fileName', (req, res) => {
    handler.deleteFile(req.params.fileName)
    res.send(true)
})
app.listen(PORT)