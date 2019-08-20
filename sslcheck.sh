#!/bin/bash

## Set Cronjob - Run 25th of Everymonth

## */3 * * * * /etc/ssl-expiry-reminder/sslcheck.sh > /dev/null 2>&1

echo -e "SSL Expiry Reminder"

## List the Domains to check SSL Expiry Date and Days
sleep 1;
node check.js santhoshveer.com
sleep 2;
node check.js forum.santhoshveer.com
sleep 2;
node check.js status.santhoshveer.com

echo -e "Done"

exit 0
