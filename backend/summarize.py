
from flask import Flask, request, jsonify
import openai
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

# Set your OpenAI API key here
openai.api_key = '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'

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    paragraph = data.get('paragraph')
    print(paragraph)

    prompt = f"Summarize the following paragraph in a concise manner:\n\n{paragraph}\n\nSummary:"
    
    response = openai.Completion.create(
        engine="davinci-002",
        prompt=prompt,
        max_tokens=70,  
        temperature=0.3,  
        n=3,  # Generate 3 completions
        stop=None
    )
    
    summaries = [choice.text.strip() for choice in response.choices]
    summary = max(summaries, key=len)  # Pick the longest summary

    # Remove any URLs or unwanted parts
    summary = ' '.join(word for word in summary.split() if not word.startswith('http'))

    # Ensure the summary ends with a complete sentence
    sentence_endings = [".", "!", "?"]
    last_sentence = summary.split(".")[-1].strip()
    
    if not any(last_sentence.endswith(p) for p in sentence_endings):
        last_full_stop_index = summary.rfind(".")
        if last_full_stop_index != -1:
            summary = summary[:last_full_stop_index + 1]

    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(debug=True)
