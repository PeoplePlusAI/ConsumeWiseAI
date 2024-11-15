import os
import pymongo
import json
from PIL import Image
import io
import re
from bson import ObjectId
from openai import OpenAI

# Set OpenAI Client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# MongoDB connection
client = pymongo.MongoClient("mongodb+srv://consumewise_db:p123%40@cluster0.sodps.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client.consumeWise
collection = db.products

# Define the prompt that will be passed to the OpenAI API
label_reader_prompt = """
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

# Function to extract information from image URLs
def extract_information(image_links):
    print("in extract_information")
    image_message = [{"type": "image_url", "image_url": {"url": il}} for il in image_links]
    
    # Send the request to OpenAI API with the images and prompt
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": label_reader_prompt},
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
    
    # Extract and return the relevant response
    
    return response.choices[0].message.content

#Extract text from image
def extract_data(image_links):
    try:
        if not image_links:
            return {"error": "No image URLs provided"}
        
        # Call the extraction function
        extracted_data = extract_information(image_links)
        print(f"extracted data : {extracted_data} ")
        print(f"extracted data : {type(extracted_data)} ")
        
        if extracted_data:
            extracted_data_json = json.loads(extracted_data)
            # Store in MongoDB
            collection.insert_one(extracted_data_json)
            return extracted_data
        else:
            return {"error": "Failed to extract information"}
        
    except Exception as error:
        return {"error": str(error)}
    
    
def find_product(product_name):
    try: 
        if product_name:            
            # Split the input product name into words
            words = product_name.split()
            result = [' '.join(words[:i]) for i in range(2, len(words) + 1)]
            list_names = result + words

            # # Create a regex pattern that matches all the words (case-insensitive)
            # regex_pattern = ".*".join(words)  # This ensures all words appear in sequence
            # query = {"productName": {"$regex": re.compile(regex_pattern, re.IGNORECASE)}}
            product_list = []
            for i in list_names:
            # Find all products matching the regex pattern
                query = {"productName": {"$regex": re.compile(i, re.IGNORECASE)}}
                products = collection.find(query)
                for product in products:
                    brand_product_name = product['productName'] + " by " + product['brandName']
                    #Remove repitition words that appear consecutively - Example - Cadbury cadbury dairy milk chocolate
                    if brand_product_name.lower() not in [product.lower() for product in product_list]:
                        product_list.append(brand_product_name)
            
            # # Create a list of product names that match the query
            # product_list = [product['productName'] for product in products]
    
            if product_list:
                return {"products": product_list, "message": "Products found"}
            else:
                return {"products": [], "message": "No products found"}
        else:
            return {"error": "Please provide a valid product name or id"}
    except Exception as error:
        return {"error": str(error)}

    
def get_product(product_name):
    try:        
        if product_name:
            product = collection.find_one({"productName": product_name})
        else:
            return {"error": "Please provide a valid product name or id"}

        if not product:
            print("Product not found.")
            return {"error": "Product not found"}
        if product:
            product['_id'] = str(product['_id'])  # Convert ObjectId to string
            product_str = json.dumps(product, indent=4)  # Convert product to JSON string
            print(f"Found product: {product_str}")
            return product  # Return the product as a JSON
        
    except Exception as error:
        return {"error": str(error)}

