const nodemailer = require('nodemailer')
const path = require("path");
const fs = require("fs");

const FILEDIR = path.join(__dirname + '/../tmp')

module.exports = class MessageService{
    constructor(){
        let creds = fs.readFileSync(path.join(__dirname + "/utils/noreply_creds.json"))
        creds = JSON.parse(creds)
        this.transport = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            auth: creds
        });
    }

    async relayToDeusInfo(contactData){
        return await this.transport.sendMail({
            from: "noreply@deuslearn.com",
            to: "info@deuslearn.com",
            subject: `***Public Contact*** ${contactData.subject}` || `***Public Contact*** ${contactData.topic}`,
            html: `<p>From: ${contactData.name}</p>
            <p>Reply to: ${contactData.email}</p>
            <br>
            <p>${contactData.msg}</p>`,
            attachments: contactData.files?contactData.files.map((file)=>{
                return {
                    path: `${FILEDIR}/${file}`
                }
            }):undefined
        })
        .then((sent)=>{
            console.log(sent)
            if(contactData.files){
                contactData.files.forEach(element => {
                    this.deleteFile(element)
                });
            }
            return true
        })
        .catch((err)=>{
            console.error(err.message)
            return false
        })
    }

    deleteFile(fileName){
        fs.unlink(`${FILEDIR}/${fileName}`, (err)=>{
            if(err) console.error(err.message)
            console.log(`${FILEDIR}/${fileName} was deleted`);
        })
    }
}