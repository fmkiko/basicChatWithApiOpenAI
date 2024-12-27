const { OpenAI } = require('openai');

require('dotenv').config();

class OpenAI_API {
    static async generateResponse(userMessage, conversationHistory = []) {
        const apiKey = process.env.OPENAI_API_KEY;
        const endpoint = 'https://api.openai.com/v1/chat/completions';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo-1106",
                messages: conversationHistory.concat([{ role: 'user', content: userMessage }]),
                max_tokens: 150
            }),
        });
        const responseData = await response.json();
        // Log the entire API response for 
        // Check if choices array is defined and not empty
        if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message) {
            return responseData.choices[0].message.content;
        } else {
            // Handle the case where choices array is undefined or empty
            console.error('Error: No valid response from OpenAI API');
            return 'Sorry, I couldn\'t understand that.';
        }
    }

    static async generateResponseSDK(userMessage, conversationHistory = []) {
        const apiKey = process.env.OPENAI_API_KEY;
        const openAI = new OpenAI(apiKey);
        const completion = await openAI.chat.completions.create({
            model: "gpt-4o-mini",
            messages: conversationHistory.concat([{ role: 'user', content: userMessage }])
        })
        return completion.choices[0].message.content; 
    }
}
module.exports = { OpenAI_API };