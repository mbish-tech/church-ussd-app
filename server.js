// 1. Imports and config
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

// 2. Initialize Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// 3. MongoDB connection (this is where you place the connection code)
// MongoDB connection (this is where you place the connection code)
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let givingCollection;  // add this

async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB!");

    givingCollection = client.db("churchdb").collection("givings");  // assign collection here
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

connectDB();


// 4. Your USSD endpoint
app.post('/ussd', async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  let response = '';

  try {
    if (text === '') {
      // first request, show menu
      response = `CON Welcome to Church Giving
1. Tithe
2. Offering
3. Thanksgiving
4. Project Giving
5. Mountain Experience`;
    } else if (['1', '2', '3', '4', '5'].includes(text)) {
      // user selected a category, ask for amount
      const categories = {
        '1': 'Tithe',
        '2': 'Offering',
        '3': 'Thanksgiving',
        '4': 'Project Giving',
        '5': 'Mountain Experience'
      };
      const selectedCategory = categories[text];

      response = `CON Enter amount for ${selectedCategory}:`;
    } else if (text.includes('*')) {
      // user has entered category and amount (e.g., "1*500")
      const parts = text.split('*');
      const categoryChoice = parts[0];
      const amount = parts[1];

      // validate amount
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        response = `END Invalid amount. Please try again.`;
      } else {
        const categories = {
          '1': 'Tithe',
          '2': 'Offering',
          '3': 'Thanksgiving',
          '4': 'Project Giving',
          '5': 'Mountain Experience'
        };
        const selectedCategory = categories[categoryChoice];

        const givingData = {
          sessionId,
          phoneNumber,
          category: selectedCategory,
          amount: amountNum,
          timestamp: new Date()
        };

        // Save to MongoDB if connected
        if (givingCollection) {
          await givingCollection.insertOne(givingData);
          response = `END Thank you for your ${selectedCategory} of ${amountNum}. God bless you!`;
        } else {
          // MongoDB not connected - show warning but continue
          console.log('Would save to DB:', givingData);
          response = `END Thank you for your ${selectedCategory} of ${amountNum}. God bless you!\n(Note: DB not connected - data not saved)`;
        }
      }
    } else {
      // user input something unexpected
      response = `END Invalid input. Please try again.`;
    }
  } catch (error) {
    console.error('Error handling USSD request:', error);
    response = `END Sorry, something went wrong. Please try again later.`;
  }

  res.set('Content-Type', 'text/plain');
  res.send(response);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

