
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

    prompt = f"Summarize this given text without any additional information other than the given text:\n{paragraph}"
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=60,
        temperature=0.5
    )
    
    summary = response.choices[0].message['content'].strip()

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