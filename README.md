# Church USSD Giving App

A USSD application that enables church members to make giving contributions via mobile phones. Built with Node.js, Express, and MongoDB.

## Features

- Interactive USSD menu for church giving
- Multiple giving categories:
  - Tithe
  - Offering
  - Thanksgiving
  - Project Giving
  - Mountain Experience
- Amount input with validation
- MongoDB storage for all giving records
- Real-time session tracking

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- USSD service provider account (e.g., Africa's Talking, Twilio)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd church-ussd-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/
PORT=3000
```

## Usage

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or your specified PORT).

## USSD Flow

1. User dials the USSD code
2. Menu appears with 5 giving categories
3. User selects a category (1-5)
4. User enters the amount to give
5. System saves the record and displays confirmation

## API Endpoints

### POST /ussd

Handles USSD requests from the service provider.

**Request Body:**
```json
{
  "sessionId": "unique-session-id",
  "serviceCode": "*123#",
  "phoneNumber": "+1234567890",
  "text": "1*500"
}
```

**Response:**
Returns plain text with USSD response (CON for continue, END for end).

## Database Schema

### givings Collection

```javascript
{
  sessionId: String,
  phoneNumber: String,
  category: String,    // Tithe, Offering, etc.
  amount: Number,
  timestamp: Date
}
```

## Deployment

### Deploying to Production

1. Ensure all environment variables are set
2. Configure your USSD provider to point to your `/ussd` endpoint
3. Deploy to your hosting platform (Heroku, AWS, DigitalOcean, etc.)

### USSD Provider Setup

Configure your webhook URL with your USSD provider:
```
https://your-domain.com/ussd
```

## Development

### Project Structure

```
church-ussd-app/
├── server.js           # Main application file
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (not in git)
├── .env.example       # Environment template
└── README.md          # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For issues or questions, please open an issue in the repository.
