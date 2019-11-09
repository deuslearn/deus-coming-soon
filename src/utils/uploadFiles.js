const fs = require('fs');
const path = require("path");
const Multer = require("multer");
const {Storage} = require('@google-cloud/storage');

const {BUCKET_NAME, PROJECT_ID, KEY_FILE} = require('./properties.js');
const FILEDIR = path.join(__dirname + '../../../tmp')

module.exports = class CloudHandler{ 

    constructor(){
        let id = fs.readFileSync(PROJECT_ID)
        id = JSON.parse(id)
        const storage = new Storage({
            keyFilename: KEY_FILE,
            projectId : id
        })
        
        // storage.getBuckets().then(x=> console.log(x))
        this.bucket = storage.bucket(BUCKET_NAME);

        let multerStorage = Multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, FILEDIR )
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname)
            }
        })
        
        this.uploadFile = Multer({storage: multerStorage})
    }

    getPrivateUrl(filename){
        return `https://storage.cloud.google.com/public_contact/${filename}`;
    }

    uploadImage(req, res, next){
        if (!req.file) {
            return next();
        }

        const gcsname = `${req.body.topic}/${req.body.email}/` + req.file.originalname;
        const file = this.bucket.file(gcsname);

        this.uploadFile(file, req, next)
        return
    }

    uploadDocument(req, res, next){
        if (!req.file) {
            return next();
        }
        
        const gcsname = `${req.body.topic}/${req.body.email}/` + req.file.originalname;
        const file = this.bucket.file(gcsname);

        this.uploadFile(file, req, next)
        return
    }

    uploadFiles(file, req, next){
        const stream = file.createWriteStream({
            metadata: {
            contentType: req.file.mimetype
            },
            resumable: false
        });

        stream.on('error', (err) => {
            req.file.cloudStorageError = err;
            next(err);
        });

        stream.on('finish', () => {
            file.makePublic()
            .then(() => {
                req.file.cloudStoragePrivateUrl = getPrivateUrl(gcsname);
                this.deleteFile(req.file)
                return next();
            })
            .catch(err => {
                console.log(err)
            })
        });
        stream.end(req.file.buffer);
    }

    deleteFile(fileName){
        fs.unlink(`${FILEDIR}/${fileName}`, (err)=>{
            if(err) console.error(err.message)
            console.log(`${FILEDIR}/${fileName} was deleted`);
        })
    }
}