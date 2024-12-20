import math, json, os
from openai import AsyncOpenAI
from typing import Dict, Any

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"), timeout=60.0)
# Function to scale nutrition values
def scale_nutrition(nutrition_per_serving, user_serving_size):
    scaling_factor = user_serving_size / nutrition_per_serving['servingSize']
    return {
        'energy': round(nutrition_per_serving['energy'] * scaling_factor, 2),
        'protein': round(nutrition_per_serving['protein'] * scaling_factor, 2),
        'carbohydrates': round(nutrition_per_serving['carbohydrates'] * scaling_factor, 2),
        'addedSugars': round(nutrition_per_serving['addedSugars'] * scaling_factor, 2),
        'dietaryFiber': round(nutrition_per_serving['dietaryFiber'] * scaling_factor, 2),
        'totalFat': round(nutrition_per_serving['totalFat'] * scaling_factor, 2),
        'saturatedFat': round(nutrition_per_serving['saturatedFat'] * scaling_factor, 2),
        'monounsaturatedFat': round(nutrition_per_serving['monounsaturatedFat'] * scaling_factor, 2),
        'polyunsaturatedFat': round(nutrition_per_serving['polyunsaturatedFat'] * scaling_factor, 2),
        'transFat': round(nutrition_per_serving['transFat'] * scaling_factor, 2),
        'sodium': round(nutrition_per_serving['sodium'] * scaling_factor, 2)
    }

# Function to calculate percentage of daily value
def calculate_percentage(nu, nutrient_value, daily_value):
    print(f"DEBUG : nutrient : {nu} nutrient_value : {nutrient_value} daily_value : {daily_value}")
    if daily_value == 0 or math.isnan(nutrient_value):
        return 'N/A'
    return f"{round((nutrient_value / daily_value) * 100, 2)}%"

# Main function to scale and calculate percentages (can be called directly in other parts of your code)
def process_nutrition_data(nutrition_per_serving, user_serving_size):
    # Recommended daily values (based on general guidelines)
    daily_values = {
        'energy': 2230,
        'protein': 55,
        'carbohydrates': 330,
        'addedSugars': 30,
        'dietaryFiber': 30,
        'totalFat': 74,
        'saturatedFat': 22,
        'sodium': 2000,
        'monounsaturatedFat': 25,
        'polyunsaturatedFat': 25,
        'transFat': 2
    }

    scaled_nutrition = scale_nutrition(nutrition_per_serving, user_serving_size)
    print(f"DEBUG - scaled_nutrition {scaled_nutrition}")
    #Example : scaled_nutrition : {'energy': 86.86, 'protein': 1.26, 'carbohydrates': 14.29, 'addedSugars': 5.06, 'dietaryFiber': 0.0, 
    #'totalFat': 2.74, 'saturatedFat': 1.28, 'monounsaturatedFat': 0.0, 'polyunsaturatedFat': 0.0, 'transFat': 0.0, 'sodium': 52.83}

    percentage_daily_values = {
        'energy': calculate_percentage('energy', scaled_nutrition['energy'], daily_values['energy']),
        'protein': calculate_percentage('protein', scaled_nutrition['protein'], daily_values['protein']),
        'carbohydrates': calculate_percentage('carbohydrates', scaled_nutrition['carbohydrates'], daily_values['carbohydrates']),
        'addedSugars': calculate_percentage('addedSugars', scaled_nutrition['addedSugars'], daily_values['addedSugars']),
        'dietaryFiber': calculate_percentage('dietaryFiber', scaled_nutrition['dietaryFiber'], daily_values['dietaryFiber']),
        'totalFat': calculate_percentage('totalFat', scaled_nutrition['totalFat'], daily_values['totalFat']),
        'saturatedFat': calculate_percentage('saturatedFat', scaled_nutrition['saturatedFat'], daily_values['saturatedFat']),
        'sodium': calculate_percentage('sodium', scaled_nutrition['sodium'], daily_values['sodium']),
    }
    print(f"DEBUG - percentage_daily_values {percentage_daily_values}")
    return scaled_nutrition, percentage_daily_values

def find_nutrition(data):
    #data is a dict. See https://github.com/ConsumeWise123/rda1/blob/main/clientp.py
    if not data:
        return ""
    try:
        #print(f"DEBUG - data is {data}")
        print(f"DEBUG - data['nutritionPerServing'] is {data['nutritionPerServing']}")
        print(f"DEBUG - data['userServingSize'] is {data['userServingSize']}")
        print(f"DEBUG - type of data['userServingSize'] is {type(data['userServingSize'])}")
        
        nutrition_per_serving = data['nutritionPerServing']
        
        user_serving_size = data['userServingSize']


        if not nutrition_per_serving:
            return json.dumps({"error": "Invalid nutrition data"})
        #elif user_serving_size <= 0:
        #    return json.dumps({"error": "Invalid user serving size"})

        # Process and respond with scaled values and daily percentages
        scaled_nutrition, percentage_daily_values = process_nutrition_data(nutrition_per_serving, user_serving_size)
        print(f"DEBUG : percentage_daily_values : {percentage_daily_values}")

        rda_analysis_str = f"Nutrition per serving as percentage of Recommended Dietary Allowance (RDA) is {json.dumps(percentage_daily_values)}"
        print(f"DEBUG : rda_analysis_str : {rda_analysis_str}")
        return rda_analysis_str
        
    except Exception as e:
        return json.dumps({"error" : "Invalid JSON or input"})

