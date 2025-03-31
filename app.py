# import streamlit as st
from openai import OpenAI
import json, os, httpx, asyncio
import time 
from typing import Dict, Any
import pickle
from api.calc_consumption_context import get_consumption_context
from tenacity import retry, stop_after_attempt, wait_exponential
from pydantic import BaseModel  # Import BaseModel for creating request body
from api.nutrient_analyzer import get_nutrient_analysis
from api.data_extractor import extract_data, find_product, get_product
from api.ingredients_analysis import get_ingredient_analysis
from api.claims_analysis import get_claims_analysis
from api.cumulative_analysis import generate_final_analysis
from fastapi import FastAPI, File, UploadFile
from typing import List
import base64
import re
import starlette.datastructures
from fastapi.middleware.cors import CORSMiddleware






#Used the @st.cache_resource decorator on this function. 
#This Streamlit decorator ensures that the function is only executed once and its result (the OpenAI client) is cached. 
#Subsequent calls to this function will return the cached client, avoiding unnecessary recreation.
from dotenv import load_dotenv
load_dotenv() 


app = FastAPI()
# CORS(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow these origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
class ApiResponseFormat(BaseModel):
    success: bool
    message: str
    status_code: int
    data: Dict[str, Any]
# @st.cache_resource
def api_response(response: ApiResponseFormat):
    return response.model_dump()
def get_openai_client():
    #Enable debug mode for testing only
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

client = get_openai_client()

# @st.cache_resource
def create_assistant_and_embeddings():

    global client
    
    assistant1 = client.beta.assistants.create(
      name="Processing Level",
      instructions="You are an expert dietician. Use your knowledge base to answer questions about the processing level of food product.",
      model="gpt-4o",
      tools=[{"type": "file_search"}],
      temperature=0,
      top_p = 0.85
      )

      # Create a vector store
    vector_store1 = client.beta.vector_stores.create(name="Processing Level Vec")
    
    # Ready the files for upload to OpenAI
    file_paths = ["docs/Processing_Level.docx"]
    file_streams = [open(path, "rb") for path in file_paths]
    
    # Use the upload and poll SDK helper to upload the files, add them to the vector store,
    # and poll the status of the file batch for completion.
    file_batch1 = client.beta.vector_stores.file_batches.upload_and_poll(
      vector_store_id=vector_store1.id, files=file_streams
    )
    
    # You can print the status and the file counts of the batch to see the result of this operation.
    print(file_batch1.status)
    print(file_batch1.file_counts)

    #Processing Level
    assistant1 = client.beta.assistants.update(
      assistant_id=assistant1.id,
      tool_resources={"file_search": {"vector_store_ids": [vector_store1.id]}},
    )

    return assistant1
    
assistant_p = create_assistant_and_embeddings()

async def extract_data_from_product_image(images_list):
    raw_response = await extract_data({"images_list" : images_list})
    return raw_response 
            
async def get_product_list(product_name_by_user):
    product_list = await find_product(product_name_by_user)
    return product_list

async def get_product_info(product_name):
    print(f"getting product info from mongodb for {product_name}")
    product_info = await get_product(product_name)
    return product_info

# Define a sample request body that matches NutrientAnalysisRequest
class NutrientAnalysisRequest(BaseModel):
    product_info_from_db: dict
    
async def analyze_nutrition_using_icmr_rda(product_info_from_db):
    raw_response = await get_nutrient_analysis(NutrientAnalysisRequest(product_info_from_db=product_info_from_db))
    return raw_response

def generate_cumulative_analysis(
    brand_name: str,
    product_name: str,
    nutritional_level: str,
    processing_level: str,
    all_ingredient_analysis: str,
    claims_analysis: str,
    refs: list
):
    print(f"Calling cumulative-analysis API with refs : {refs}")
    raw_response = generate_final_analysis({'brand_name': brand_name, 'product_name': product_name, 'nutritional_level': nutritional_level, 'processing_level': processing_level, 'all_ingredient_analysis': all_ingredient_analysis, 'claims_analysis': claims_analysis, 'refs': refs})
    return raw_response

