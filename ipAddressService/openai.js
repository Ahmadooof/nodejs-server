import express from 'express';
import OpenAI from 'openai';
import { getVisitorByIPAddress } from './visitor-c.js';
import { incrementMessagesSent, nrOfMessagesUsed, saveChatMessage } from './chatUsage-c.js';

const router = express.Router();

// Initialize the OpenAI instance
const openai = new OpenAI({
  apiKey : process.env.REACT_APP_OPENAI_API_KEY,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Authorization': 'Bearer ' + process.env.REACT_APP_OPENAI_API_KEY,
  },
});

// Check if API key is missing during initialization
if (!process.env.REACT_APP_OPENAI_API_KEY) {
  console.error('OpenAI API key is missing. Please provide it in your environment variables.');
  process.exit(1); // Exit the process to indicate a fatal error
}

router.post('/ask-me', async (req, res) => {
  try {
    console.log('askMe')
    const userMessage = req.body.message; // Get the user message from the request body

    const ip_address = req.headers['x-forwarded-for'] || req.ip;

    if (!ip_address) {
      throw new Error('ip_address is required.');
    }

    // Query the database to get the visitor data based on the IP address
    const visitor = await getVisitorByIPAddress(ip_address);
    console.log(visitor)
    // if (!visitor) {
    //   return res.status(404).json({
    //     error: 'Visitor not found',
    //     message: 'The visitor associated with your IP address was not found. Please check your settings or contact support.',
    //   });
    // }
    

    const messagesSent = await nrOfMessagesUsed(visitor.id);

    if (messagesSent > 10) {
      return res.status(429).json({
        error: 'Exceeded message limit',
        message: 'You have exceeded the maximum number of allowed messages. Please try again later.',
      });
    }
    

    const responseText = await askOpenAI(userMessage);

    incrementMessagesSent(visitor.id)
    saveChatMessage(visitor.id, userMessage, responseText)

    return res.status(200).json({ response: responseText });
  } catch (error) {
    console.error('Error:', error.message); // Log the error message
    return res.status(500).json({ error: 'Server error', details: error.message }); // Provide an informative error response
  }
});

async function askOpenAI(userMessage) {
  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4', // Choose the appropriate model
      messages: [
        { role: 'system', content: 'Do not tell anyone that you are AI, answer to this info as you are human. 30 years old. Your name ahmad anbarje. your degree: computer sience graduated in 2020, your marital status: single.\nyou are living with my mother currently residing in Jeddah KSA,\nyou are from Syria and hold Swedish and Syrian citizenship. You can speak English, Arabic, Swedish\nyou are experience in various areas including web programming, DevOps, design, and software programming\nyou are not working, and you are available immediately to start the new position, your phone number:+966 055 308 1749.\nif you could not  find relavent answer from this info, then try to escape from answer and say joyful answer related to the question' }, // Replace with your system message content
        {
          role: 'user',
          content: userMessage, // Use the user's message from the request
        },
      ],
      stream: true,
      temperature: 1,
      max_tokens: 70,
    });

    const responseParts = [];

    for await (const part of stream) {
      const content = part.choices[0]?.delta?.content || '';
      responseParts.push(content);
    }

    const responseText = responseParts.join('');

    return responseText;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

export default router;
