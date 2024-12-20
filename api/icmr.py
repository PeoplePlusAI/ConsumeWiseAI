import os
import json
from typing import List, Dict, Any

# Nutrient thresholds for solids and liquids
thresholds = {
    'solid': {
        'calories': 250,
        'sugar': 3,
        'salt': 625
    },
    'liquid': {
        'calories': 70,
        'sugar': 2,
        'salt': 175
    }
}

# Function to calculate percentage difference from threshold
def calculate_percentage_difference(value: float, threshold: float) -> float:
    if threshold is None:
        return None  # For nutrients without a threshold
    return ((value - threshold) / threshold) * 100

# Function to analyze nutrients and calculate differences
async def analyze_nutrients(product_type: str, calories: float, sugar: float, salt: float, serving_size: float):
    threshold_data = thresholds.get(product_type)
    if not threshold_data:
        raise HTTPException(status_code=400, detail=f"Invalid product type: {product_type}")

    # Calculate scaled values based on serving size
    scaled_calories = (calories / serving_size) * 100 if calories is not None else None
    scaled_sugar = (sugar / serving_size) * 100 if sugar is not None else None
    scaled_salt = (salt / serving_size) * 100 if salt is not None else None

    nutrient_analysis = {}
    nutrient_analysis_str = ""
    
    # Analyze calories
    if scaled_calories is not None:
        nutrient_analysis['calories'] = {
            'value': scaled_calories,
            'threshold': threshold_data['calories'],
            'difference': scaled_calories - threshold_data['calories'],
            'percentageDiff': calculate_percentage_difference(scaled_calories, threshold_data['calories'])
        }
        if nutrient_analysis['calories']['percentageDiff'] > 0:
            nutrient_analysis_str += f"Calories exceed the ICMR-defined threshold by {nutrient_analysis['calories']['percentageDiff']}%."
        else:
            nutrient_analysis_str += f"Calories are {abs(nutrient_analysis['calories']['percentageDiff'])}% below the ICMR-defined threshold."
            
    # Analyze sugar
    if scaled_sugar is not None:
        nutrient_analysis['sugar'] = {
            'value': scaled_sugar,
            'threshold': threshold_data['sugar'],
            'difference': scaled_sugar - threshold_data['sugar'],
            'percentageDiff': calculate_percentage_difference(scaled_sugar, threshold_data['sugar'])
        }
        if nutrient_analysis['sugar']['percentageDiff'] > 0:
            nutrient_analysis_str += f" Sugar exceeds the ICMR-defined threshold by {nutrient_analysis['sugar']['percentageDiff']}%."
        else:
            nutrient_analysis_str += f"Sugar is {abs(nutrient_analysis['sugar']['percentageDiff'])}% below the ICMR-defined threshold."
            
    # Analyze salt
    if scaled_salt is not None:
        nutrient_analysis['salt'] = {
            'value': scaled_salt,
            'threshold': threshold_data['salt'],
            'difference': scaled_salt - threshold_data['salt'],
            'percentageDiff': calculate_percentage_difference(scaled_salt, threshold_data['salt'])
        }
        if nutrient_analysis['salt']['percentageDiff'] > 0:
            nutrient_analysis_str += f" Salt exceeds the ICMR-defined threshold by {nutrient_analysis['salt']['percentageDiff']}%."
        else:
            nutrient_analysis_str += f"Salt is {abs(nutrient_analysis['salt']['percentageDiff'])}% below the ICMR-defined threshold."

    return {"analysis": nutrient_analysis_str}
