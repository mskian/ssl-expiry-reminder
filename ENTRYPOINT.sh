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

#if gotify token is provided, check if url is provided
if [ ! -z "$GOTIFY_TOKEN" ] && [ -z "$GOTIFY_DOMAIN" ]; then
    echo "You provide the 'GOTIFY_TOKEN', so please provide also the 'GOTIFY_DOMAIN' environment variable"
    echo "No 'GOTIFY_DOMAIN' provided, EXIT..."
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

#check if the 'CHECKING_INTERVAL_IN_DAYS' is provided
if [ -z "$CHECKING_INTERVAL_IN_DAYS" ]; then
    echo "Please provide the 'CHECKING_INTERVAL_IN_DAYS' environment variable"
    echo "No 'CHECKING_INTERVAL_IN_DAYS' provided, EXIT..."
    exit 1
fi

#configure the config file
echo "Configuring the config file..."

#check if gotify token is provided
if [ ! -z "$GOTIFY_TOKEN" ]; then
    checkssl --gotify https://$GOTIFY_DOMAIN/message?token=$GOTIFY_TOKEN
fi

#check if telegram token is provided
if [ ! -z "$TELGRAM_TOKEN" ]; then
    checkssl --telegram https://api.telegram.org/bot$TELGRAM_TOKEN/sendMessage
    checkssl --chatid $TELGRAM_CHAT_ID
fi

checkssl --remainder $REMAINDER_DAYS_TO_EXPIRE

echo "Configuring the config file is done"


# IFS=',': Set the Internal Field Separator to comma.
# This means comma will be used as the delimiter for input.

# read -ra ADDR: Read the input into the array variable ADDR.
# -r: Disable backslash escaping, so backslashes are not interpreted as escape characters.
# -a ADDR: Read the input into an array named ADDR.

# <<< => here-string redirection operator
# <<< "$DOMAINS": Redirect the content of the variable DOMAINS as input to the preceding command.
# This allows reading the content of the variable as input.
IFS=',' read -ra DOMAIN_ARRAY <<< "$DOMAINS"


for i in "${DOMAIN_ARRAY[@]}"; do
    echo "Checking the SSL certificates..."
    echo

    for domain in "${DOMAIN_ARRAY[@]}"; do
        echo "Checking the SSL certificates for the domain: $domain"
        checkssl --domain $domain
    done

    echo
    echo "...Checking the SSL certificates is done"
    echo "Sleeping for ${CHECKING_INTERVAL_IN_DAYS} day(s)..."

    sleep "${CHECKING_INTERVAL_IN_DAYS}d"
done