async def analyze_processing_level_and_ingredients(product_info_from_db, assistant_p_id):
    print("calling processing level and ingredient_analysis func")
    print(f"assistant_p_id is of type {type(assistant_p_id)}")

    request_payload = {
        "product_info_from_db": product_info_from_db,
        "assistant_p_id": assistant_p_id
    }
    
    raw_response = await get_ingredient_analysis(request_payload)
    print("Processing and Ingredient analysis finished!")
    return raw_response

def analyze_claims_list(product_info_from_db):
    print("calling claims analysis func")
    raw_response = get_claims_analysis(product_info_from_db)
    return raw_response
  
async def analyze_product(product_info_from_db):
    global assistant_p
    
    if product_info_from_db:
        brand_name = product_info_from_db.get("brandName", "")
        product_name = product_info_from_db.get("productName", "")
        start_time = time.time()

        # Verify each function is async and returns a coroutine
        coroutines = []
        
        # Ensure each function is an async function and returns a coroutine
        nutrition_coro = analyze_nutrition_using_icmr_rda(product_info_from_db)
        processing_coro = analyze_processing_level_and_ingredients(product_info_from_db, assistant_p.id)
        
        coroutines.append(nutrition_coro)
        coroutines.append(processing_coro)

        # Conditionally add claims analysis
        # You can use asyncio.to_thread() to run the synchronous analyze_claims function in a separate thread, allowing it to run in parallel with your other asynchronous functions. Here’s how you can do it:
        if product_info_from_db.get("claims"):
            claims_coro = asyncio.to_thread(analyze_claims_list, product_info_from_db)
            coroutines.append(claims_coro)

        # Debug: Print coroutine types to verify
        print("Coroutines:", [type(coro) for coro in coroutines])

        # Parallel API calls
        results = await asyncio.gather(*coroutines)

        # Unpack results based on the number of coroutines
        nutritional_level_json = results[0]
        refs_ingredient_analysis_json = results[1]
        claims_analysis_json = results[2] if len(results) > 2 else None
        

        # Extract data from API results
        nutritional_level = nutritional_level_json["nutrition_analysis"]
        refs = refs_ingredient_analysis_json["refs"]
        all_ingredient_analysis = refs_ingredient_analysis_json["all_ingredient_analysis"]
        processing_level = refs_ingredient_analysis_json["processing_level"]
        claims_analysis = claims_analysis_json["claims_analysis"] if claims_analysis_json else ""

        # Generate final analysis
        final_analysis = generate_cumulative_analysis(
            brand_name, 
            product_name, 
            nutritional_level, 
            processing_level, 
            all_ingredient_analysis, 
            claims_analysis, 
            refs
        )

        print(f"DEBUG - Cumulative analysis finished in {time.time() - start_time} seconds")
        return final_analysis
        

