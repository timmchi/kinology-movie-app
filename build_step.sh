#!/bin/bash

echo "Build script"

cd kinology_frontend && npm install && cd ../kinology_backend && npm install && npm run build:ui 