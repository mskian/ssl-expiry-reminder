#!/usr/bin/env node

const sslChecker = require('ssl-checker');
const axios = require('axios');
const program = require('commander');
const Conf = require('conf');
var moment = require('moment');
var emoji = require('node-emoji');

var pkg = require('./package.json');
const config = new Conf({
    projectName: 'ssl-expiry-reminder'
});

program.version(pkg.version)
    .option('-d, --domain <domain name>', 'Add domain without http/https (This Command line Argument for Automation Task)')
    .option('-s, --status <domain name>', 'Add domain without http/https')
    .option('-g, --gotify <GOTIFY API URL>', 'Gotify URL with Application Key')
    .option('-t, --telegram <Telegram API URL>', 'Telegram API URL with your Bot Key')
    .option('-c, --chatid <Telegram Chat or Channel ID>', 'Telegram Channel ID or Chat ID')
    .option('-r, --remainder <Enter the Day Remaining 1 to 10>', 'Enter the Remaining Day to Get SSL Expiry Remainder Alert')
program.parse(process.argv);

function sendMessage(message) {
    var TELEGRAM_URL = config.get('telegramkey');
    var TELEGRAM_CHATID = config.get('telegramchatid');
    if (TELEGRAM_CHATID && TELEGRAM_URL) {
        var url = TELEGRAM_URL
        var bodyFormData = {
            chat_id: TELEGRAM_CHATID,
            parse_mode: 'html',
            text: message,
        }
        axios({
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: url,
                data: bodyFormData,
            })
            .then(function(response) {
                console.log(response.data);
            })
            .catch(function(error) {
                if (!error.response) {
                    console.log('Telegram API URL is Missing');
                } else {
                    console.log(error.response.data);
                }
            });
    } else {
        console.log('Config Error: Telegram BOT API Key or Chat ID is Missing');
    }
}

function gotifyMessage(hello) {
    var GOTIFY_API = config.get('key');
    if (GOTIFY_API) {
        var url = GOTIFY_API
        var bodyFormData = {
            title: 'Uptime Status',
            message: hello,
            priority: 5
        };
        axios({
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: url,
                data: bodyFormData,
            })
            .then(function(response) {
                console.log(response.data);
            })
            .catch(function(error) {
                if (!error.response) {
                    console.log('Gotify API URL is Missing');
                } else {
                    console.log(error.response.data);
                }
            });
    } else {
        console.log('Config Error: Gotify API URL and Key is Missing');
    }
}

if (program.gotify) {
    config.set('key', program.gotify);
    var GOTIFY_URL = config.get('key');
    console.log('your Gotify API Key is Stored\t' + GOTIFY_URL);
} else if (program.telegram) {
    config.set('telegramkey', program.telegram);
    var TELEGRAM_URL = config.get('telegramkey');
    console.log('your Telegram API URL is Stored\t' + TELEGRAM_URL);
} else if (program.chatid) {
    config.set('telegramchatid', program.chatid);
    var TELEGRAM_CHATID = config.get('telegramchatid');
    console.log('your Telegram Chat ID is Stored\t' + TELEGRAM_CHATID);
} else if (program.remainder) {
    config.set('sslremainder', program.remainder);
    var SSL_REMAINDER = config.get('sslremainder');
    console.log('your SSL Expiry Remainder day saved\t' + SSL_REMAINDER);
} else if (program.domain) {
    const lval = program.domain;
    sslChecker(lval).then((certdata) => {

        console.log(certdata);

        var startdate = new Date(certdata.validFrom);
        var enddate = new Date(certdata.validTo);
        var certstart = moment(startdate);
        var certend = moment(enddate);

        sendMessage(lval + '\n' + 'Certificate Valid from \t' + emoji.get("raised_hand_with_fingers_splayed") + '\n' + certstart.format('LLLL') + '\n' + 'Certificate Expirey date \t' + emoji.get("point_down") + '\n' + certend.format('LLLL') + '\n' + 'Days Remaining \t' + emoji.get("clock8") + '\t' + certdata.daysRemaining);
        gotifyMessage(lval + '\n' + 'Certificate Valid from \t' + emoji.get("raised_hand_with_fingers_splayed") + '\n' + certstart.format('LLLL') + '\n' + 'Certificate Expirey date \t' + emoji.get("point_down") + '\n' + certend.format('LLLL') + '\n' + 'Days Remaining \t' + emoji.get("clock8") + '\t' + certdata.daysRemaining);

        var SSL_REMAINDER = config.get('sslremainder');
        if (certdata.daysRemaining == 5 || certdata.daysRemaining == SSL_REMAINDER) {
            sendMessage('Status: Oops time to Renew SSL for \t' + lval + '\t' + emoji.get("rotating_light"));
            gotifyMessage('Status: Oops time to Renew SSL \t' + lval + '\t' + emoji.get("rotating_light"));
        }

    }).catch((err) => {
        if (err.code === 'ENOTFOUND') {
            console.log('Fix Hostname or Provide Correct Domain Name');
        } else if (err.code === 'ECONNREFUSED') {
            console.log('Fix Hostname or Provide Correct Domain Name');
        }
    });
} else if (program.status) {
    const userdomain = program.status;
    sslChecker(userdomain).then((certdata) => {
        var startdate = new Date(certdata.validFrom);
        var enddate = new Date(certdata.validTo);
        var certstart = moment(startdate);
        var certend = moment(enddate);
        console.log(userdomain + '\n' + 'Certificate Valid from' + '\n' + certstart.format('LLLL') + '\n' + 'Certificate Expirey date' + '\n' + certend.format('LLLL') + '\n' + 'Days Remaining:' + '\t' + certdata.daysRemaining);
    }).catch((err) => {
        if (err.code === 'ENOTFOUND') {
            console.log('Fix Hostname or Provide Correct Domain Name');
        } else if (err.code === 'ECONNREFUSED') {
            console.log('Fix Hostname or Provide Correct Domain Name');
        }
    });
} else {
    console.log('Please Enter a Valid Option For More Info Run: checkssl -h');
}