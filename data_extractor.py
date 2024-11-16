import os
import pymongo
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import re
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Dict, Any

# FastAPI app initialization
app = FastAPI(title="API to find similar products from the db")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables (should be moved to .env file)
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://consumewise_db:p123%40@cluster0.sodps.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY)

# Async MongoDB connection
client = AsyncIOMotorClient(MONGODB_URL)
db = client.consumeWise
collection = db.products

# Define the prompt as a constant
LABEL_READER_PROMPT = """
You will be provided with a set of images corresponding to a single product. These images are found printed on the packaging of the product.
Your goal will be to extract information from these images to populate the schema provided. Here is some information you will routinely encounter. Ensure that you capture complete information, especially for nutritional information and ingredients:
- Ingredients: List of ingredients in the item. They may have some percent listed in brackets. They may also have metadata or classification like Preservative (INS 211) where INS 211 forms the metadata. Structure accordingly. If ingredients have subingredients like sugar: added sugar, trans sugar, treat them as different ingredients.
- Claims: Like a mango fruit juice says contains fruit.
- Nutritional Information: This will have nutrients, serving size, and nutrients listed per serving. Extract the base value for reference.
- FSSAI License number: Extract the license number. There might be many, so store relevant ones.
- Name: Extract the name of the product.
- Brand/Manufactured By: Extract the parent company of this product.
- Serving size: This might be explicitly stated or inferred from the nutrients per serving.
"""

async def extract_information(image_links: List[str]) -> Dict[str, Any]:
    """Extract information from product images using OpenAI API."""
    try:
        image_message = [{"type": "image_url", "image_url": {"url": il}} for il in image_links]
        
        response = await openai_client.chat.completions.create(
            model="gpt-4-vision-preview",  # Corrected model name
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": LABEL_READER_PROMPT},
                        *image_message,
                    ],
                },
            ],
            response_format={"type": "json_schema", "json_schema": {
            "name": "label_reader",
            "schema": {
                "type": "object",
                "properties": {
                    "productName": {"type": "string"},
                    "brandName": {"type": "string"},
                    "ingredients": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "percent": {"type": "string"},
                                "metadata": {"type": "string"},
                            },
                            "required": ["name", "percent", "metadata"],
                            "additionalProperties": False
                        }
                    },
                    "servingSize": {
                        "type": "object",
                        "properties": {
                            "quantity": {"type": "number"},
                            "unit": {"type": "string"},
                        },
                        "required": ["quantity", "unit"],
                        "additionalProperties": False
                    },
                    "packagingSize": {
                        "type": "object",
                        "properties": {
                            "quantity": {"type": "number"},
                            "unit": {"type": "string"},
                        },
                        "required": ["quantity", "unit"],
                        "additionalProperties": False
                    },
                    "servingsPerPack": {"type": "number"},
                    "nutritionalInformation": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "unit": {"type": "string"},
                                "values": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "base": {"type": "string"},
                                            "value": {"type": "number"},
                                        },
                                        "required": ["base", "value"],
                                        "additionalProperties": False
                                    }
                                },
                            },
                            "required": ["name", "unit", "values"],
                            "additionalProperties": False
                        },
                        "additionalProperties": True,
                    },
                    "fssaiLicenseNumbers": {"type": "array", "items": {"type": "number"}},
                    "claims": {"type": "array", "items": {"type": "string"}},
                    "shelfLife": {"type": "string"},
                },
                "required": [
                    "productName", "brandName", "ingredients", "servingSize",
                    "packagingSize", "servingsPerPack", "nutritionalInformation",
                    "fssaiLicenseNumbers", "claims", "shelfLife"
                ],
                "additionalProperties": False
            },
            "strict": True
        }}
    )        
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting information: {str(e)}")

@app.post("/api/extract-data")
async def extract_data(image_links: List[str]):
    """Extract data from product images and store in database."""
    if not image_links:
        raise HTTPException(status_code=400, detail="No image URLs provided")
    
    try:
        extracted_data = await extract_information(image_links)
        result = await collection.insert_one(extracted_data)
        extracted_data["_id"] = str(result.inserted_id)
        return extracted_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/find-product")
async def find_product(product_name: str):
    """Find products by name with improved search functionality."""
    if not product_name:
        raise HTTPException(status_code=400, detail="Please provide a valid product name")
    
    try:
        words = product_name.split()
        search_terms = [
            ' '.join(words[:i]) for i in range(2, len(words) + 1)
        ] + words

        product_list = set()  # Use set to avoid duplicates
        
        for term in search_terms:
            query = {"productName": {"$regex": f".*{re.escape(term)}.*", "$options": "i"}}
            async for product in collection.find(query):
                brand_product_name = f"{product['productName']} by {product['brandName']}"
                product_list.add(brand_product_name)
        
        return {
            "products": list(product_list),
            "message": "Products found" if product_list else "No products found"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/get-product")
async def get_product(product_name: str):
    """Get detailed product information by name."""
    if not product_name:
        raise HTTPException(status_code=400, detail="Please provide a valid product name")
    
    try:
        product = await collection.find_one({"productName": product_name})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        product["_id"] = str(product["_id"])
        return product
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
