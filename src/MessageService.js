const nodemailer = require('nodemailer')
const path = require("path");
const fs = require("fs");

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

    relayToDeusInfo(contactData){
        try{
            this.transport.sendMail({
                from: "noreply@deuslearn.com",
                to: "info@deuslearn.com",
                subject: `***Public Contact*** ${contactData.subject}` || `***Public Contact*** ${contactData.topic}`,
                html: `<p>From: ${contactData.name}</p>
                <p>Reply to: ${contactData.email}</p>
                <br>
                <p>${contactData.msg}</p>`
            })
            return true
        }
        catch(err){
            console.error(err.message)
            return false
        }
    }
}