from flask import Flask, request, jsonify, json
import pandas as pd
from keras.models import load_model
import numpy as np
from flask_cors import CORS, cross_origin
from sklearn.preprocessing import StandardScaler


app = Flask(__name__)
# CORS(app, origins=['http://localhost:3000']) 
cors = CORS(app, resources={r"/predict_engagement": {"origins": "http://localhost:3000"}})
print("CORS Configuration:", cors.__dict__)  # Log CORS configuration


model = load_model('final_model.h5')
# print(model.summary())

def feature_normalize(dataset):
    mu = np.mean(dataset, axis=0)
    sigma = np.std(dataset, axis=0)    
    return (dataset - mu) / sigma

@app.route('/predict_engagement', methods=['POST'])
def predict_engagement():
    if not request.json:
        return jsonify({'error': 'Missing JSON data'}), 400

    # print("Data Retrieved:", request.json)  # Log request headers

    try:
        data = request.json
        fixation_data = data['fixationData']['fixations']

        # Extract relevant features from fixation data (excluding timestamp)
        gaze_x = [fix[1] for fix in fixation_data]
        gaze_y = [fix[2] for fix in fixation_data]
        fixation_duration = [fix[3] for fix in fixation_data]
        pupil_diameter = [fix[4] for fix in fixation_data]

        # Create DataFrame from the extracted fixation data
        df = pd.DataFrame({'gazeX': gaze_x, 'gazeY': gaze_y, 'pupil_diameter': pupil_diameter})
        print (df)

        input_data = np.array(df)
        print ('input data shape:', input_data.shape )
        desired_shape = (1, 90, 3)
        padded_input_data = np.zeros(desired_shape)
        padded_input_data[:, :input_data.shape[0], :] = input_data
         # Reshape and normalize the padded_input_data using StandardScaler
        reshaped_array = padded_input_data.reshape((1, -1))  # Flatten to (1, 270) shape
        
        scaler = StandardScaler()
        scaler.fit(reshaped_array)
        
        # Transform reshaped_array using the fitted scaler
        normalized_data = scaler.transform(reshaped_array)
        
        # Reshape back to original shape
        normalized_data = normalized_data.reshape(padded_input_data.shape)

        # Make prediction using your model
        score = model.predict(normalized_data)
        
        # desired_shape = (1,256,3)
        # padded_input_data = np.zeros(desired_shape)
        # padded_input_data[:, :input_data.shape[0], :] = input_data
        # print (padded_input_data)
        # #reshaped_array = feature_normalize(padded_input_data.reshape(1, -1))
        # scalar = StandardScaler()
        
        # normalized_data = scalar.fit_transform(padded_input_data.reshape(1, -1))
        # score = model.predict(normalized_data)
        # print (score)
        # engagement_score = np.argmax(score, axis=1)
        # engagement_score = engagement_score.item()
        engagement_score = (score > 0.5).astype(int).item()  # Convert to binary class


        # Bounding box coordinates
        left_bound = 180
        right_bound = 750
        top_bound = 50
        bottom_bound = 650

         # Calculate average of the last 10 gaze points
        avg_gaze_x = np.mean(gaze_x[-20:])
        avg_gaze_y = np.mean(gaze_y[-20:])

        print ('Avg-gaze_x:', avg_gaze_x)
        print ('Avg-gaze_y:', avg_gaze_y)

        # Check if the average gaze point falls within the bounding box
        if avg_gaze_x < left_bound or avg_gaze_x > right_bound or avg_gaze_y < top_bound or avg_gaze_y > bottom_bound:
            engagement_score = 0

        

        # # Use fixation duration to adjust engagement score
        # if np.mean(fixation_duration) < 100:
        #     engagement_score = 0

        # Additional logic: use pupil diameter
        # if np.mean(pupil_diameter) < 2.5:  # Example threshold
        #     engagement_score = 0


        print ('Engagement-Score:',engagement_score)

        return jsonify({'success': True, 'engagementScore': engagement_score}), 200
    
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
