#!/bin/sh

# Run database initialization script
node ./ipAddressService/db-init.js

node ./ipAddressService/index.js
