# SSL Expiry Reminder

SSL Expiry Reminder - Get SSL Expiry Notification remainder on Telegram and Gotify  

![System Info](https://raw.githubusercontent.com/mskian/ssl-expiry-reminder/master/screenshot.png)  

## Requirements

- Node 8X LTS or 10X LTS
- `yarn` for Manage the Packages - Installation - <https://yarnpkg.com/en/docs/install>
- bash for Run the Automated Tasks
- Telegram Bot - <https://core.telegram.org/bots> and in `CHATID` add your Private Channel ID
- Gotify API - <https://gist.github.com/the-mcnaveen/2788985648490e7b3af24647247ed4e7#gistcomment-2996497>

## Installation

- Clone this Respo via Git

```bash
git clone https://github.com/mskian/ssl-expiry-reminder.git
cd ssl-expiry-reminder
yarn
```

- Create `.env` for Store the Telegram API and Gotify API - Example 👇

```bash
touch .env
```

```bash
BOTAPIKEY=<TELEGRAM BOT API KEY>
CHATID=<TELEGRAM CHANNEL ID OR CHAT ID>
URL=https://push.example.com/message?token=XXXXXXXXXXXXXXX
```

- Testing - Execute the Script

```js
node check.js
```

- Open `sslcheck.sh` file and add your domains you want to check
- Create Cron job for Automate checking

## Library

SSL Checker NPM Module - <https://www.npmjs.com/package/ssl-checker>

## Changelogs

v0.0.1

- First Release

## License

MIT
