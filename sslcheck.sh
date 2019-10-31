#!/bin/bash

## Set Cronjob - For Automation

echo -e "SSL Expiry Reminder"

## List the Domains to check SSL Expiry Date and Days
sleep 1;
checkssl -d santhoshveer.com
sleep 2;
checkssl -d forum.santhoshveer.com
sleep 2;
checkssl -d task.santhoshveer.com

echo -e "Done"

exit 0
