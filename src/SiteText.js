const fs = require("fs")
const path = require("path")

const getPageText = (lang)=>{
    pages = {}
    for(file of ["main", "index", "about", "contact", "artist_join"])
        pages[file] = JSON.parse(fs.readFileSync(path.join(__dirname + `/data/${lang}/${file}.json`)))
    return pages
}

module.exports.en=getPageText("en-US")
module.exports.ja=getPageText("ja-JA")
module.exports.ko=getPageText("ko-KO")