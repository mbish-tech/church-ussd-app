# Testing Guide for Church USSD App

## Prerequisites

1. **MongoDB Connection**: You need a MongoDB URI in your `.env` file
2. **Server Running**: Start the server with `npm start` or `npm run dev`

## Setup

### 1. Create .env file

```bash
cp .env.example .env
```

Then edit `.env` and add your MongoDB connection string.

### 2. Start the Server

```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB!
🚀 Server running on port 3000
```

## Testing Methods

### Method 1: Automated Testing (Recommended)

Run the test script:

```bash
./test-ussd.sh
```

This will simulate a complete USSD session and show you the responses.

### Method 2: Manual curl Commands

Test each step of the USSD flow manually:

#### Step 1: Show Initial Menu
```bash
curl -X POST http://localhost:3000/ussd \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=%2B1234567890&text="
```

**Expected Response:**
```
CON Welcome to Church Giving
1. Tithe
2. Offering
3. Thanksgiving
4. Project Giving
5. Mountain Experience
```

#### Step 2: Select Category (e.g., Tithe)
```bash
curl -X POST http://localhost:3000/ussd \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=%2B1234567890&text=1"
```

**Expected Response:**
```
CON Enter amount for Tithe:
```

#### Step 3: Enter Amount
```bash
curl -X POST http://localhost:3000/ussd \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=%2B1234567890&text=1*500"
```

**Expected Response:**
```
END Thank you for your Tithe of 500. God bless you!
```

### Method 3: Using Postman or Insomnia

1. Create a new POST request to `http://localhost:3000/ussd`
2. Set header: `Content-Type: application/x-www-form-urlencoded`
3. Add body parameters:
   - `sessionId`: test123
   - `serviceCode`: *123#
   - `phoneNumber`: +1234567890
   - `text`: (varies by step - empty, then "1", then "1*500")

## Understanding USSD Text Parameter

The `text` parameter represents the user's journey:

- `text=""` → Initial menu
- `text="1"` → User selected option 1
- `text="1*500"` → User selected option 1, then entered 500
- `text="2*1000"` → User selected option 2, then entered 1000

The `*` character separates user inputs in USSD.

## Verifying Data in MongoDB

### Using MongoDB Compass (GUI)
1. Download MongoDB Compass
2. Connect using your MONGO_URI
3. Navigate to `churchdb` → `givings` collection
4. You should see records like:
```json
{
  "_id": ObjectId("..."),
  "sessionId": "test123",
  "phoneNumber": "+1234567890",
  "category": "Tithe",
  "amount": 500,
  "timestamp": ISODate("2025-11-01T...")
}
```

### Using MongoDB Shell
```bash
mongosh "your-mongo-uri"
use churchdb
db.givings.find().pretty()
```

## Test Scenarios

### Valid Tests
- ✅ Select each category (1-5) with valid amounts
- ✅ Test with different phone numbers
- ✅ Test with decimal amounts (e.g., 50.50)

### Invalid Tests
- ❌ Enter negative amount: `text=1*-100`
- ❌ Enter zero: `text=1*0`
- ❌ Enter text as amount: `text=1*abc`
- ❌ Invalid category: `text=9*500`

## Troubleshooting

### "Cannot connect to MongoDB"
- Check your MONGO_URI in `.env`
- Ensure MongoDB Atlas allows connections from your IP
- Verify your database user has read/write permissions

### "ECONNREFUSED"
- Make sure the server is running on port 3000
- Check if another process is using port 3000

### Server not starting
- Run `npm install` to ensure all dependencies are installed
- Check that `.env` file exists and has valid values

## Production Testing

When deployed with a real USSD provider (Africa's Talking, Twilio, etc.):

1. Configure the webhook URL in your provider dashboard
2. Dial the USSD code on your phone
3. Follow the menu prompts
4. Check MongoDB for the recorded transaction

## Next Steps

After testing locally:
1. Set up a USSD provider account
2. Deploy your app to a public server
3. Configure the webhook URL
4. Test with real phone numbers
5. Consider adding payment integration
