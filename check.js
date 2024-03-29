#!/usr/bin/env node

import sslChecker from 'ssl-checker-node-api';
import axios from 'axios';
import { program } from 'commander';
import Conf from 'conf';
import moment from 'moment';
import * as emoji from 'node-emoji'
import ora from 'ora';
import updateNotifier from 'update-notifier';
import { readFileSync } from "fs";
const packageJSON = JSON.parse(readFileSync(new URL("./package.json", import.meta.url)));

updateNotifier({pkg: packageJSON}).notify();

const config = new Conf({
    projectName: 'ssl-expiry-reminder'
});

program.version(packageJSON.version)
    .option('-d, --domain <domain name>', 'Add domain without http/https (This Command line Argument for Automation Task)')
    .option('-s, --status <domain name>', 'Add domain without http/https')
    .option('-g, --gotify <GOTIFY API URL>', 'Gotify URL with Application Key')
    .option('-t, --telegram <Telegram API URL>', 'Telegram API URL with your Bot Key')
    .option('-c, --chatid <Telegram Chat or Channel ID>', 'Telegram Channel ID or Chat ID')
    .option('-r, --remainder <Enter the Day Remaining 1 to 10>', 'Enter the Remaining Day to Get SSL Expiry Remainder Alert')
program.parse(process.argv);

function sendMessage(message, alert = false) {
    //manipulate the message
    message = 'SSL Expiry reminder ' + (alert ? '🚨' : '✅') + '\n\n' + message;

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
                    console.log('Something Went Wrong - Enter the Correct Telegram API URL or Chat ID');
                }
            });
    } else {
        console.log('Config Error: Telegram BOT API Key or Chat ID is Missing');
    }
}

function gotifyMessage(hello, alert = false) {
    var GOTIFY_API = config.get('key');
    if (GOTIFY_API) {
        var url = GOTIFY_API
        var bodyFormData = {
            title:  'SSL Expiry reminder ' + (alert ? '🚨' : '✅'),
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
                    console.log('Something Went Wrong - Enter the Correct API URL');
                }
            });
    } else {
        console.log('Config Error: Gotify API URL and Key is Missing');
    }
}

const options = program.opts();

if (options.gotify) {
    config.set('key', options.gotify);
    var GOTIFY_URL = config.get('key');
    console.log('your Gotify API Key is Stored\t' + GOTIFY_URL);
} else if (options.telegram) {
    config.set('telegramkey', options.telegram);
    var TELEGRAM_URL = config.get('telegramkey');
    console.log('your Telegram API URL is Stored\t' + TELEGRAM_URL);
} else if (options.chatid) {
    config.set('telegramchatid', options.chatid);
    var TELEGRAM_CHATID = config.get('telegramchatid');
    console.log('your Telegram Chat ID is Stored\t' + TELEGRAM_CHATID);
} else if (options.remainder) {
    config.set('sslremainder', options.remainder);
    var SSL_REMAINDER = config.get('sslremainder');
    console.log('your SSL Expiry Remainder day saved\t' + SSL_REMAINDER);
} else if (options.domain) {
    const lval = options.domain;
    sslChecker(lval).then((certdata) => {

        console.log(certdata);

        var startdate = new Date(certdata.validFrom);
        var enddate = new Date(certdata.validTo);
        var certstart = moment(startdate);
        var certend = moment(enddate);
        var SSL_REMAINDER = config.get('sslremainder');
        let message = `Domain: \n${lval}\n\nCertificate Valid from: \n${certstart.format('LLLL')}\n\nCertificate Expiry date: \n${certend.format('LLLL')}\n\nDays Remaining: \n${certdata.daysRemaining}`;
        let isAlert =  certdata.daysRemaining <= SSL_REMAINDER;

        sendMessage(message, isAlert);
        gotifyMessage(message, isAlert);

    }).catch((err) => {
        if (err.code === 'ENOTFOUND') {
            console.log('Fix Hostname or Provide Correct Domain Name');
        } else if (err.code === 'ECONNREFUSED') {
            console.log('Fix Hostname or Provide Correct Domain Name');
        }
    });
} else if (options.status) {
    const userdomain = options.status;
    const spinner = new ora({
		text: 'Fetching SSL Data...',
		spinner: 'hamburger'
	});
	spinner.start();
    sslChecker(userdomain).then((certdata) => {
        var startdate = new Date(certdata.validFrom);
        var enddate = new Date(certdata.validTo);
        var certstart = moment(startdate);
        var certend = moment(enddate);
        var provider = certdata.issuer
        spinner.stop();
        console.log(userdomain + '\n' + 'Certificate Valid from' + '\n' + certstart.format('LLLL') + '\n' + 'Certificate Expiry date' + '\n' + certend.format('LLLL') + '\n' + 'Days Remaining:' + '\t' + certdata.daysRemaining + '\n' + 'Provider: ' + provider);
    }).catch((err) => {
        if (err.code === 'ENOTFOUND') {
            spinner.stop();
            console.log('Fix Hostname or Provide Correct Domain Name');
        } else if (err.code === 'ECONNREFUSED') {
            spinner.stop();
            console.log('Fix Hostname or Provide Correct Domain Name');
        }
    });
} else {
    console.log('Please Enter a Valid Option For More Info Run: checkssl -h');
}