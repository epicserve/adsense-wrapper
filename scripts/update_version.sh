#!/usr/bin/env bash

# echo "s/v\d+\.\d+(\.\d+)?/$1/g"

find ../ -type f | xargs perl -i -wpe "s/v\d+\.\d+(\.\d+)?/$1/g"
