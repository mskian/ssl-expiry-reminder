#! /bin/bash

#check if any domains are provided
# -z checks if the length of the string is zero
if [ -z "$DOMAINS" ]; then
    echo "Please provide the 'DOMAINS' environment variable, use ',' to separate the domains"
    echo "No 'DOMAINS' provided, EXIT..."
    exit 1
fi

#check if telgram token or gotify token is provided
if [ -z "$TELGRAM_TOKEN" ] && [ -z "$GOTIFY_TOKEN" ]; then
    echo "Please provide the 'TELGRAM_TOKEN' or 'GOTIFY_TOKEN' environment variable (at least one)"
    echo "No 'TELGRAM_TOKEN' or 'GOTIFY_TOKEN' provided, EXIT..."
    exit 1
fi

#if telegram token is provided, check if chat id is provided
if [ ! -z "$TELGRAM_TOKEN" ] && [ -z "$TELGRAM_CHAT_ID" ]; then
    echo "You provide the 'TELGRAM_TOKEN', so please provide also the 'TELGRAM_CHAT_ID' environment variable"
    echo "No 'TELGRAM_CHAT_ID' provided, EXIT..."
    exit 1
fi

#check if the 'REMAINDER_DAYS_TO_EXPIRE' is provided
if [ -z "$REMAINDER_DAYS_TO_EXPIRE" ]; then
    echo "Please provide the 'REMAINDER_DAYS_TO_EXPIRE' environment variable"
    echo "No 'REMAINDER_DAYS_TO_EXPIRE' provided, EXIT..."
    exit 1
fi

#split the domains by ',' and store them in an array
DOMAIN_ARRAY=',' read -r -a domains <<< "$DOMAINS"


#configure the config file
echo "Configuring the config file..."

#check if gotify token is provided
if [ ! -z "$GOTIFY_TOKEN" ]; then
    checkssl --gotify https://push.example.com/message?token=XXXXXXXXXXXXXXX
fi

#check if telegram token is provided
if [ ! -z "$TELGRAM_TOKEN" ]; then
    checkssl --telegram https://api.telegram.org/bot<YOUR BOT API KEY>/sendMessage
    checkssl --chatid 123456789
fi

checkssl --remainder 30

echo "Configuring the config file is done"

#start the main loop
while true; do
    echo "Checking the SSL certificates..."
    for domain in "${domains[@]}"; do
        checkssl --domain $domain
    done
    echo "Checking the SSL certificates is done"
    echo "Sleeping for 1 day..."
    sleep 1d
done