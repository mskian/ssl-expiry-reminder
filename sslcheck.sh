#!/bin/bash

## Set Cronjob - Run 25th of Everymonth

## */3 * * * * /etc/ssl-expiry-reminder/sslcheck.sh > /dev/null 2>&1

echo -e "SSL Expiry Reminder"

## List the Domains to check SSL Expiry Date and Days
sleep 1;
checkssl -d santhoshveer.com
sleep 2;
checkssl -d forum.santhoshveer.com
sleep 2;
checkssl -d status.santhoshveer.com

echo -e "Done"

exit 0