async def rda_analysis(product_info_from_db_nutritionalInformation: Dict[str, Any], 
                product_info_from_db_servingSize: float) -> Dict[str, Any]:
    """
    Analyze nutritional information and return RDA analysis data in a structured format.
    
    Args:
        product_info_from_db_nutritionalInformation: Dictionary containing nutritional information
        product_info_from_db_servingSize: Serving size value
        
    Returns:
        Dictionary containing nutrition per serving and user serving size
    """
    global client
    nutrient_name_list = [
        'energy', 'protein', 'carbohydrates', 'addedSugars', 'dietaryFiber',
        'totalFat', 'saturatedFat', 'monounsaturatedFat', 'polyunsaturatedFat',
        'transFat', 'sodium'
    ]

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": """You will be given nutritional information of a food product. 
                                Return the data in the exact JSON format specified in the schema, 
                                with all required fields."""
                },
                {
                    "role": "user",
                    "content": f"Nutritional content of food product is {json.dumps(product_info_from_db_nutritionalInformation)}. "
                              f"Extract the values of the following nutrients: {', '.join(nutrient_name_list)}."
                }
            ],
        response_format={"type": "json_schema", "json_schema": {
            "name": "Nutritional_Info_Label_Reader",
            "schema": {
                "type": "object",
                "properties": {
                    "energy": {"type": "number"},
                    "protein": {"type": "number"},
                    "carbohydrates": {"type": "number"},
                    "addedSugars": {"type": "number"},
                    "dietaryFiber": {"type": "number"},
                    "totalFat": {"type": "number"},
                    "saturatedFat": {"type": "number"},
                    "monounsaturatedFat": {"type": "number"},
                    "polyunsaturatedFat": {"type": "number"},
                    "transFat": {"type": "number"},
                    "sodium": {"type": "number"},
                    "servingSize": {"type": "number"},
                },
                "required": nutrient_name_list + ["servingSize"],
                "additionalProperties": False
            },
            "strict": True
        }}
        )
        
        # Parse the JSON response
        nutrition_data = json.loads(response.choices[0].message.content)
        
        # Validate that all required fields are present
        missing_fields = [field for field in nutrient_name_list + ["servingSize"] 
                         if field not in nutrition_data]
        if missing_fields:
            print(f"Missing required fields in API response: {missing_fields}")
        
        # Validate that all values are numbers
        non_numeric_fields = [field for field, value in nutrition_data.items() 
                            if not isinstance(value, (int, float))]
        if non_numeric_fields:
            raise ValueError(f"Non-numeric values found in fields: {non_numeric_fields}")
        
        return {
            'nutritionPerServing': nutrition_data,
            'userServingSize': product_info_from_db_servingSize
        }
        
    except Exception as e:
        # Log the error and raise it for proper handling
        print(f"Error in RDA analysis: {str(e)}")
        raise

async def analyze_nutrition_icmr_rda(nutrient_analysis, nutrient_analysis_rda):
    global client
    system_prompt = """
Task: Analyze the nutritional content of the food item and compare it to the Recommended Daily Allowance (RDA) or threshold limits defined by ICMR. Provide practical, contextual insights based on the following nutrients:

Nutrient Breakdown and Analysis:
Calories:

Compare the calorie content to a well-balanced meal.
Calculate how many meals' worth of calories the product contains, providing context for balanced eating.
Sugar & Salt:

Convert the amounts of sugar and salt into teaspoons to help users easily understand their daily intake.
Explain whether the levels exceed the ICMR-defined limits and what that means for overall health.
Fat & Calories:

Analyze fat content, specifying whether it is high or low in relation to a balanced diet.
Offer insights on how the fat and calorie levels may impact the user’s overall diet, including potential risks or benefits.
Contextual Insights:
For each nutrient, explain how its levels (whether high or low) affect health and diet balance.
Provide actionable recommendations for the user, suggesting healthier alternatives or adjustments to consumption if necessary.
Tailor the advice to the user's lifestyle, such as recommending lower intake if sedentary or suggesting other dietary considerations based on the product's composition.

Output Structure:
For each nutrient (Calories, Sugar, Salt, Fat), specify if the levels exceed or are below the RDA or ICMR threshold.
Provide clear, concise comparisons (e.g., sugar exceeds the RDA by 20%, equivalent to X teaspoons).    
    """

    user_prompt = f"""
Nutrition Analysis :
{nutrient_analysis}
{nutrient_analysis_rda}
"""
        
    completion = await client.chat.completions.create(
        model="gpt-4o",  # Make sure to use an appropriate model
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    return completion.choices[0].message.content
