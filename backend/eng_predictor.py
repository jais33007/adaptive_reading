from flask import Flask, request, jsonify, json
import pandas as pd
from keras.models import load_model
import numpy as np
from flask_cors import CORS, cross_origin

app = Flask(__name__)
# CORS(app, origins=['http://localhost:3000']) 
cors = CORS(app, resources={r"/predict_engagement": {"origins": "http://localhost:3000"}})
print("CORS Configuration:", cors.__dict__)  # Log CORS configuration


model = load_model('eng_model.h5')
# print(model.summary())


def get_frames(df, frame_size, hop_size):
    N_FEATURES = len(df.columns)
    frames = []
    for i in range(0, len(df) - frame_size, hop_size):
        frame = []
        for column in df.columns:
            segment = df[column].values[i: i + frame_size]
            frame.append(segment)
        frames.append(frame)

    frames = np.asarray(frames).reshape(-1, frame_size, N_FEATURES)
    return frames

def feature_normalize(dataset):
    mu = np.mean(dataset, axis=0)
    sigma = np.std(dataset, axis=0)
    return (dataset - mu) / sigma

def prepare_data(data):
    Fs = 90
    frame_size = Fs * 2
    hop_size = Fs * 1
    df_val = data

    for col in df_val.columns:
        df_val[col] = feature_normalize(df_val[col])

    x_val = get_frames(df_val, frame_size, hop_size)

    num_time_periods, num_sensors = x_val.shape[1], x_val.shape[2]

    input_shape = (num_time_periods * num_sensors)
    x_val = x_val.reshape(x_val.shape[0], input_shape)

    x_val = x_val.astype("float32")
    return x_val    



@app.route('/predict_engagement', methods=['POST'])
def predict_engagement():
    if not request.json:
        return jsonify({'error': 'Missing JSON data'}), 400

    # print("Data Retrieved:", request.json)  # Log request headers

    try:
        data = request.json
        print (data)

        fixation_data = data['fixationData']['fixations']

        # Extract relevant features from fixation data (excluding timestamp)
        gaze_x = [fix[1] for fix in fixation_data]
        gaze_y = [fix[2] for fix in fixation_data]
        fixation_duration = [fix[3] for fix in fixation_data]

        # Create DataFrame from the extracted fixation data
        df = pd.DataFrame({'gazeX': gaze_x, 'gazeY': gaze_y, 'fixationDuration': fixation_duration})
        print (df)

        input_data = np.array(df)
        desired_shape = (1, 256, 3)
        padded_input_data = np.zeros(desired_shape)

        padded_input_data[:, :input_data.shape[0], :] = input_data
        print (padded_input_data.shape)
        reshaped_array = feature_normalize(padded_input_data.reshape(-1, 768))

        score = model.predict(reshaped_array)
        print (score)
        engagement_score = np.argmax(score, axis=1)
        engagement_score = engagement_score.item()

        for duration in fixation_duration:
            if duration < 100:
                engagement_score = 0  # Decrease engagement score

        # Example criteria: If gaze positions are outside a specific range, decrease engagement score
        for x, y in zip(gaze_x, gaze_y):
            if x < 0 or x > 1420 or y < 0 or y > 1080:
                engagement_score = 0  # Decrease engagement score

        # Ensure engagement score is within a certain range
        # engagement_score = max(0, min(10, engagement_score))  # Ensure score is between 0 and 10


        print ('Engagement-Score:',engagement_score)

        return jsonify({'success': True, 'engagementScore': engagement_score}), 200
    
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
