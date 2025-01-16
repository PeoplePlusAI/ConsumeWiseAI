I'll help integrate that content into the README.md file while maintaining proper markdown formatting. Here's the complete updated version:

# ConsumeWise: Digital Public Product Information System

## Introduction
The **ConsumeWise DPI** platform is designed to:
- Provide consumers with **detailed, verifiable information** about the health and environmental impact of products.
- Build a **decentralized, open-source repository** of product data for public use.
- Use this data to generate **personalized recommendations** for healthier and more sustainable consumption.

Learn more about the project [here](https://docs.google.com/document/d/e/2PACX-1vQ0I3DVqe_B-GlaqSRJ3QrwnBO7L6pE1uTZfGo9f7w4xI8Bci5oJl3tpM7oTaRRrE8mzbUfTe3RjVgg/pub).

## Getting Started

### Clone the Repository
```bash
git clone https://github.com/PeoplePlusAI/ConsumeWise.git
```

### Install Dependencies
Each folder contains a `requirements.txt` file with the necessary dependencies. To install them, run:
```bash
pip install -r requirements.txt
```

You'll also need to create a `.env` file with the following keys:
- MONGODB_URL
- OPENAI_API_KEY

### Running the Project
1. Each folder is a separate project with its own set of commands. Check each project's `README.md` file for specific instructions.
2. To run the main application:
   ```bash
   python app.py
   ```
3. To launch the Streamlit interface:
   ```bash
   streamlit run app.py
   ```

## API Documentation

### Available Endpoints

You're right - let me share the documentation in pure markdown format that you can directly use:

```markdown
# ConsumeWise Food Label Analysis API Documentation

## Endpoints

### 1. Find Product
- **Endpoint**: `GET /data_extractor/api/find-product`
- **Description**: Searches for products in the database based on product name
- **Query Parameters**:
  - `product_name` (string, required): Name of the product to search for
- **Response**:
  - Status Code: `200 OK`
  - Response Body:
  ```json
  {
      "products": ["Product 1", "Product 2"],
      "message": "Products found"
  }
  ```
  - Error Response:
  ```json
  {
      "products": [],
      "message": "No products found"
  }
  ```

### 2. Get Product Details
- **Endpoint**: `POST /data_extractor/api/get-product`
- **Description**: Retrieves detailed information about a specific product
- **Request Body**:
  ```json
  {
      "product_list": ["Product 1", "Product 2"],
      "ind": 1  // Index of selected product (1-based)
  }
  ```
- **Response**:
  - Status Code: `200 OK`
  - Response Body: Returns product information from database (product_info_from_db)

### 3. Extract Data from Images
- **Endpoint**: `POST /data_extractor/api/extract-data`
- **Description**: Extracts product information from provided image URLs
- **Request Body**:
  ```json
  {
      "image_links": [
          "url1",
          "url2"
      ]
  }
  ```
- **Response**: Returns extracted product information (product_info_from_db)

### 4. Nutrient Analysis
- **Endpoint**: `POST /nutrient_analyzer/api/nutrient-analysis`
- **Description**: Analyzes nutritional information of the product
- **Request Body**:
  ```json
  {
      "product_info_from_db": {
          "nutritionalInformation": [
              {
                  "name": "Energy",
                  "value": 384,
                  "unit": "kcal"
              }
          ],
          "servingSize": {
              "quantity": 70,
              "unit": "g"
          }
      }
  }
  ```
- **Response**:
  - Status Code: `200 OK`
  - Response Body:
  ```json
  {
      "nutrition_analysis": "string describing nutritional level"
  }
  ```

### 5. Processing Level Analysis
- **Endpoint**: `POST /ingredient_analysis/api/processing_level-ingredient-analysis`
- **Description**: Analyzes the processing level of ingredients
- **Request Body**:
  ```json
  {
      "product_info_from_db": {
          "ingredients": [
              {
                  "name": "Refined wheat flour",
                  "percent": "",
                  "metadata": ""
              }
          ]
      }
  }
  ```
- **Response**:
  - Status Code: `200 OK`
  - Response Body:
  ```json
  {
      "refs": ["reference1", "reference2"],
      "all_ingredient_analysis": "detailed analysis string",
      "processing_level": "processing level string"
  }
  ```

### 6. Claims Analysis
- **Endpoint**: `POST /claims_analysis/api/claims-analysis`
- **Description**: Analyzes product claims for verification
- **Request Body**:
  ```json
  {
      "product_info_from_db": {
          "claims": [
              "Contains Wheat & Nut",
              "May contain Milk"
          ]
      }
  }
  ```
- **Response**:
  - Status Code: `200 OK`
  - Response Body:
  ```json
  {
      "claims_analysis": "detailed claims analysis string"
  }
  ```

### 7. Cumulative Analysis
- **Endpoint**: `POST /cumulative_analysis/api/cumulative-analysis`
- **Description**: Generates final comprehensive analysis of the product
- **Request Body**:
  ```json
  {
      "product_info": "Maggi",
      "product_name": "2-Minute Noodles Masala",
      "nutritional_level": "High in sodium",
      "processing_level": "Ultra-processed",
      "all_ingredient_analysis": "Analysis text...",
      "claims_analysis": "Claims verified...",
      "refs": ["ref1", "ref2"]
  }
  ```
- **Response**: Returns a string containing the final comprehensive analysis

## Common Headers
All POST requests require:
- `Content-Type: application/json`

## Status Codes
- `200 OK`: Success
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting
Currently, no rate limiting is implemented.

## Best Practices
1. Always check the product in database first before using image extraction
2. Provide clear, high-quality images when using image extraction
3. Include all required fields in request bodies
4. Handle responses appropriately in your application

## Workflow Example
1. Search for product using Find Product endpoint
2. If found, get details using Get Product Details
3. If not found, use Extract Data from Images
4. Process the product info through:
   - Nutrient Analysis
   - Processing Level Analysis
   - Claims Analysis (if claims exist)
5. Generate final analysis using Cumulative Analysis

For API support or issues, please contact the ConsumeWise team.
```

You can now copy this markdown directly into your documentation file. This format will render properly on GitHub, GitLab, or any other platform that supports markdown formatting. Would you like me to make any adjustments to the formatting?
## Contributing
We welcome contributions from the community. Please follow the guidelines outlined in [CONTRIBUTING.md](.github/CONTRIBUTING.md). Check out the [current bounties](https://docs.google.com/spreadsheets/d/1cqL3XJHp68mz-YxZ2hwR7sVMBzJ9tPJn3Bljcey0gJw/edit?usp=sharing) for more ways to get involved.

## Documentation
The `docs` folder contains detailed project documentation. To access or contribute, refer to the [docs/README.md](docs/README.md).

## Issues
If you encounter any issues, please create a new issue using the [issue template](.github/ISSUE_TEMPLATE.md). Provide as much detail as possible to help us understand and resolve the problem.

## Pull Requests
When submitting a pull request, please ensure all required information is filled out in the [pull request template](.github/PULL_REQUEST_TEMPLATE.md).

## Volunteer & Contribute
Interested in volunteering or contributing to the project? Refer to the [Volunteer page](https://peopleplus.ai/volunteer) for more information or check out the [CONTRIBUTING.md](.github/CONTRIBUTING.md) file for contribution guidelines.

## About Us
**People+AI** connects doers, dreamers, tinkerers, and innovators with ideas and resources to build an ecosystem that can empower a billion people to reach their potential. [Learn more](https://peopleplus.ai/).

---
**Made with ♥️ for 🇮🇳 by Team People+AI**
