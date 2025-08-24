#!/bin/bash
echo "stopping current running server.."
pm2 stop all
echo "restarting nightCore server!"
pm2 start nightcore
echo "nightCore should be online"
