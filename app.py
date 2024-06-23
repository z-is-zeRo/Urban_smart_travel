# app.py
from flask import Flask, request, jsonify
import pandas as pd
import pickle
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

try:
    model = pickle.load(open('transport_model.pkl', 'rb'))
except Exception as e:
    print("Erreur lors du chargement du modèle:", e)
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is not None:
        try:
            data = request.get_json()
            df = pd.DataFrame([data])
            prediction = model.predict(df)
            return jsonify({'prediction': prediction.tolist()})
        except Exception as e:
            return jsonify({'error': str(e)})
    else:
        return jsonify({'error': 'Modèle non disponible'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
