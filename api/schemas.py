# api/schemas.py
label_reader_schema = {
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
}
