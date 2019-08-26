const sslChecker = require('ssl-checker');
const axios = require('axios');
const args = process.argv.slice(2);
var moment = require('moment');
var emoji = require('node-emoji');
require('dotenv').config();

///////////////////////////
// Send Telegram Message //
///////////////////////////

function sendMessage(message) {
    if (process.env.CHATID && process.env.TELEGRAM) {
        var url = process.env.TELEGRAM
        var bodyFormData = {
            chat_id: process.env.CHATID,
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
                    console.log('Twitter API URL is Missing');
                } else {
                    console.log(error.response.data);
                }
            });
    } else {
        console.log('ENV Error: Telegram BOT API Key or Chat ID is Missing');
    }
}

////////////////////////////////////////
// Send Push Message to Gotify Server //
////////////////////////////////////////

function gotifyMessage(hello) {
    if (process.env.URL) {
        var url = process.env.URL
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
        console.log('ENV Error: Gotify API URL and Key is Missing');
    }
}

/////////////////////////////////////////////////////////////////////////
// sendMessage - Telegram                                              //
// gotifyMessage - Gotify                                              //
/////////////////////////////////////////////////////////////////////////

if (process.argv[2] === undefined) {
    console.log('Empty Output');
} else {
    args.forEach(function(val) {
        const lval = val;
        sslChecker(lval).then((certdata) => {

            console.log(certdata);

            var startdate = new Date(certdata.valid_from);
            var enddate = new Date(certdata.valid_to);
            var certstart = moment(startdate);
            var certend = moment(enddate);

            sendMessage(lval + '\n' + 'Certificate Valid from \t' + emoji.get("raised_hand_with_fingers_splayed") + '\n' + certstart.format('LLLL') + '\n' + 'Certificate Expirey date \t' + emoji.get("point_down") + '\n' + certend.format('LLLL') + '\n' + 'Days Remaining \t' + emoji.get("clock8") + '\t' + certdata.days_remaining);
            gotifyMessage(lval + '\n' + 'Certificate Valid from \t' + emoji.get("raised_hand_with_fingers_splayed") + '\n' + certstart.format('LLLL') + '\n' + 'Certificate Expirey date \t' + emoji.get("point_down") + '\n' + certend.format('LLLL') + '\n' + 'Days Remaining \t' + emoji.get("clock8") + '\t' + certdata.days_remaining);

            if (certdata.days_remaining == '2') {
                sendMessage('Status: Oops time to Renew SSL for \t' + lval + '\t' + emoji.get("rotating_light"));
                gotifyMessage('Status: Oops time to Renew SSL \t' + lval + '\t' + emoji.get("rotating_light"));
            }

        }).catch((err) => {
            if (err.code === 'ENOTFOUND') {
                console.log('Fix Hostname or Provide Correct Domain Name');
            }
        });
    });
}