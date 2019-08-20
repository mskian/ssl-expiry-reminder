const telegram = require('telegram-bot-api');
const sslChecker = require('ssl-checker');
const axios = require('axios');
const args = process.argv.slice(2);
var moment = require('moment');
var emoji = require('node-emoji');
require('dotenv').config();

///////////////////////////
// Register Telegram API //
///////////////////////////

var telegramapi = new telegram({
    token: process.env.BOTAPIKEY,
    updates: {
        enabled: true
    }
});

///////////////////////////
// Send Telegram Message //
///////////////////////////

function sendMessage(message) {
    telegramapi.sendMessage({
            chat_id: process.env.CHATID,
            parse_mode: 'html',
            text: message,
        })
        .then(function(data) {
            console.log(data);
            process.exit(1);
        });
}

////////////////////////////////////////
// Send Push Message to Gotify Server //
////////////////////////////////////////

function gotifyMessage(hello) {
    var url = process.env.URL
    var bodyFormData = {
        title: 'SSL Notification',
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
            process.exit(1);
        })
        .catch(function(error) {
            console.log(error);
        });
}

/////////////////////////////////////////////////////////////////////////
// sendMessage - Telegram                                              //
// gotifyMessage - Gotify                                              //
// uncomment gotifyMessage - If you are using Gotify.net Push Service  //
///////////////////////////////////////////////////////////////////////// 

if (process.argv[2] === undefined) {
    console.log('Empty Output');
    process.exit(1);
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
            //gotifyMessage(lval + '\n' + 'Certificate Valid from \t' + emoji.get("raised_hand_with_fingers_splayed") + '\n' + certstart.format('LLLL') + '\n' + 'Certificate Expirey date \t' + emoji.get("point_down") + '\n' + certend.format('LLLL') + '\n' + 'Days Remaining \t' + emoji.get("clock8") + '\t' + certdata.days_remaining);

            if (certdata.days_remaining == '2') {
                sendMessage('Status: Oops time to Renew SSL for \t' + lval + '\t' + emoji.get("rotating_light"));
                //gotifyMessage('Status: Oops time to Renew SSL \t' + lval + '\t' + emoji.get("rotating_light"));
            }

        }).catch((err) => {
            if (err.code === 'ENOTFOUND') {
                console.log('Fix Hostname or Provide Correct Domain Name');
                process.exit(1);
            }
        });
    });
}