import os
import pandas as pd

def create_Assistant(file_path, sheetname="Sheet6"):    
    # Read CSV file
    df = pd.read_excel(file_path, sheet_name=sheetname)
    
    # Set display options to show all rows and columns
    pd.set_option('display.max_rows', None)
    pd.set_option('display.max_columns', None)   # Show all columns
    
    # Print the entire DataFrame
    #print(df.head(5))
    return df

def get_consumption_context_row_num(df_str, client, user_query):
    
    completion = client.chat.completions.create(
        model="gpt-4o",  # Make sure to use an appropriate model
        messages=[
            {"role": "system", "content": f"""
            Return row number of the line which has the category and sub-category of the food product provided by the user. Output must only be an integer row number and nothing else
            {df_str}"""
            },
            {"role": "user", "content": user_query}
        ],
        temperature = 0
    )

    return completion.choices[0].message.content

def get_consumption_context(user_query, client):
    #user_query = "Kinder Joy by Kinder"
    #user_query = "Whey Protein"

    df = create_Assistant('docs/Actionable_Insight.xlsx')
    #call chatgpt to pick the correct category based on string created from every row of df => f"{Row num};{df['Category']};{df['Sub-category']};{df['Product Examples']}". Output must be the row num of the selected string
    df_str = ""
    # Iterate over the DataFrame rows
    for index, row in df.iterrows():
        #print(f"index : {index}")
        df_str += f"Row no - {index} Category - {row['Category']} Sub-category - {row['Sub-category']} Product Examples - {row['Product Examples']}\n"
    
    #client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    response = get_consumption_context_row_num(df_str, client, user_query)
    print(f"DEBUG - response to extract row num from {response}")
    
    row_num = int(response.split()[-1])
    #print(f"Row num is {row_num}")
    #print(df.iloc[row_num])
    row_str = f"""Category : {df.iloc[row_num, 0]}
    Sub-category : {df.iloc[row_num, 1]}
    
    Product Examples : {df.iloc[row_num, 2]}
    
    Functionality : {df.iloc[row_num, 3]}
    
    Assumed Consumption Frequency : {df.iloc[row_num, 4]}
    
    General product perception by the consumer  : {df.iloc[row_num, 5]}
    
    How to analyze the product? : {df.iloc[row_num, 6]}"""
    #Pick the selected row from df and collect column names and values of columns starting from col no. 3
    return row_str
