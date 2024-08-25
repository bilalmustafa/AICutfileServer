/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */

import * as functions from "firebase-functions";
import OpenAIClient from "../utils/openaiClient";
import PromptUtils from "../utils/promptUtils";

const openaiClient = new OpenAIClient();

export const describeImage = functions.https.onRequest(async (req, res) => {
  const { publicUrl } = req.body;

  if (!publicUrl) {
    res.status(400).send("Missing required parameter: publicUrl");
    return;
  }

  try {
    // Generate prompts using PromptUtils
    const systemPrompt = PromptUtils.generateSystemPromptForDescribingImage();
    const userPrompt = PromptUtils.generateUserPromptForDescribingImage();

    // Generate text with OpenAI client
    const description = await openaiClient.generateText(systemPrompt, userPrompt, publicUrl);

    res.send(description);
  } catch (error) {
    console.error("Error generating image description:", error);
    res.status(500).send("Failed to generate image description.");
  }
});
