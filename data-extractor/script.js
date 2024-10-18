// Import necessary modules
import OpenAI from "openai";
import { MongoClient } from "mongodb";
import csvParser from 'csv-parser';
import fs from 'fs';
import Promise from "bluebird"; // For better handling of async operations
import dotenv from 'dotenv';

dotenv.config();

// Access your API key from process.env
const api_key = process.env.OPENAI_API_KEY;
const db_password = process.env.DB_PASSWORD

//console.log("API Key:", api_key);


// Initialize OpenAI instance
const openai = new OpenAI({apiKey : api_key});

// Define the prompt that will be passed to the OpenAI API
const labelReaderPrompt = `
You will be provided with a set of images corresponding to a single product. These images are found printed on the packaging of the product.
Your goal will be to extract information from these images to populate the schema provided. Here is some information you will routinely encounter. Ensure that you capture complete information, especially for nutritional information and ingredients:
- Ingredients: List of ingredients in the item. They may have some percent listed in brackets. They may also have metadata or classification like Preservative (INS 211) where INS 211 forms the metadata. Structure accordingly. If ingredients have subingredients like sugar: added sugar, trans sugar, treat them as different ingredients.
- Claims: Like a mango fruit juice says contains fruit.
- Nutritional Information: This will have nutrients, serving size, and nutrients listed per serving. Extract the base value for reference.
- FSSAI License number: Extract the license number. There might be many, so store relevant ones.
- Name: Extract the name of the product.
- Brand/Manufactured By: Extract the parent company of this product.
- Serving size: This might be explicitly stated or inferred from the nutrients per serving.
`;

// Define schemas to structure the output data
const quantitySchema = {
  "quantity": { "type": "number" },
  "unit": { "type": "string" },
};

const nutritionalInfoSchema = {
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "unit": { "type": "string" },
    "values": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "base": { "type": "string" },
          "value": { "type": "number" },
        },
        "required": ["base", "value"],
        "additionalProperties": false
      }
    },
  },
  "required": ["name", "unit", "values"],
  "additionalProperties": false
};

/**
 * Extract information from product images using OpenAI API
 * @param {Array} imageLinks - Array of image URLs for a given product
 * @returns {Object} - Extracted information as per schema
 */
async function extractInformation(imageLinks) {
  // Prepare the image message payload
  const imageMessage = imageLinks.map(il => ({
    type: "image_url",
    image_url: { url: il }
  }));

  // Send the request to OpenAI API with the images and prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06", // Specify the OpenAI model
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: labelReaderPrompt },
          ...imageMessage,
        ],
      },
    ],
    response_format: {
      "type": "json_schema",
      "json_schema": {
        "name": "label_reader",
        "schema": {
          "type": "object",
          "properties": {
            "productName": { "type": "string" },
            "brandName": { "type": "string" },
            "ingredients": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "percent": { "type": "string" },
                  "metadata": { "type": "string" },
                },
                "required": ["name", "percent", "metadata"],
                "additionalProperties": false
              }
            },
            "servingSize": {
              "type": "object",
              "properties": quantitySchema,
              "required": ["quantity", "unit"],
              "additionalProperties": false
            },
            "packagingSize": {
              "type": "object",
              "properties": quantitySchema,
              "required": ["quantity", "unit"],
              "additionalProperties": false
            },
            "servingsPerPack": { "type": "number" },
            "nutritionalInformation": {
              "type": "array",
              "items": nutritionalInfoSchema,
              "additionalProperties": true,
            },
            "fssaiLicenseNumbers": { "type": "array", "items": { "type": "number" } },
            "claims": { "type": "array", "items": { "type": "string" } },
            "shelfLife": { "type": "string" },
          },
          "required": [
            "productName", "brandName", "ingredients", "servingSize", 
            "packagingSize", "servingsPerPack", "nutritionalInformation", 
            "fssaiLicenseNumbers", "claims", "shelfLife"
          ],
          "additionalProperties": false
        },
        "strict": true
      }
    }
  });

  // Extract and return the relevant response
  const obj = response.choices[0];
  return obj;
}

/**
 * Main function to read the product CSV file, process images, and insert the data into MongoDB
 */
async function main() {
  // Initialize MongoDB client and connect
  //const mongo = new MongoClient("mongodb://root:example@localhost:27017/");
  const mongo = new MongoClient("mongodb+srv://consumewise_db:" + db_password + "@cluster0.sodps.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  await mongo.connect();
  const db = mongo.db("consumeWise");
  const coll = db.collection("products");

  // Read image links from CSV file
  const csvPath = '/Users/seagull/Downloads/product2.csv'; // Path to your CSV file
  const results = [];

  fs.createReadStream(csvPath)
    .pipe(csvParser({ headers: false })) // CSV parsing
    .on('data', (data) => {
      const filteredData = Object.values(data).filter(v => v); // Filter non-empty values
      results.push(filteredData); // Add valid image URLs to results array
    })
    .on('end', async () => {
      // Process each set of image URLs and extract information
      await Promise.map(results, async (imageLinks) => {
        try {
          const response = await extractInformation(imageLinks);
          if (!response.message || response.message.refusal) {
            console.error("Error in extracting information for product.");
          } else {
            console.log('Inserting document into MongoDB.');
            await coll.insertOne(JSON.parse(response.message.content));
          }
        } catch (error) {
          console.error("Failed to process images: ", error);
        }
      });
    });
}

// Start the process by calling the main function
main();
