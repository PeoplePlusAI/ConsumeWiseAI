import json

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
def calculate_percentage_difference(value, threshold):
    if threshold is None:
        return None  # For nutrients without a threshold
    return ((value - threshold) / threshold) * 100

# Function to analyze nutrients and calculate differences
def analyze_nutrients(product_type, calories, sugar, salt, serving_size):
    threshold_data = thresholds.get(product_type)
    if not threshold_data:
        raise ValueError(f"Invalid product type: {product_type}")

    scaled_calories = (calories / serving_size) * 100 if calories is not None else None
    scaled_sugar = (sugar / serving_size) * 100 if sugar is not None else None
    scaled_salt = (salt / serving_size) * 100 if salt is not None else None

    nutrient_analysis = {}
    nutrient_analysis_str = ""
    
    if scaled_calories is not None:
        nutrient_analysis.update({'calories': {
            'value': scaled_calories,
            'threshold': threshold_data['calories'],
            'difference': scaled_calories - threshold_data['calories'],
            'percentageDiff': calculate_percentage_difference(scaled_calories, threshold_data['calories'])
        }})
        if nutrient_analysis['calories']['percentageDiff'] > 0:
            nutrient_analysis_str += f"Calories exceed the ICMR-defined threshold by {nutrient_analysis['calories']['percentageDiff']}%."
        else:
            nutrient_analysis_str += f"Calories are {nutrient_analysis['calories']['percentageDiff']}% below the ICMR-defined threshold."
            
    if scaled_sugar is not None:
        nutrient_analysis.update({'sugar': {
            'value': scaled_sugar,
            'threshold': threshold_data['sugar'],
            'difference': scaled_sugar - threshold_data['sugar'],
            'percentageDiff': calculate_percentage_difference(scaled_sugar, threshold_data['sugar'])
        }})
        if nutrient_analysis['sugar']['percentageDiff'] > 0:
            nutrient_analysis_str += f" Sugar exceeds the ICMR-defined threshold by {nutrient_analysis['sugar']['percentageDiff']}%."
        else:
            nutrient_analysis_str += f"Sugar is {nutrient_analysis['sugar']['percentageDiff']}% below the ICMR-defined threshold."
            
    if scaled_salt is not None:
        nutrient_analysis.update({'salt': {
            'value': scaled_salt,
            'threshold': threshold_data['salt'],
            'difference': scaled_salt - threshold_data['salt'],
            'percentageDiff': calculate_percentage_difference(scaled_salt, threshold_data['salt'])
        }})
        if nutrient_analysis['salt']['percentageDiff'] > 0:
            nutrient_analysis_str += f" Salt exceeds the ICMR-defined threshold by {nutrient_analysis['salt']['percentageDiff']}%."
        else:
            nutrient_analysis_str += f"Salt is {nutrient_analysis['salt']['percentageDiff']}% below the ICMR-defined threshold."

    return nutrient_analysis_str

# Example of how these functions can be called in the main code
#if __name__ == "__main__":
#    product_type = 'solid'  # 'solid' or 'liquid'
#    calories = 300
#    sugar = 4
#    salt = 700
#    serving_size = 100
#    added_fat = 5  # Optional

#    result = analyze_nutrients(product_type, calories, sugar, salt, serving_size, added_fat)
#    print(result)