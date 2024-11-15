import math, json

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
def calculate_percentage(nutrient_value, daily_value):
    print(f"DEBUG : nutrient_value : {nutrient_value} daily_value : {daily_value}")
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
    #Example : scaled_nutrition : {'energy': 86.86, 'protein': 1.26, 'carbohydrates': 14.29, 'addedSugars': 5.06, 'dietaryFiber': 0.0, 
    #'totalFat': 2.74, 'saturatedFat': 1.28, 'monounsaturatedFat': 0.0, 'polyunsaturatedFat': 0.0, 'transFat': 0.0, 'sodium': 52.83}

    percentage_daily_values = {
        'energy': calculate_percentage(scaled_nutrition['energy'], daily_values['energy']),
        'protein': calculate_percentage(scaled_nutrition['protein'], daily_values['protein']),
        'carbohydrates': calculate_percentage(scaled_nutrition['carbohydrates'], daily_values['carbohydrates']),
        'addedSugars': calculate_percentage(scaled_nutrition['addedSugars'], daily_values['addedSugars']),
        'dietaryFiber': calculate_percentage(scaled_nutrition['dietaryFiber'], daily_values['dietaryFiber']),
        'totalFat': calculate_percentage(scaled_nutrition['totalFat'], daily_values['totalFat']),
        'saturatedFat': calculate_percentage(scaled_nutrition['saturatedFat'], daily_values['saturatedFat']),
        'sodium': calculate_percentage(scaled_nutrition['sodium'], daily_values['sodium']),
    }
    return scaled_nutrition, percentage_daily_values

def find_nutrition(data):
    #data is a dict. See https://github.com/ConsumeWise123/rda1/blob/main/clientp.py
    if not data:
        return ""
    try:
        nutrition_per_serving = data['nutritionPerServing']
        user_serving_size = 0
        
        if data['userServingSize'] != "":
            user_serving_size = float(data['userServingSize'])


        if not nutrition_per_serving:
            return json.dumps({"error": "Invalid nutrition data"})
        elif user_serving_size <= 0:
            return json.dumps({"error": "Invalid user serving size"})

        # Process and respond with scaled values and daily percentages
        scaled_nutrition, percentage_daily_values = process_nutrition_data(nutrition_per_serving, user_serving_size)
        print(f"DEBUG : percentage_daily_values : {percentage_daily_values}")

        rda_analysis_str = f"Nutrition per serving as percentage of Recommended Dietary Allowance (RDA) is {json.dumps(percentage_daily_values)}"
        print(f"DEBUG : rda_analysis_str : {rda_analysis_str}")
        return rda_analysis_str
        
    except Exception as e:
        return json.dumps({"error" : "Invalid JSON or input"})