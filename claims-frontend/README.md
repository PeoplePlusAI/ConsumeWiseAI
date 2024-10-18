# PeoplePlus AI - Product Claim Analyzer

This is a React application that helps users analyze product claims and ingredients by sending the data to an API for analysis. It also supports multilingual translations for the analysis output.

## Features

- **Submit Product Claims & Ingredients:** Users can input product claims (e.g., "Healthy", "Nutritional") and related ingredients.
- **Claim Analysis:** The app sends user input to a backend API, which returns a verdict, reasoning, and detailed analysis about the claim.
- **Multilingual Support:** After the analysis is received, users can translate the verdict into multiple languages (English, Hindi, Marathi).
- **Tab Navigation:** Users can easily navigate between tabs to see the verdict, why the claim was analyzed as such, and detailed analysis.

## Screenshots

Will be updated soon!

## Technologies Used

- **React**: Frontend framework used for building the UI.
- **JavaScript (ES6+)**: Primary programming language.
- **HTML/CSS**: For structuring and styling the UI.
- **Fetch API**: For sending HTTP requests to the backend.
- **Backend API**: Analyzes product claims (provided by PeoplePlus AI).

## Getting Started

### Prerequisites

To run this project, you'll need:

- [Node.js](https://nodejs.org/) (version 12 or higher)
- [npm](https://www.npmjs.com/get-npm) (version 6 or higher)
  
### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ConsumeWise123/claims-frontend.git
   cd claims-frontend/claims-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm start
   ```

   This will launch the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

4. **Build the app for production:**

   ```bash
   npm run build
   ```

   This will create an optimized build of the app in the `build/` folder, ready to be deployed.

## Usage

1. **Enter Product Claim:**
   - Input your product claim (e.g., "Healthy", "Organic").
   
2. **Enter Ingredients:**
   - Input ingredients related to the product.

3. **Submit the Form:**
   - Click on the "Submit" button. The app will send the claim and ingredients to the API for analysis.

4. **View Analysis Results:**
   - Once the analysis is complete, you can view the verdict, the reasoning behind it, and detailed analysis.

5. **Language Translation:**
   - Use the dropdown menu to select a different language (Hindi or Marathi) and translate the analysis output.

## Folder Structure

```
.
├── public
│   └── index.html          # HTML template for the app
├── src
│   ├── App.js              # Main App component
│   ├── ContentTab.js       # Tabbed content display
│   ├── Footer.js           # Footer component
│   ├── App.css             # Main CSS file for the App
│   ├── Tabs.css            # CSS for the tabs
│   └── index.js            # App entry point
└── package.json            # Project dependencies and scripts
```

## API Details

The app interacts with a backend API to:

- **Analyze Claims:** The `claims/analyze` endpoint takes product claims and ingredients as input and returns a detailed analysis of the claims.
- **Translation:** The `translate/indic` endpoint translates the analysis into the selected language.

### Sample API Request

To analyze a product claim and ingredients:

```
GET /claims/analyze?claim=Healthy&ingredients=Sugar, Milk
```

Sample API Response:

```json
{
  "verdict": "Misleading",
  "why": ["The claim 'Healthy' conflicts with high sugar content."],
  "detailed_analysis": "Detailed nutritional breakdown suggests excessive sugar."
}
```

### Translation API Request

```
GET /translate/indic?input_val={"verdict":"Misleading","why":["..."]}&language=hindi
```

## Contributing

If you'd like to contribute to this project:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request
