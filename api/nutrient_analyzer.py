import sys
from .icmr import analyze_nutrients
from .rda import find_nutrition, rda_analysis, analyze_nutrition_icmr_rda
import os
import json, asyncio
from fastapi import FastAPI, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel

app = FastAPI()

def find_product_nutrients(product_info_from_db):
    #GET Response: {'_id': '6714f0487a0e96d7aae2e839',
    #'brandName': 'Parle', 'claims': ['This product does not contain gold'],
    #'fssaiLicenseNumbers': [10013022002253],
    #'ingredients': [{'metadata': '', 'name': 'Refined Wheat Flour (Maida)', 'percent': '63%'}, {'metadata': '', 'name': 'Sugar', 'percent': ''}, {'metadata': '', 'name': 'Refined Palm Oil', 'percent': ''}, {'metadata': '(Glucose, Levulose)', 'name': 'Invert Sugar Syrup', 'percent': ''}, {'metadata': 'I', 'name': 'Sugar Citric Acid', 'percent': ''}, {'metadata': '', 'name': 'Milk Solids', 'percent': '1%'}, {'metadata': '', 'name': 'Iodised Salt', 'percent': ''}, {'metadata': '503(I), 500 (I)', 'name': 'Raising Agents', 'percent': ''}, {'metadata': '1101 (i)', 'name': 'Flour Treatment Agent', 'percent': ''}, {'metadata': 'Diacetyl Tartaric and Fatty Acid Esters of Glycerol (of Vegetable Origin)', 'name': 'Emulsifier', 'percent': ''}, {'metadata': 'Vanilla', 'name': 'Artificial Flavouring Substances', 'percent': ''}],
    
    #'nutritionalInformation': [{'name': 'Energy', 'unit': 'kcal', 'values': [{'base': 'per 100 g','value': 462}]},
    #{'name': 'Protein', 'unit': 'g', 'values': [{'base': 'per 100 g', 'value': 6.7}]},
    #{'name': 'Carbohydrate', 'unit': 'g', 'values': [{'base': 'per 100 g', 'value': 76.0}, {'base': 'of which sugars', 'value': 26.9}]},
    #{'name': 'Fat', 'unit': 'g', 'values': [{'base': 'per 100 g', 'value': 14.6}, {'base': 'Saturated Fat', 'value': 6.8}, {'base': 'Trans Fat', 'value': 0}]},
    #{'name': 'Total Sugars', 'unit': 'g', 'values': [{'base': 'per 100 g', 'value': 27.7}]},
    #{'name': 'Added Sugars', 'unit': 'g', 'values': [{'base': 'per 100 g', 'value': 26.9}]},
    #{'name': 'Cholesterol', 'unit': 'mg', 'values': [{'base': 'per 100 g', 'value': 0}]},
    #{'name': 'Sodium', 'unit': 'mg', 'values': [{'base': 'per 100 g', 'value': 281}]}],
    
    #'packagingSize': {'quantity': 82, 'unit': 'g'},
    #'productName': 'Parle-G Gold Biscuits',
    #'servingSize': {'quantity': 18.8, 'unit': 'g'},
    #'servingsPerPack': 3.98,
    #'shelfLife': '7 months from packaging'}

    product_type = None
    calories = None
    sugar = None
    total_sugar = None
    added_sugar = None
    salt = None
    serving_size = None

    if product_info_from_db["servingSize"]["unit"].lower() == "g":
        product_type = "solid"
    elif product_info_from_db["servingSize"]["unit"].lower() == "ml":
        product_type = "liquid"
    serving_size = product_info_from_db["servingSize"]["quantity"]

    for item in product_info_from_db["nutritionalInformation"]:
        if 'energy' in item['name'].lower():
            calories = item['values'][0]['value']
        if 'total sugar' in item['name'].lower():
            total_sugar = item['values'][0]['value']
        if 'added sugar' in item['name'].lower():
            added_sugar = item['values'][0]['value']
        if 'sugar' in item['name'].lower() and 'added sugar' not in item['name'].lower() and 'total sugar' not in item['name'].lower():
            sugar = item['values'][0]['value']
        if 'salt' in item['name'].lower():
            if salt is None:
                salt = 0
            salt += item['values'][0]['value']

    if salt is None:
        salt = 0
        for item in product_info_from_db["nutritionalInformation"]:
            if 'sodium' in item['name'].lower():
                salt += item['values'][0]['value']

    if added_sugar is not None and added_sugar > 0 and sugar is None:
        sugar = added_sugar
    elif total_sugar is not None and total_sugar > 0 and added_sugar is None and sugar is None:
        sugar = total_sugar

    return product_type, calories, sugar, salt, serving_size
    

# Define the request body using a simple BaseModel (without complex pydantic models if not needed)
class NutrientAnalysisRequest(BaseModel):
    product_info_from_db: dict

@app.post("/api/nutrient-analysis")
async def get_nutrient_analysis(request: NutrientAnalysisRequest):
    product_info = request.product_info_from_db
    try:
        if ("nutritionalInformation" not in product_info or "servingSize" not in product_info or "quantity" not in product_info["servingSize"]):
            return {"nutrition_analysis" : ""}
        if (len(product_info["nutritionalInformation"]) == 0 or product_info["servingSize"]["quantity"] == 0):
            return {"nutrition_analysis" : ""}
            
        nutritional_information = product_info["nutritionalInformation"]
        serving_size = product_info["servingSize"]["quantity"]
        
        if nutritional_information:
            try:
                product_type, calories, sugar, salt, serving_size = find_product_nutrients(product_info)
            except Exception as e:
                print(f"Error in find_product_nutrients: {str(e)}", exc_info=True)
                raise
                
            if product_type is not None and serving_size is not None and serving_size > 0:
                # Parallel execution of nutrient analysis tasks
                try:
                    nutrient_analysis, nutrient_analysis_rda_data = await asyncio.gather(
                        analyze_nutrients(product_type, calories, sugar, salt, serving_size),
                        rda_analysis(nutritional_information, serving_size)
                    )
                    print(f"DEBUG : ICMR based analysis is {nutrient_analysis}")
                    # Or with a try-except approach
                    try:
                        print(f"DEBUG : RDA Data is {nutrient_analysis_rda_data} with userServingSize of type {type(nutrient_analysis_rda_data['userServingSize'])} and nutritionPerServing of type {type(nutrient_analysis_rda_data['nutritionPerServing'])}")
                    except KeyError as e:
                        print(f"DEBUG: Missing key in nutrient_analysis_rda_data - {e}")
   
                except Exception as e:
                    raise
                
                try:
                    nutrient_analysis_rda = find_nutrition(nutrient_analysis_rda_data)
                    print(f"DEBUG : RDA based analysis is {nutrient_analysis_rda}")
                except Exception as e:
                    raise
                    
                try:
                    nutritional_level = await analyze_nutrition_icmr_rda(nutrient_analysis, nutrient_analysis_rda)
                    print(f"DEBUG : ICMR and RDA based analysis is {nutritional_level}")
                    return {"nutrition_analysis" : nutritional_level}
                except Exception as e:
                    raise
                
            else:
                error_msg = "Product information in the db is corrupt"
                raise HTTPException(status_code=400, detail=error_msg)
        else:
            error_msg = "Nutritional information is required"
            raise HTTPException(status_code=400, detail=error_msg)
    except HTTPException as http_ex:
        raise http_ex
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
