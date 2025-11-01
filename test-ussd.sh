#!/bin/bash

# USSD Testing Script for Church Giving App
# Make sure your server is running before executing these tests

BASE_URL="http://localhost:3000/ussd"

echo "================================"
echo "USSD App Testing Script"
echo "================================"
echo ""

# Test 1: Initial menu request
echo "Test 1: Showing initial menu"
echo "----------------------------"
curl -X POST $BASE_URL \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=%2B1234567890&text="
echo -e "\n\n"

# Test 2: User selects option 1 (Tithe)
echo "Test 2: User selects Tithe (option 1)"
echo "--------------------------------------"
curl -X POST $BASE_URL \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=%2B1234567890&text=1"
echo -e "\n\n"

# Test 3: User enters amount (500)
echo "Test 3: User enters amount of 500 for Tithe"
echo "--------------------------------------------"
curl -X POST $BASE_URL \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=%2B1234567890&text=1*500"
echo -e "\n\n"

# Test 4: Test invalid amount
echo "Test 4: User enters invalid amount (-10)"
echo "-----------------------------------------"
curl -X POST $BASE_URL \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=test456&serviceCode=*123#&phoneNumber=%2B1234567890&text=2*-10"
echo -e "\n\n"

# Test 5: Test offering with amount 1000
echo "Test 5: Complete offering flow with 1000"
echo "-----------------------------------------"
curl -X POST $BASE_URL \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=test789&serviceCode=*123#&phoneNumber=%2B0987654321&text=2*1000"
echo -e "\n\n"

echo "================================"
echo "Testing complete!"
echo "Check your MongoDB to verify data was saved"
echo "================================"
