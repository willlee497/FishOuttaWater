import google.generativelanguage as gemini
from next_response import NextResponse
from google_generative_ai import GoogleGenerativeAI

# Set up your Gemini API key
gemini.api_key = 'AIzaSyBXeT_8Fio70S7DY3b4z8mP94TZWNX'

# Define a function to generate recipe using Python gemini library
def generate_recipe(prompt):
    # Use Gemini to create the recipe
    response = gemini.Completion.create(
        model="gemini-1",
        prompt=prompt,
        max_tokens=300,  # Adjust tokens for longer recipes if needed
        temperature=0.7  # Controls creativity level, adjust as needed
    )

    # Extract and return the recipe
    recipe = response.choices[0].text.strip()
    return recipe

# Create an asynchronous function POST to handle POST 
# request with parameters request and response.
async def POST(req, res):
    try:
        # Access your API key by creating an instance of GoogleGenerativeAI we'll call it GenAI
        genAI = GoogleGenerativeAI(process.env.GEMINI_API_KEY)

        # Initialize a generative model
        model = genAI.getGenerativeModel({ 'model': "gemini-pro" })

        # Retrieve the data we receive as part of the request body
        data = await req.json()

        # Define a prompt variable
        prompt = data['body']

        # Pass the prompt to the model and retrieve the output
        result = await model.generateContent(prompt)
        response = await result['response']
        output = await response.text()

        # Send the LLM output as a server response object
        return NextResponse.json({ 'output': output })
    except Exception as error:
        print(error)

# Example usage of the Python function
if __name__ == "__main__":
    prompt = "Generate a delicious recipe using Asian Carp that highlights easy preparation methods."
    print(generate_recipe(prompt))