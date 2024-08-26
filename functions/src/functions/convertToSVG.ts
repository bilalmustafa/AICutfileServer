/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
import * as functions from "firebase-functions";
import axios from "axios";
import { png2svg } from "svg-png-converter";

export const convertToSVG = functions.https.onRequest(async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    res.status(400).send("Missing required parameter: imageUrl");
    return;
  }

  try {
    // Fetch the PNG image from the URL
    const response = await axios({
      method: "get",
      url: imageUrl,
      responseType: "arraybuffer",
    });

    const inputImage = Buffer.from(response.data);

    // Convert the PNG to SVG using the 'imagetracer' engine for color output
    const result = await png2svg({
      input: inputImage,
      tracer: "imagetracer", // Use 'imagetracer' for color output
      optimize: true, // Optimize the SVG output
      numberofcolors: 8, // Limit the number of colors to control output size
      pathomit: 2, // Omit small paths to reduce noise
    });

    // Send the SVG content as a response
    res.setHeader("Content-Type", "image/svg+xml");
    res.send(result.content);
  } catch (error) {
    console.error("Error converting image to SVG:", error);
    res.status(500).send("Failed to convert image to SVG.");
  }
});
