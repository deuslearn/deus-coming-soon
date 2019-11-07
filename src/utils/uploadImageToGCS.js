const {Storage} = require('@google-cloud/storage');
const Multer = require("multer")
const {BUCKET_NAME, PROJECT_ID, KEY_FILE} = require('./properties.js')

module.exports.multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
    }
});
        

module.exports = class CloudHandler{ 

    constructor(){
        const storage = new Storage({
            keyFilename: KEY_FILE,
            projectId : PROJECT_ID
        })
        
        // storage.getBuckets().then(x=> console.log(x))
        this.bucket = storage.bucket(BUCKET_NAME);
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

    uploadFile(file, req, next){
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
                return next();
            })
            .catch(err => {
                console.log(err)
            })
        });
        stream.end(req.file.buffer);
    }
}