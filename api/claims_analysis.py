import sys
import os
import json
from typing import List, Dict, Any
import torch
from openai import OpenAI
from fastapi import FastAPI

app = FastAPI()

def create_assistant(client):
    assistant3 = client.beta.assistants.create(
      name="Misleading Claims",
      instructions="You are an expert dietician. Use your knowledge base to answer questions about the misleading claims about food product.",
      model="gpt-4o",
      tools=[{"type": "file_search"}],
      temperature=0,
      top_p = 0.85
      )

    # Create a vector store
    vector_store3 = client.beta.vector_stores.create(name="Misleading Claims Vec")
    
    # Ready the files for upload to OpenAI
    file_paths = ["rag_docs/MisLeading_Claims.docx"]
    file_streams = [open(path, "rb") for path in file_paths]
    
    # Use the upload and poll SDK helper to upload the files, add them to the vector store,
    # and poll the status of the file batch for completion.
    file_batch3 = client.beta.vector_stores.file_batches.upload_and_poll(
      vector_store_id=vector_store3.id, files=file_streams
    )

    #Misleading Claims
    assistant3 = client.beta.assistants.update(
      assistant_id=assistant3.id,
      tool_resources={"file_search": {"vector_store_ids": [vector_store3.id]}},
    )

    return assistant3
  
def analyze_claims(claims, ingredients, assistant_id, client):
    
    thread = client.beta.threads.create(
        messages=[
            {
                "role": "user",
                "content": "A food product named has the following claims: " + ', '.join(claims) + " and ingredients: " + ', '.join(ingredients) + """. Please evaluate the validity of each claim as well as assess if the product name is misleading.
The output must be in JSON format as follows: 

{
  <claim_name>: {
    'Verdict': <A judgment on the claim's accuracy, ranging from 'Accurate' to varying degrees of 'Misleading'>,
    'Why?': <A concise, bulleted summary explaining the specific ingredients or aspects contributing to the discrepancy>,
    'Detailed Analysis': <An in-depth explanation of the claim, incorporating relevant regulatory guidelines and health perspectives to support the verdict>
  }
}
"""
            }
                ]
    )
    
    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread.id,
        assistant_id=assistant_id,
        include=["step_details.tool_calls[*].file_search.results[*].content"]
    )
    
    # Polling loop to wait for a response in the thread
    messages = []
    max_retries = 10  # You can set a maximum retry limit
    retries = 0
    wait_time = 2  # Seconds to wait between retries

    while retries < max_retries:
        messages = list(client.beta.threads.messages.list(thread_id=thread.id, run_id=run.id))
        if messages:  # If we receive any messages, break the loop
            break
        retries += 1
        time.sleep(wait_time)

    # Check if we got the message content
    if not messages:
        raise TimeoutError("Processing Claims : No messages were returned after polling.")
        
    message_content = messages[0].content[0].text
    
      
    annotations = message_content.annotations
    
    #citations = []
    
    #print(f"Length of annotations is {len(annotations)}")
    
    for index, annotation in enumerate(annotations):
          if file_citation := getattr(annotation, "file_citation", None):
              #cited_file = client.files.retrieve(file_citation.file_id)
              #citations.append(f"[{index}] {cited_file.filename}")
              message_content.value = message_content.value.replace(annotation.text, "")
      
    #if debug_mode:
    #    claims_not_found_in_doc = []
    #    print(message_content.value)
    #    for key, value in json.loads(message_content.value.replace("```", "").replace("json", "")).items():
    #          if value.startswith("(NOT FOUND IN DOCUMENT)"):
    #              claims_not_found_in_doc.append(key)
    #    print(f"Claims not found in the doc are {','.join(claims_not_found_in_doc)}")
    #claims_analysis = json.loads(message_content.value.replace("```", "").replace("json", "").replace("(NOT FOUND IN DOCUMENT) ", ""))
    claims_analysis = {}
    if message_content.value != "":
        claims_analysis = json.loads(message_content.value.replace("```", "").replace("json", ""))

    claims_analysis_str = ""
    for key, value in claims_analysis.items():
      claims_analysis_str += f"{key}: {value}\n"
    
    return claims_analysis_str

@app.post("/claims-analysis")
def get_claims_analysis(product_info_from_db):
    
    if product_info_from_db:
        brand_name = product_info_from_db.get("brandName", "")
        product_name = product_info_from_db.get("productName", "")
        claims_list = product_info_from_db.get("claims", [])
        ingredients_list = [ingredient["name"] for ingredient in product_info_from_db.get("ingredients", [])]

        claims_analysis = ""
        
        if len(claims_list) > 0:
            #Create client
            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

            #Create assistant for processing level
            assistant_c = create_assistant(client)
            #Create embeddings
            claims_analysis = analyze_claims(claims_list, ingredients_list, assistant_c.id, client) if claims_list else ""
            print(f"Returning claims_analysis : {claims_analysis}")
            
        return {'claims_analysis' : claims_analysis}
