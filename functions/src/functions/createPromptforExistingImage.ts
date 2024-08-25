/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */

import * as functions from "firebase-functions";
import OpenAIClient from "../utils/openaiClient";
import PromptUtils from "../utils/promptUtils"; // Import PromptUtils

const openaiClient = new OpenAIClient();

export const createPromptforExistingImage = functions.https.onRequest(async (req, res) => {
  const { style, description } = req.body;

  if (!style || !description) {
    res.status(400).send("Missing required parameters: style and/or description");
    return;
  }

  try {
    // Generate prompts using PromptUtils
    const systemPrompt = PromptUtils.generateSystemPromptForExistingImage();
    const userPrompt = PromptUtils.generateUserPromptForExistingImage(style, description);

    // Generate text with OpenAI client
    const newPrompt = await openaiClient.generateText(systemPrompt, userPrompt);

    res.send(newPrompt);
  } catch (error) {
    console.error("Error creating prompt for existing image:", error);
    res.status(500).send("Failed to create a prompt for the existing image.");
  }
});
