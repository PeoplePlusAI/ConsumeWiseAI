def validate_response(response_json):
    """
    Validates the response JSON for completeness and brand/product name uniqueness.
    
    Args:
        response_json (dict): The JSON response to validate
        
    Returns:
        bool: True if validation passes, False otherwise
    """
    try:
        # 1. Check if all required fields are present and not empty
        required_fields = [
            "productName", "brandName", "ingredients", "servingSize",
            "packagingSize", "servingsPerPack", "nutritionalInformation",
            "fssaiLicenseNumbers", "claims", "shelfLife"
        ]
        
        # Check if any required field is missing or empty
        for field in required_fields:
            if field not in response_json or not response_json[field]:
                return False
        
        # Type checking for specific fields
        if not isinstance(response_json["ingredients"], list):
            return False
        
        if not isinstance(response_json["servingSize"], dict):
            return False
        
        if not isinstance(response_json["packagingSize"], dict):
            return False
        
        if not isinstance(response_json["servingsPerPack"], (int, float)):
            return False
        
        if not isinstance(response_json["nutritionalInformation"], list):
            return False
        
        if not isinstance(response_json["fssaiLicenseNumbers"], list):
            return False
        
        if not isinstance(response_json["claims"], list):
            return False
        
        if not isinstance(response_json["shelfLife"], str):
            return False
            
        # Validate serving size and packaging size structure
        for size_field in ["servingSize", "packagingSize"]:
            if not all(key in response_json[size_field] for key in ["quantity", "unit"]):
                return False
            if not isinstance(response_json[size_field]["quantity"], (int, float)):
                return False
            if not isinstance(response_json[size_field]["unit"], str):
                return False
        
        # 2. Check if brand name and product name have common words
        # Convert to lowercase and split into words, removing any special characters
        import re
        
        def clean_and_split_text(text):
            # Remove special characters and convert to lowercase
            cleaned_text = re.sub(r'[^a-zA-Z0-9\s]', '', text.lower())
            # Split into words and remove empty strings
            return set(word for word in cleaned_text.split() if word)
        
        brand_words = clean_and_split_text(response_json["brandName"])
        product_words = clean_and_split_text(response_json["productName"])
        
        # Check for common words
        if brand_words.intersection(product_words):
            return False
        
        return True
        
    except (KeyError, TypeError, AttributeError):
        return False
