# api/index.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from openai import OpenAI
import os
import json
import re
from typing import List, Dict, Any

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Move configuration and constants to separate files
from .config import MONGODB_URL, OPENAI_API_KEY
from .schemas import label_reader_schema

# Initialize clients
openai_client = OpenAI(api_key=OPENAI_API_KEY)
mongodb_client = AsyncIOMotorClient(MONGODB_URL)
db = mongodb_client.consumeWise
collection = db.products

async def extract_information(image_links: List[str]) -> Dict[str, Any]:
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
    try:
        image_message = [{"type": "image_url", "image_url": {"url": il}} for il in image_links]
        load_label_reader_prompt()
        response = await openai_client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": LABEL_READER_PROMPT},
                        *image_message,
                    ],
                },
            ],
            response_format={"type": "json_schema", "json_schema": label_reader_schema}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting information: {str(e)}")

@app.post("/api/extract-data")
async def extract_data(image_links: List[str]):
    if not image_links:
        raise HTTPException(status_code=400, detail="Image links not found")
    
    try:
        extracted_data = await extract_information(image_links)
        result = await collection.insert_one(extracted_data)
        extracted_data["_id"] = str(result.inserted_id)
        return extracted_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/find-product")
async def find_product(product_name: str):
    if not product_name:
        raise HTTPException(status_code=400, detail="Please provide a valid product name")
    
    try:
        words = product_name.split()
        search_terms = [' '.join(words[:i]) for i in range(2, len(words) + 1)] + words
        product_list = set()
        
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
