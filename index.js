const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const CloudHandler = require('./src/utils/uploadFiles')
const MessageService = require('./src/MessageService')

const PORT = process.env.PORT || 8084;
const PAGE = "index"

const service = new MessageService()
const handler = new CloudHandler
const app = express()

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

app.get('/join/artist', (req, res) => {
    res.render(PAGE, {page:"artist"});
});

app.post('/contact' , async (req, res) => {
    if(req.body.files){
        req.body.files = req.body.files.split(",")
    }
    console.log(req.body)

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
        res.render(PAGE, {page: "submit_error"});
    else
        res.render(PAGE, {page: "message_received"})
});

app.post('/upload_document', handler.uploadFile.single('file'), (req, res) => {
    console.log("Upload Complete")
    res.send(true)
})

app.post('upload_images', handler.uploadFile.single('images'), (req, res) => {
    
})

app.delete('/file/:fileName', (req, res) => {
    handler.deleteFile(req.params.fileName)
    res.send(true)
})
app.listen(PORT)