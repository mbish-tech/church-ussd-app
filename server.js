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


// 4. Homepage endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Church USSD App</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          background: rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        h1 { margin-top: 0; }
        .status {
          background: #10b981;
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
        }
        .info {
          background: rgba(255, 255, 255, 0.2);
          padding: 20px;
          border-radius: 10px;
          margin-top: 20px;
        }
        ul { list-style: none; padding-left: 0; }
        li { padding: 8px 0; }
        li:before { content: "✓ "; color: #10b981; font-weight: bold; }
        .endpoint {
          background: rgba(0, 0, 0, 0.3);
          padding: 10px;
          border-radius: 5px;
          font-family: monospace;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🙏 Church USSD Giving App</h1>
        <div class="status">✅ Running</div>

        <div class="info">
          <h2>Features</h2>
          <ul>
            <li>Tithe Collection</li>
            <li>Offering Collection</li>
            <li>Thanksgiving Giving</li>
            <li>Project Giving</li>
            <li>Mountain Experience</li>
          </ul>

          <h2>USSD Endpoint</h2>
          <div class="endpoint">POST /ussd</div>
          <p>Configure this endpoint in your USSD provider (Africa's Talking, Twilio, etc.)</p>

          <h2>Status</h2>
          <p>Server: <strong>Active</strong></p>
          <p>Database: <strong>${givingCollection ? 'Connected' : 'Connecting...'}</strong></p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// 5. Your USSD endpoint
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

