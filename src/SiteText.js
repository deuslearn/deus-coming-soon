const fs = require("fs")
const path = require("path")

const getPageText = (lang)=>{
    pages = {}
    for(file of ["main", "index", "about", "contact", "artist_join", "message_received"])
        pages[file] = require(`./data/${lang}/${file}`)
    return pages
}

module.exports.en=getPageText("en-US")
module.exports.ja=getPageText("ja-JP")
module.exports.ko=getPageText("ko-KR")