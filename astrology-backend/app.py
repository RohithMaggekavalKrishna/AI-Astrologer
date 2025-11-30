from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Replace with your actual Gemini API Key
API_KEY = "#########################"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key={API_KEY}"

# 🔮 PREDICTION ROUTE
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    language = data.get('language', 'en')

    if language == 'kn':
        prompt = f"""
        ಈ ವ್ಯಕ್ತಿಗೆ ಸರಳ ಮತ್ತು ಸ್ಪಷ್ಟವಾದ ಜ್ಯೋತಿಷ ಭವಿಷ್ಯವಾಣಿ ನೀಡಿ (200 ಪದಗಳಲ್ಲಿ):
        ಹೆಸರು: {data['name']}
        ಹುಟ್ಟಿದ ದಿನಾಂಕ: {data['dob']}
        ಸಮಯ: {data['time']}
        ಸ್ಥಳ: {data['place']}
        """
    else:
        prompt = f"""
        Give a simple and clear Vedic astrology prediction for the following person in 200 words:
        Name: {data['name']}
        Date of Birth: {data['dob']}
        Time of Birth: {data['time']}
        Place of Birth: {data['place']}
        """

    headers = {"Content-Type": "application/json"}
    body = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    response = requests.post(GEMINI_API_URL, headers=headers, json=body)
    result = response.json()

    if 'candidates' in result:
        prediction = result['candidates'][0]['content']['parts'][0]['text']

        # Add your brother's contact information
        if language == 'kn':
            contact_msg = "\n\n📞 ಹೆಚ್ಚು ವಿವರಗಳಿಗಾಗಿ, ದಯವಿಟ್ಟು ಜ್ಯೋತಿಷಿ ರೋಹಿತ್ ಅವರನ್ನು ಸಂಪರ್ಕಿಸಿ: +91-98765-43210"
        else:
            contact_msg = "\n\n📞 For personalized solutions, contact astrologer Rohith: +91-98765-43210"

        return jsonify({"prediction": prediction + contact_msg})
    else:
        return jsonify({"prediction": "Gemini API did not return a valid response."})

# 💬 CHAT ROUTE
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    question = data.get('question', '')
    language = data.get('language', 'en')

    # Include birth details in the context
    name = data.get('name', '')
    dob = data.get('dob', '')
    time = data.get('time', '')
    place = data.get('place', '')

    if language == 'kn':
        prompt = f"""
        ಈ Astrology ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಿ ಮತ್ತು ಈ ವ್ಯಕ್ತಿಯ ಜಾತಕದ ವಿವರಗಳನ್ನು ಪರಿಗಣಿಸಿ:
        ಹೆಸರು: {name}
        ಹುಟ್ಟಿದ ದಿನಾಂಕ: {dob}
        ಸಮಯ: {time}
        ಸ್ಥಳ: {place}
        ಪ್ರಶ್ನೆ: {question}
        """
    else:
        prompt = f"""
        Answer the following astrology-related question by considering the user's birth details:
        Name: {name}
        Date of Birth: {dob}
        Time of Birth: {time}
        Place of Birth: {place}
        Question: {question}
        """

    headers = {"Content-Type": "application/json"}
    body = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    response = requests.post(GEMINI_API_URL, headers=headers, json=body)
    result = response.json()

    if 'candidates' in result:
        answer = result['candidates'][0]['content']['parts'][0]['text']
        return jsonify({"answer": answer})
    else:
        return jsonify({"answer": "Gemini could not return a valid response."})

if __name__ == '__main__':
    app.run(debug=True)
