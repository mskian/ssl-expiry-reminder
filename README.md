# SSL Expiry Reminder

SSL Expiry Reminder - Get SSL Expiry Notification remainder on Telegram and Gotify  

![SSL Expiry Reminder](https://raw.githubusercontent.com/mskian/ssl-expiry-reminder/master/Screenshot.png)  

## Requirements

- Node 8X LTS or 10X LTS
- `yarn` for Managing the Packages - Installation - <https://yarnpkg.com/en/docs/install>
- Bash to Run the Automated Tasks
- Telegram Bot - <https://core.telegram.org/bots>
- Gotify API - <https://gist.github.com/the-mcnaveen/2788985648490e7b3af24647247ed4e7#gistcomment-2996497>

## Installation

- Clone this Respo via Git

```bash
git clone https://github.com/mskian/ssl-expiry-reminder.git
cd ssl-expiry-reminder
yarn
```

- Create `.env` to Store the Telegram & Gotify APIs - Example 👇

```bash
touch .env
```

```bash
TELEGRAM_CHATID=<TELEGRAM CHANNEL ID OR CHAT ID>
TELEGRAM_URL=https://api.telegram.org/bot<YOUR BOT API KEY>/sendMessage
GOTIFY_URL=https://push.example.com/message?token=XXXXXXXXXXXXXXX
```

- Testing - Execute the Script

```js
node check.js example.com
```

## Usage

- Just Run the Bash file `sslcheck.sh`

```bash
chmod +x sslcheck.sh
```

```bash
./sslcheck.sh
```

- Replace mine Sites domain with your's <https://github.com/mskian/ssl-expiry-reminder/blob/ff1af0ceaa5ffe44654b96868a68a10792691f4b/sslcheck.sh#L9>
- Create Cron job for Automate checking

## Customization

- Change SSL Days Remaining Days - <https://github.com/mskian/ssl-expiry-reminder/blob/ff1af0ceaa5ffe44654b96868a68a10792691f4b/check.js#L88>

```js
 if (certdata.days_remaining == '2') {
                sendMessage('Status: Oops time to Renew SSL for \t' + lval + '\t' + emoji.get("rotating_light"));
                gotifyMessage('Status: Oops time to Renew SSL \t' + lval + '\t' + emoji.get("rotating_light"));
            }
```

## Library

SSL Checker NPM Module - <https://www.npmjs.com/package/ssl-checker>

## Changelogs

v0.0.1

- First Release

v0.0.2

- Revamp
- using Axios for Telegram instead of `telegram-bot-api` Module
- Proper Input and Output Validation
- Correct the version Number in `package.json`

## License

MIT
