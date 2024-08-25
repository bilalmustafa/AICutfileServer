/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable require-jsdoc */
/* eslint-disable quotes */

import axios from 'axios';
import * as functions from 'firebase-functions';

class OpenAIClient {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = functions.config().openai.key;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    console.log("OpenAIClient initialized with API URL:", this.apiUrl);
  }

  async generateText(systemPrompt: string, userPrompt: string, imageUrl?: string): Promise<string> {
    console.log("Generating text with OpenAI");
    console.log("System Prompt:", systemPrompt);
    console.log("User Prompt:", userPrompt);
    if (imageUrl) {
      console.log("Image URL:", imageUrl);
    }

    try {
      // Prepare the message format for the API request
      const messages = [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: imageUrl ? [
            { type: "text", text: userPrompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ] : [
            { type: "text", text: userPrompt },
          ],
        },
      ];

      console.log("Request Payload:", JSON.stringify(messages, null, 2));

      // Configure the request payload
      const payload = {
        model: "gpt-4o", // Ensure the model name is correct
        messages,
        temperature: 1,
        max_tokens: 400,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      };

      // Send the request to OpenAI API using Axios
      console.log("Sending request to OpenAI API...");
      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      console.log("Response Status:", response.status);
      console.log("Response Data:", JSON.stringify(response.data, null, 2));

      // Check if response data is valid
      const content = response.data.choices[0].message.content;
      if (content === null) {
        throw new Error("Received null content from OpenAI");
      }

      console.log("Generated Content:", content);
      return content;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error generating text with OpenAI:", error.message);
        console.error("Error Details:", error.stack);
      } else {
        console.error("An unknown error occurred:", error);
      }
      throw error;
    }
  }
}

export default OpenAIClient;
