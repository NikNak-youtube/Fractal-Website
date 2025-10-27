#!/bin/bash

# Clean up old files and rebuild
echo "Cleaning up old API folder..."
rm -rf api server.js

echo "Cleaning Next.js cache..."
rm -rf .next

echo "Installing dependencies..."
npm install

echo "Starting Next.js dev server..."
npm run dev
