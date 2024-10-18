# Product Label Information Extraction

This project is designed to extract key information from product labels found on packaging images. The data is parsed from images, processed via OpenAI's GPT-4 model, and then stored in a MongoDB database. 

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Code Structure](#code-structure)
- [Execution Steps](#execution-steps)
- [Error Handling](#error-handling)
- [Future Improvements](#future-improvements)

## Project Overview

This project extracts product-related information such as ingredients, nutritional values, claims, brand name, FSSAI license numbers, and more by reading the packaging images of products. The information is then saved in a MongoDB database for further processing.

The flow involves:
1. Reading image URLs from a CSV file.
2. Sending the images to the OpenAI GPT-4 API for data extraction.
3. Storing the parsed information in a MongoDB collection.

## Technologies Used

- **Node.js**: JavaScript runtime for running the application.
- **MongoDB**: NoSQL database to store extracted information.
- **OpenAI GPT-4 API**: To interpret images and extract textual information.
- **Bluebird**: For enhanced handling of async operations and promises.
- **CSV Parser**: For reading and parsing CSV files.
- **File System (fs)**: To read the local CSV files.

## Setup Instructions

### Prerequisites

Make sure you have the following installed:

1. **Node.js** (v14.x or later)
2. **MongoDB** (running locally or in a Docker container)
3. **OpenAI API Key** (You need an API key from OpenAI to use GPT-4)

### MongoDB Setup

Make sure your MongoDB is running and accessible. You can spin up a local MongoDB instance using Docker:

```bash
#docker run -d -p 27017:27017 --name mongodb -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=example mongo:latest

docker run -d -p 27017:27017 --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=consumewise_db \
  -e MONGO_INITDB_ROOT_PASSWORD=p123@ \
  mongo:latest
```

### Environment Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/data-extractor.git
    cd label-extraction
    ```

2. Install the necessary dependencies:
    ```bash
    npm install
    npm install dotenv
    ```

3. Add your OpenAI API key. You can do this by creating a `.env` file and adding the following:

    ```env
    OPENAI_API_KEY=your_openai_api_key
    ```

4. Make sure you have a CSV file with product image URLs. The CSV should have one image URL per line, and the path to this file should be updated in the script (`csvPath`).

## Code Structure

- **extractInformation**: This function communicates with the OpenAI API and sends the product images for extraction. It uses a prompt-based system to extract specific details like ingredients, claims, nutritional information, etc.
  
- **main**: The main function is responsible for:
  1. Connecting to MongoDB.
  2. Reading and parsing the CSV file that contains product image URLs.
  3. Calling `extractInformation` for each set of images and inserting the extracted data into the MongoDB collection.

- **MongoDB Collection**: The extracted product information is saved in the `products` collection inside the `consumeWise` database.

## Execution Steps

To run the project, follow these steps:

1. **Ensure MongoDB is running**:
    - If using Docker, start MongoDB:
      ```bash
      docker start mongodb
      ```

2. **Run the Node.js script**:
    ```bash
    node index.js
    ```

3. **Check MongoDB**:
   Once the script is executed, you should see the extracted data in your MongoDB `products` collection.

   You can use MongoDB Compass or a terminal-based MongoDB shell to check if the data has been inserted correctly:
   
   ```bash
   #mongo --username=root --password=example
   mongo --username=consumewise_db --password=p123@
   use consumeWise
   db.products.find().pretty()
   ```

## Error Handling

The project contains basic error handling, including:
- **API Request Errors**: If the OpenAI request fails, it will be logged.
- **Database Insertion Errors**: If there’s any issue inserting data into MongoDB, the error is captured and logged.
- **Image Parsing Errors**: Any errors with missing or incorrect image URLs in the CSV will be logged and skipped.

### Sample Log Output:
If there is an error in extracting information, you will see:

```bash
Error in extracting information for product
```

If everything works fine, the output will be:

```bash
Inserting document into MongoDB.
```

## Future Improvements

1. **Improved Error Handling**: Currently, errors are logged but not retried. Introducing retry logic or a queue for failed operations could make the system more robust.
2. **Bulk Insert**: Instead of inserting one document at a time, implementing bulk insert operations in MongoDB for performance gains.
3. **Rate Limiting**: OpenAI API has rate limits, so it may be beneficial to add some throttling logic to prevent exceeding the API limits.
4. **Schema Validation**: Extend schema validation for more complex product fields or possible edge cases.

---

### Author

This project was developed by People+ai. Feel free to reach out for any issues or suggestions!

### Key Sections:
- **Project Overview** gives a brief on what the project does.
- **Technologies Used** outlines the tech stack.
- **Setup Instructions** detail environment and dependency setup.
- **Code Structure** breaks down the responsibilities of key functions.
- **Execution Steps** explains how to run the project.
- **Error Handling** mentions how errors are logged.
- **Future Improvements** suggests possible enhancements for the project.
