/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint-disable quote-props */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */

import * as functions from "firebase-functions";
import axios from "axios";

// Define your API key and endpoint
const REPLICATE_API_TOKEN = functions.config().replicate.key;
const REPLICATE_API_URL = "https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions";

export const generateImage = functions.https.onRequest(async (req, res) => {
  // Destructure camelCase parameters from the request body
  const { prompt, guidance, numOutputs, aspectRatio, outputFormat, outputQuality, promptStrength, numInferenceSteps } = req.body;

  // Check for required parameter 'prompt'
  if (!prompt) {
    res.status(400).send("Missing required parameter: prompt");
    return;
  }

  try {
    // Define input parameters for the Replicate API call
    const input = {
      input: {
        prompt: prompt,
        guidance: guidance || 3.5, // default value if not provided
        num_outputs: numOutputs || 1, // default value if not provided
        aspect_ratio: aspectRatio || "1:1", // default value if not provided
        output_format: outputFormat || "png", // default value if not provided
        output_quality: outputQuality || 80, // default value if not provided
        prompt_strength: promptStrength || 0.8, // default value if not provided
        num_inference_steps: numInferenceSteps || 50, // default value if not provided
      }
    };

    // Call the Replicate API with the input parameters
    const response = await axios.post(REPLICATE_API_URL, input, {
      headers: {
        Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    // Send the output URL as the response
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error generating image with Replicate:", error);
    res.status(500).send("Failed to generate image with Replicate.");
  }
});