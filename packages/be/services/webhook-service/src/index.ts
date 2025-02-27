import { Server, Socket } from 'socket.io';
import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config();

const APP_ID = process.env.APP_ID;
const APP_SECRET = process.env.APP_SECRET;


const io = new Server(3000, {
  cors: {
    origin: '*',
  },
});

// Meta API Credentials
const META_API_URL = 'https://graph.facebook.com/v16.0';
const PHONE_NUMBER_ID = '<your-phone-number-id>';
const ACCESS_TOKEN = '<your-access-token>';

async function sendMessage(to: string, message: string) {
  try {
    const response = await axios.post(
      `${META_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Message sent:', response.data);
  } catch (error: any) {
    console.error('Error sending message:', error.response?.data || error.message);
  }
}

io.on('connection', (socket: Socket) => {
  console.log('A client connected:', socket.id);

  // Listen for message events from the client
  socket.on('send-message', async (data: { to: string; message: string }) => {
    const { to, message } = data;
    console.log(`Sending message to ${to}: ${message}`);
    await sendMessage(to, message);
  });
});

console.log('WebSocket server is running on port 3000');
