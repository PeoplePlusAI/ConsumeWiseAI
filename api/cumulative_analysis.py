from openai import OpenAI
import json, os, asyncio
from typing import Dict, Any
from .calc_consumption_context import get_consumption_context
from fastapi import FastAPI

app = FastAPI()

@app.post("/cumulative-analysis")
def generate_final_analysis(request):
    if not request.get('brand_name') or not request.get('product_name'):
        raise Exception("Please provide a valid product list")
    
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    brand_name = request.get('brand_name')
    product_name = request.get('product_name')
    nutritional_level = request.get('nutritional_level')
    processing_level = request.get('processing_level')
    all_ingredient_analysis = request.get('all_ingredient_analysis')
    claims_analysis = request.get('claims_analysis')
    refs = request.get('refs')
    
    print(f"DEBUG - {product_name} by {brand_name}")
    
    consumption_context = get_consumption_context(f"{product_name} by {brand_name}", client)
    
    system_prompt = """Tell the consumer whether the product is a healthy option at the assumed functionality along with the reasoning behind why it is a good option or not. Refer to Consumption Context as a guide for generating a recommendation. 

Additionally , these are the standard rules to follow.
If the product is very obviously junk like chocolates, chips, cola drinks then highlight the risk in a way that you're contextualising it for people.
If not necessarily perceived as a harmful product, then the job is to highlight the risk that is not very obvious and the user maybe missing
If the product is promoted as a healthier alternative on the brand packaging, then specifically check for hidden harms using the misleading claims framework
If the product is good, then highlight the most relevant benefit

Your source for deciding whether the user is thinking the product is healthy or not is two
- Check the 'perceived health benefit' column of category sheet 
- check if there is any information on the packaging that would make the user think otherwise

Only highlight the most relevant & insightful part of your analysis which may not be very obvious to user. If your decision is based on nutrition analysis, talk about that and give your analysis doing social math. If ingredients is the biggest positive or hazard, mention the ingredients with benefit or harm. If the analysis is based on processing level, mention that is good or bad on account of being minimally or highly processes respectively. If the decision is based on any misleading claims present, then talk about that.

This is how you will generate the response:

1. Recommendation
Restrict your answer to 30-50 words. If the answer is that it is a good option then generate a happy emoji and if it is not a good option then generate a sad emoji.

2. Risk Analysis 

A. Nutrition Analysis 

Case 1: If sugar, salt, calories and are high in quantity, 
Mention that along with RDA at the user’s serving size or ICMR values. Do social math here and contextualise the information of slat and sugar in teaspoons and calories equivalent to no of whole and healthy nutritious meals.
For sugar - also separately mention RDA from Total added sugar( added separately)  & naturally occurring sugars  (naturally part of the ingredients used)

Case 2: If good nutrients like protein & micronutrients, dietary fibre  are present in a good quantity, mention that. Highlight the presence of good nutrients - protein or micronutrients. give RDA values  at the user’s serving size. Do social match and contextualise the information. 

Case 3: For fat, explain the kind of fats present (trans, MUFA, PUFA), and whether it is good or bad. and what is the benefit or harm. 
 give RDA values, do social match and contextualise the information. 

Case 4: If it is a carbohydrates dense products, mention that. 
Mention RDA at user’s serving size.Do social math here and contextualise the information of the carbs equivalent to no of whole and healthy nutritious meals.

restrict your answer to 50 words, 2-3 sentence. 

B. Ingredeint Analysis 
Highlight the good or bad ingredients along with harm/benefit . Mention the ingredeint names. Provide the harm or benefit along with citations from the research paper. 

C. Misleading Claims 
Highlight the misleading claim identified along with the reason."""

    user_prompt = f"""
Brand Name : {brand_name}
Product Name: {product_name}

Consumption Context of the product is as follows -> 
{consumption_context}

Nutrition Analysis for the product is as follows ->
{nutritional_level}

Processing Level Analysis for the product is as follows ->
{processing_level}

Ingredient Analysis for the product is as follows ->
{all_ingredient_analysis}

Claims Analysis for the product is as follows ->
{claims_analysis}
"""
    print(f"\nuser_prompt : \n {user_prompt}")
        
    completion = client.chat.completions.create(
        model="gpt-4o",  # Make sure to use an appropriate model
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    base_response = f"Brand: {brand_name}\n\nProduct: {product_name}\n\nAnalysis:\n\n{completion.choices[0].message.content}"
    print(f"DEBUG raw refs is {refs}")  # Parse the JSON string back into a list
    refs_list = refs
    print(f"DEBUG refs_list is {refs_list}")

    if refs:  # This checks if refs is not empty
        try:
            if len(refs_list) > 0:
                L = min(2, len(refs_list))
                refs_str = '\n'.join(refs_list[0:L])
                return f"{base_response}\n\nTop Citations:\n\n{refs_str}"
            return base_response  # Need this for empty refs_list
        except json.JSONDecodeError as e:
            print(f"Error while decoding json : {e}")
            return base_response  # Need this for JSON decode errors
    
    return base_response  # For empty refs string
    #if len(refs) > 0:
    #    L = min(2, len(refs))
    #    refs_str = '\n'.join(refs[0:L])
    #    return f"Brand: {brand_name}\n\nProduct: {product_name}\n\nAnalysis:\n\n{completion.choices[0].message.content}\n\nTop Citations:\n\n{refs_str}"
    #else:
    #    return f"Brand: {brand_name}\n\nProduct: {product_name}\n\nAnalysis:\n\n{completion.choices[0].message.content}"
