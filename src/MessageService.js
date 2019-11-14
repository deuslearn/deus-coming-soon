const nodemailer = require('nodemailer')
const path = require("path");
const fs = require("fs");

const FILEDIR = path.join(__dirname + '/../tmp')

module.exports = class MessageService{
    constructor(){
        let creds = fs.readFileSync(path.join(__dirname + "/utils/noreply_creds.json"))
        this.transport = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            auth: JSON.parse(creds)
        });
    }

    createLinks(links){
        if(!links)
            return null
        return links.split(",").map((link)=>{
            return `<a href="${link}">${link}</a>`
        })
    }

    contactTemplate(contactData){
        return {
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
        }
    }

    joinTemplate(contactData){
        return {
            from: "noreply@deuslearn.com",
            to: "info@deuslearn.com",
            subject: `***Artist Application*** ${contactData.name} wants in!`,
            html: `<p>From: ${contactData.name}</p>
            <p>Reply to: ${contactData.email}</p>
            <br>
            <p>${contactData.name} ${contactData.pen?"aka "+contactData.pen:null} wants in.</p>
            <p>They have been doing this for ${contactData.exp} years.</p>
            <p>Coming straight out of the ${contactData.country}.</p>
            <p>They can speak ${contactData.languages}</p>
            <br>
            <p>What they have to say:</p>
            <p>"${contactData.msg}"</p>
            <p>Links to their work: ${(this.createLinks(contactData.lowers)) || "n/a"}</p>`,
            attachments: contactData.files&&contactData.files.map?contactData.files.map((file)=>{
                return {
                    path: `${FILEDIR}/${file}`
                }
            }):null || contactData.files?{path:`${FILEDIR}/${contactData.files}`}:undefined
        }
    }

    async relayToDeusInfo(contactData, msgType="contact"){
        return await this.transport.sendMail(msgType=="join"?this.joinTemplate(contactData):this.contactTemplate(contactData))
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
            console.error(err.code)
            if(err.code == "EMESSAGE"){
                return {
                    resp: "One of your attached files is of or contains a file type deemed unsecure. If your submission contains one or more of the following file types please remove them and resubmit:",
                    types: "ade, adp, apk, appx, appxbundle, bat, cab, chm, cmd, com, cpl, dll, dmg, exe, hta, ins, iso, isp, jar, js, jse, lib, lnk, mde, msc, msi, msix, msixbundle, msp, mst, nsh, pif, ps1, scr, sct, shb, sys, vb, vbe, vbs, vxd, wsc, wsf, and wsh"
                }
            }
            return {resp: "There was an error with the server. Please try again later."}

        })
    }

    deleteFile(fileName){
        fs.unlink(`${FILEDIR}/${fileName}`, (err)=>{
            if(err) console.error(err.message)
            console.log(`${FILEDIR}/${fileName} was deleted`);
        })
    }
}