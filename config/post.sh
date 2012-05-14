#!/bin/bash
LUNCH_SERVER='http://127.0.0.1:3000'

while read line
do
	data=`echo '{"name": "token"}' | sed "s/token/$line/g"`
	curl -H 'Content-Type: application/json' -X POST -d "$data" "$LUNCH_SERVER/location"
	echo $data
done < 'locations.txt'