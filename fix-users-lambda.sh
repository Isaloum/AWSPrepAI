#!/bin/bash
# Run this in AWS CloudShell — fixes /me endpoint disconnection

# Step 1: Find User Lambda
echo "=== Finding User Lambda ===" && \
aws lambda list-functions --query 'Functions[?contains(FunctionName, `User`) || contains(FunctionName, `user`)].FunctionName' --output text && \

# Step 2: Check recent logs (replace FUNCTION_NAME below if different)
USER_FUNC=$(aws lambda list-functions --query 'Functions[?contains(FunctionName, `User`)].FunctionName' --output text | tr '\t' '\n' | head -1) && \
echo "User Lambda: $USER_FUNC" && \
aws logs tail /aws/lambda/$USER_FUNC --since 10m 2>&1 | tail -30
