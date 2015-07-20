#!/bin/bash
while true
do
    nmap -sP 192.168.1.0/24 | awk '/is up/ {print up}; {gsub (/\(|\)/,""); up = $NF}' > data/pinger
    sleep 1s
done