async def chatbot_response(images_list, product_name_by_user, extract_info = True):
    # Process the user input and generate a response
    processing_level = ""
    harmful_ingredient_analysis = ""
    claims_analysis = ""
    image_urls = []
    product_name_by_user= product_name_by_user.split(" by ")[0]
    if product_name_by_user != "":
        similar_product_list = await get_product_list(product_name_by_user)
        
        if not similar_product_list:
            # return api_response(ApiResponseFormat(success=False, message="Product not found in our database. Please upload files to analyze the product.", status_code=404, data={}))
            return "Product not found in our database. Please provide image url or upload files to analyze the product.", 404
        if similar_product_list and extract_info == False:
                print(f"similar_product_list : {similar_product_list}")
                # return api_response(ApiResponseFormat(success=True, message="Here are some similar products in our database. Please select one to analyze.", status_code=200, data={"products": similar_product_list}))
                return similar_product_list, 200
            
        elif similar_product_list and extract_info == True:
                print("Analyzing product using data from 3,000+ peer-reviewed journal papers...")
                product_info_raw = await get_product_info(product_name_by_user)
                if not product_info_raw:
                    return "Product not found in our database. Please upload files to analyze the product.", 404
                print(f"DEBUG product_info_raw from name: {type(product_info_raw)} {product_info_raw}")
                if not product_info_raw:
                    # return api_response(ApiResponseFormat(success=False, message="product not found because product information in the db is corrupt", status_code=404, data={}))
                    return "Product not found in our database. Please upload files to analyze the product.", 404
                if 'error' not in product_info_raw.keys():
                    final_analysis = await analyze_product(product_info_raw)
                    return final_analysis, 201
                else:
                    return [], 404
                
    
    elif images_list:
            
            if isinstance(images_list[0], starlette.datastructures.UploadFile):
                try:
                    for image_content in images_list:

                        image_content = image_content.file.read()
                        base64_image = f"data:image/jpeg;base64,{base64.b64encode(image_content).decode('utf-8')}"
                        image_urls.append(base64_image)
                except:
                    return "Error reading image file", 500
            else:
                if "," not in images_list:
                    image_urls.append(images_list)
                else:
                    for url in images_list.split(","):
                        if "http:/" in url.lower() or "https:/" in url.lower():
                            image_urls.append(url)
            
            try:
                print("Analyzing the proudct... This may take a moment.")
            
                product_info_raw = await extract_data_from_product_image(image_urls)
                print("DEBUG product_info_raw from image : ", product_info_raw)
                print(f"DEBUG product_info_raw from image : {product_info_raw}")
                if 'error' not in product_info_raw.keys():
                    final_analysis = await analyze_product(product_info_raw)
                    print("DEBUG final_analysis : ", final_analysis)
                    return final_analysis, 201
                else:
                    return f"Product information could not be extracted from the image because of {json.loads(product_info_raw)['error']}", 500
            except Exception as e:
                return str(e), 500
    else:
       
          return "I'm here to analyze food products. Please provide an image URL (Example : http://example.com/image.jpg) or product name (Example : Harvest Gold Bread) or upload an image of the product to analyze.", 200


# class ProductSelector:
#     """Handles product selection logic"""
#     @staticmethod
#     def handle_selection():
#         if st.session_state.similar_products:
#             # Create a container for the selection UI
#             selection_container = st.container()
            
#             with selection_container:
#                 # Radio button for product selection
#                 choice = st.radio(
#                     "Select a product:",
#                     st.session_state.similar_products + ["None of the above"],
#                     key="product_choice"
#                 )
                
#                 # Confirm button
#                 confirm_clicked = st.button("Confirm Selection")
#                 print(f"Is Selection made by user ? : {confirm_clicked}")

#                 # Only process the selection when confirm is clicked
#                 msg = ""
#                 if confirm_clicked:
#                     st.session_state.awaiting_selection = False
#                     if choice != "None of the above":
#                         #st.session_state.selected_product = choice
#                         st.session_state.messages.append({"role": "assistant", "content": f"You selected {choice}"})
#                         print(f"Selection made by user : {choice}")
#                         _, msg = chatbot_response([], choice.split(" by ")[0], extract_info=True)
#                         print(f"msg is {msg}")
#                         #Check if analysis couldn't be done because db had incomplete information
#                         if msg != "product not found because product information in the db is corrupt":
#                             #Only when msg is acceptable
#                             st.session_state.messages.append({"role": "assistant", "content": msg})
#                             with st.chat_message("assistant"):
#                                 st.markdown(msg)
                                
#                             st.session_state.product_selected = True
                            
#                             keys_to_keep = ["messages", "welcome_msg"]
#                             keys_to_delete = [key for key in st.session_state.keys() if key not in keys_to_keep]
                        
#                             for key in keys_to_delete:
#                                 del st.session_state[key]
#                             st.session_state.welcome_msg = "What product would you like me to analyze next?"
#                         st.rerun()
                        
#                     if (choice == "None of the above" or msg == "product not found because product information in the db is corrupt") and len(st.session_state.uploaded_files) == 0:
#                         if not st.session_state.awaiting_image_upload:
#                             st.session_state.messages.append(
#                                 {"role": "assistant", "content": "Please provide the images of the product to analyze based on the latest information."}
#                             )
#                             with st.chat_message("assistant"):
#                                 st.markdown("Please provide the images of the product to analyze based on the latest information.")
                        
#                         # Add a file uploader to allow users to upload multiple images
#                         st.session_state.awaiting_image_upload = True
                        
#                         uploaded_files = st.file_uploader(
#                             "Upload product images here:",
#                             type=["jpg", "jpeg", "png"],
#                             accept_multiple_files=True
#                         )
                    
