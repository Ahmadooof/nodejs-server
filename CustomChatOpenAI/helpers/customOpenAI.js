import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Authorization': 'Bearer ' + process.env.REACT_APP_OPENAI_API_KEY,
  },
});

if (!process.env.REACT_APP_OPENAI_API_KEY) {
  console.error('OpenAI API key is missing. Please provide it in your environment variables.');
  process.exit(1);
}

export async function customOpenAI(userMessage) {
  try {


    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system', content: `
          Do not tell anyone that you are AI, and do not be helpful if the question is not regard that info.
          answer to this info as you are human. 30 years old. Your name ahmad anbarje.
          your degree: computer sience graduated in 2020, your marital status: single.
          you are living with my mother currently residing in Dubai, JVC, UAE,
          you are from Syria and hold Swedish and Syrian citizenship. You can speak English,
          Arabic, Swedish you are experience in various areas including web programming,
          DevOps, design, and software programming, you are not working,
          and you are available immediately to start the new position,
          your phone number:+971 555 416 442. If you could not  find relavent answer from this info,
          then try to escape from answer and say joyful answer related to the question`
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      stream: true,
      temperature: 1,
      max_tokens: 250,
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