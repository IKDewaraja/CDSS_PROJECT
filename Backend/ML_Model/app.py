from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

print("🚀 Loading trained model 'fall_risk_model.joblib'...")
model = joblib.load('fall_risk_model.joblib')
print("✅ AI Model successfully loaded into memory!")

# Print exact feature column names saved inside the model
if hasattr(model, 'feature_names_in_'):
    print(f"📐 Model Trained Feature Order: {list(model.feature_names_in_)}")
else:
    print("⚠️ Model does not contain explicit feature name metadata.")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        
        hrv = float(data.get('hrv', 0))
        sugar_level = float(data.get('bloodSugar', 0))
        spo2 = float(data.get('spo2', 0))
        
        print("\n" + "="*50)
        print(f"📥 REQUEST RECEIVED -> Blood Sugar: {sugar_level} | SpO2: {spo2}% | HRV: {hrv} ms")
        
        # Build DataFrame with dictionary matching CSV header names
        input_dict = {
            'HRV': [hrv],
            'Sugar level': [sugar_level],
            'SpO2': [spo2]
        }
        
        input_data = pd.DataFrame(input_dict)
        
        # Reorder columns explicitly according to trained model expectations
        if hasattr(model, 'feature_names_in_'):
            input_data = input_data[list(model.feature_names_in_)]
            print(f"🔄 Passing Input to Model in Order: {list(input_data.columns)} -> {input_data.values.tolist()[0]}")

        prediction = int(model.predict(input_data)[0])
        probabilities = model.predict_proba(input_data)[0]
        confidence = f"{max(probabilities) * 100:.1f}%"

        print(f"🤖 AI PREDICTION RESULT -> Class {prediction} (Confidence: {confidence})")
        print("="*50 + "\n")

        return jsonify({
            'predictedClass': prediction,
            'confidenceScore': confidence
        })

    except Exception as e:
        print(f"❌ Prediction Error: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    print("🌐 Python ML API starting on http://127.0.0.1:5000 ...")
    app.run(host='127.0.0.1', port=5000, debug=False)