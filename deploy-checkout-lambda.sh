#!/bin/bash
# Run from project root: bash deploy-checkout-lambda.sh
set -e
echo "📦 Bundling checkout Lambda..."
cd amplify/functions/checkout
npm install --omit=dev
zip -r /tmp/checkout-lambda.zip index.js package.json node_modules
echo "🚀 Deploying to AWS Lambda..."
aws lambda update-function-code \
  --function-name awsprepai-checkout \
  --zip-file fileb:///tmp/checkout-lambda.zip \
  --region us-east-1
echo "✅ Done! Checkout Lambda redeployed with node_modules (stripe included)."
