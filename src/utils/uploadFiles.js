const path = require("path");
const Multer = require("multer");

const FILEDIR = path.join(__dirname + '../../../tmp')

module.exports = class FileHandler{ 
    constructor(logger){
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
}