#                         if uploaded_files:
#                             st.session_state.messages.append(
#                                 {"role": "assistant", "content": f"{len(uploaded_files)} images uploaded for analysis."}
#                             )
#                             with st.chat_message("assistant"):
#                                 st.markdown(f"{len(uploaded_files)} images uploaded for analysis.")
                                
#                             st.session_state.uploaded_files = uploaded_files
#                             st.session_state.awaiting_image_upload = False
#                             st.experimental_rerun()
                
#                 # Prevent further chat input while awaiting selection
#                 return True  # Indicates selection is in progress
            
#         return False  # Indicates no selection in progress

class ChatManager:
    """Manages chat interactions and responses"""
    @staticmethod
    async def process_response(user_input, flag):
        
        
        def is_url(input_text):
            return bool(re.match(r'https?://.*\.(jpeg|jpg|png|webp|gif)', input_text, re.IGNORECASE))
        
        # def encode_image_to_base64(image_file: UploadFile) -> str:
        #     try:
        #         image_content = image_file.file.read()
        #         return base64.b64encode(image_content).decode('utf-8')
        #     except Exception as e:
        #         print(f"[X] Error reading image file: {e}")
        #         return None
        
        
        print(type(user_input))
        if isinstance(user_input[0], starlette.datastructures.UploadFile):
            print("Handling image upload")
            
            chat_response, status = await chatbot_response(user_input, "", extract_info=True)
            return chat_response, status

        if isinstance(user_input, str) and is_url(user_input):
            print("Handling image URL")
            chat_response, status = await chatbot_response(user_input, "", extract_info=True)
            return chat_response, status
        
        if isinstance(user_input, str):
            print("Handling product name")
            chat_response, status = await chatbot_response( [], user_input, extract_info=flag)
            
            if chat_response:
                return chat_response, status

            return "Product information could not be extracted from our database", 500





        if not user_input:
            print(f'[X] user_input is empty')
            # return api_response(ApiResponseFormat(success=True, message="I'm here to analyze food products. Please provide an image URL (Example : http://example.com/image.jpg) or product name (Example : Harvest Gold Bread) or upload an image of the product to analyze.", status_code=200, data={}))
            return "I'm here to analyze food products. Please provide an image URL (Example : http://example.com/image.jpg) or product name (Example : Harvest Gold Bread) or upload an image of the product to analyze.", 200
        
        # return api_response(ApiResponseFormat(success=False, message="Product information could not be extracted from our database", status_code=404, data={}), "no success")
        # chat_response= ChatManager._handle_product_name(user_input, flag)
    
        return "Provide correct url or image", 500
    
   




# Call the wrapper function in Streamlit
class ChatRequest(BaseModel):
    message: str
    flag: bool = False
    
    
@app.post("/chat")
async def chat(request: ChatRequest):
    user_input = request.message
    print(f"User input is {user_input}")
    if user_input:
        chat_response, status = await ChatManager.process_response(user_input, request.flag)
    else:
        chat_response = "Provide product name or image url"
        status = 404
        
    if chat_response and status == 200:
        return api_response(ApiResponseFormat(success=True, message="", status_code=200, data={"response": chat_response}))
    elif chat_response and status == 201:
        return api_response(ApiResponseFormat(success=True, message="", status_code=201, data={"response": chat_response}))
    else:
        return api_response(ApiResponseFormat(success=False, message=chat_response, status_code=status, data={}))
    
@app.post("/upload_image")
async def upload_image(file: List[UploadFile]= File(...)):
    
    
    chat_response, status = await ChatManager.process_response(file, True)
    

    if chat_response and status == 200:
        return api_response(ApiResponseFormat(success=True, message="", status_code=status, data={"response": chat_response}))
    elif chat_response and status == 201:
        return api_response(ApiResponseFormat(success=True, message="", status_code=201, data={"response": chat_response}))
    else:
        return api_response(ApiResponseFormat(success=False, message=chat_response, status_code=status, data={}))

    


@app.get("/")
def home():
    return "Welcome to ConsumeWiseAI"


if __name__ == "__main__":
    app.run()
