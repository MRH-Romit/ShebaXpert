const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate a summary for a service provider
exports.generateProviderSummary = async (providerData) => {
  try {
    const prompt = `
      আমি একজন পেশাদার ${providerData.service || 'সেবা প্রদানকারী'}, আমার নাম ${providerData.name}.
      ${providerData.description ? `আমি ${providerData.description}` : ''}
      আমার যোগাযোগ নম্বর ${providerData.phone}.
      ${providerData.address ? `আমার ঠিকানা ${providerData.address}.` : ''}
      ${providerData.availability ? `আমি উপলব্ধ ${providerData.availability}.` : ''}
      
      উপরের তথ্য ব্যবহার করে আমার জন্য একটি পেশাদার বিবরণ লেখ যা আমি ফেসবুক পোস্টে ব্যবহার করতে পারি।
      বিবরণে আমার নাম, যোগাযোগ তথ্য, ঠিকানা এবং উপলব্ধতা উল্লেখ কর।
      বিবরণটি 3-4 অনুচ্ছেদের মধ্যে আকর্ষণীয়, পেশাদার এবং বিশ্বাসযোগ্য হওয়া উচিত।
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Return a basic summary if API fails
    return `${providerData.name}, ${providerData.service || 'পেশাদার সেবা প্রদানকারী'}, যোগাযোগ: ${providerData.phone}`;
  }
};

// Convert speech to text
exports.speechToText = async (audioBuffer) => {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioBuffer,
      model: "whisper-1",
      language: "bn" // Bengali
    });

    return transcription.text;
  } catch (error) {
    console.error('Speech to text error:', error);
    throw new Error('Failed to convert speech to text');
  }
};
