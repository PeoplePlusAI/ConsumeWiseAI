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

1. **Find Product** (`GET /data_extractor/api/find-product`)
   - Searches products in database by name
   - Requires `product_name` parameter

2. **Get Product Details** (`POST /data_extractor/api/get-product`)
   - Retrieves detailed product information
   - Requires product list and index in request body

3. **Extract Data from Images** (`POST /data_extractor/api/extract-data`)
   - Extracts product information from image URLs
   - Accepts array of image links

4. **Nutrient Analysis** (`POST /nutrient_analyzer/api/nutrient-analysis`)
   - Analyzes product nutritional information
   - Requires nutritional data and serving size

5. **Processing Level Analysis** (`POST /ingredient_analysis/api/processing_level-ingredient-analysis`)
   - Analyzes ingredient processing levels
   - Requires ingredient list data

6. **Claims Analysis** (`POST /claims_analysis/api/claims-analysis`)
   - Verifies product claims
   - Requires product claims data

7. **Cumulative Analysis** (`POST /cumulative_analysis/api/cumulative-analysis`)
   - Generates comprehensive product analysis
   - Requires complete product analysis data

For detailed API documentation and request/response formats, please refer to the [API Documentation](docs/API.md).

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
