# api/index.py
#from motor.motor_asyncio import AsyncIOMotorClient
#from openai import AsyncOpenAI
from pymongo import MongoClient
from openai import OpenAI
import os, io, base64
import json
import re
from typing import List, Dict, Any
from fastapi import FastAPI

# Move configuration and constants to separate files
from .config import MONGODB_URL, OPENAI_API_KEY
from .schemas import label_reader_schema

# Initialize clients
openai_client = OpenAI(api_key=OPENAI_API_KEY)
print(f"MONGODB_URL is {MONGODB_URL}")
mongodb_client = MongoClient(MONGODB_URL)
db = mongodb_client.consumeWise
collection = db.products
print(f"collection is {collection}")
app = FastAPI()

def encode_image(uploaded_file):
    return base64.b64encode(uploaded_file.read()).decode('utf-8')

def extract_information(images_list: List[Any]) -> Dict[str, Any]:
    global openai_client
    print(f"DEBUG - openai_client : {openai_client}")

    valid_image_files = images_list
    print(f"type(valid_image_files[0]) : {type(valid_image_files[0])}")

    #for uploaded_file in images_list:
    #    try:
    #        # Open the uploaded file as an image
    #        image = Image.open(uploaded_file)
    
    #        # Check image quality (assuming `check_image_quality` accepts PIL images)
    #        quality_result = check_image_quality(image, blur_threshold)
    #        if bool(quality_result['can_ocr']):
    #            # Image is readable, add to valid list
    #            valid_image_files.append(uploaded_file)
    #        else:
    #            return {"Error" : "One of the images is blurry, please re-upload"}
    #    except Exception as e:
    #        print(f"DEBUG - Error processing image {uploaded_file.name}: {str(e)}")
    #        continue
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
        #image_message = [{"type": "image_url", "image_url": {"url": il}} for il in image_links]
        # Convert valid images to byte streams for API processing
        image_message = [
            {
                "type": "image_url",
                "image_url": {
                "url":  f"data:image/jpeg;base64,{encode_image(uploaded_file)}"
                }
            }
            for uploaded_file in valid_image_files
        ]
        response = openai_client.chat.completions.create(
            model="gpt-4o",
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
        raise Exception(f"Error extracting information: {str(e)}")

@app.post("/extract-data")
def extract_data(images_list_json: Dict[str, List[Any]]):
    if not images_list_json or "images_list" not in images_list_json:
        raise Exception("Image links not found")
    
    try:
        extracted_data = extract_information(images_list_json["images_list"])
        result = collection.insert_one(extracted_data)
        extracted_data["_id"] = str(result.inserted_id)
        return extracted_data
    except Exception as e:
        raise Exception(f"An error occurred {e}") from e

@app.get("/find-product")
def find_product(product_name: str):

    if not product_name:
        raise Exception("Please provide a valid product name")
    
    try:
        words = product_name.split()
        search_terms = [' '.join(words[:i]) for i in range(2, len(words) + 1)] + words
        product_list = set()
        
        for term in search_terms:
            query = {"productName": {"$regex": f".*{re.escape(term)}.*", "$options": "i"}}
            # Use .to_list() to fetch all results
            products = collection.find(query).to_list(length=None)
            #async for product in collection.find(query)
            for product in products:
                brand_product_name = f"{product['productName']} by {product['brandName']}"
                product_list.add(brand_product_name)
        
        return {
            "products": list(product_list),
            "message": "Products found" if product_list else "No products found"
        }
    except Exception as e:
        raise Exception(f"An error occurred {e}") from e

@app.get("/get-product")
def get_product(product_name: str):
    if not product_name:
        raise Exception("Please provide a valid product name")
    
    try:
        product = collection.find_one({"productName": product_name})
        if not product:
            raise Exception("Product not found")
        
        product["_id"] = str(product["_id"])
        print(f"product info : {product}")
        return product
    except Exception as e:
        raise Exception(f"An error occurred {e}") from e
