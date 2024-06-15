from flask import Flask, request, jsonify
import pandas as pd
import joblib
import os

app = Flask(__name__)

# Đọc các đối tượng đã lưu từ thư mục 'pkl'
model = joblib.load('pkl/model.pkl')
scaler = joblib.load('pkl/scaler.pkl')
label_encoders = joblib.load('pkl/label_encoders.pkl')
categorical_columns = joblib.load('pkl/categorical_columns.pkl')
numerical_columns = joblib.load('pkl/numerical_columns.pkl')
features = joblib.load('pkl/features.pkl')

API_KEY = '1805QNTD1404'

def preprocess_input(data_input):
    input_df = pd.DataFrame([data_input])
    
    # Mã hóa các biến phân loại
    for col in categorical_columns:
        if col in input_df.columns:
            input_df[col] = label_encoders[col].transform(input_df[col])
        else:
            input_df[col] = 0  
    
    input_df[numerical_columns] = scaler.transform(input_df[numerical_columns])
    
    input_df = input_df[features]
    
    return input_df

@app.route('/api/v1/predict', methods=['POST'])
def predict():
    api_key = request.headers.get('x-api-key')
    if api_key != API_KEY:
        return jsonify({'error': 'Unauthorized access'}), 401
    
    try:
        data_input = request.json
        processed_data = preprocess_input(data_input)
        prediction = model.predict(processed_data)
        
        rounded_prediction = [round(p, 2) for p in prediction]
        return jsonify({'prediction': rounded_prediction})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
