/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */

import * as functions from "firebase-functions";
import OpenAIClient from "../utils/openaiClient";
import PromptUtils from "../utils/promptUtils"; // Import PromptUtils

const openaiClient = new OpenAIClient();

export const createPromptforNewImage = functions.https.onRequest(async (req, res) => {
  const { style, quote, description } = req.body;

  if (!style || !quote) {
    res.status(400).send("Missing required parameters: style and/or quote");
    return;
  }

  try {
    // Generate prompts using PromptUtils
    const systemPrompt = PromptUtils.generateSystemPromptForNewImage();
    const userPrompt = PromptUtils.generateUserPromptForNewImage(style, quote, description);

    // Generate text with OpenAI client
    const newImagePrompt = await openaiClient.generateText(systemPrompt, userPrompt);

    res.send(newImagePrompt);
  } catch (error) {
    console.error("Error creating prompt for new image:", error);
    res.status(500).send("Failed to create a prompt for a new image.");
  }
});
