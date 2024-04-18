from flask import Flask, request, jsonify
import pandas as pd
from keras.models import load_model
import numpy as np

app = Flask(__name__)

model = load_model('eng_model.h5')

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
    content = request.json
    gaze_data = content['gazeData']
    fixation_data = content['fixationData']

    df = pd.DataFrame({
        'gazeX': [gaze_data['gazeX']],
        'gazeY': [gaze_data['gazeY']],
        'fixations': [fixation_data['fixations']]
    })

    processed_data = prepare_data(df)
    score = model.predict(processed_data)
    engagement_score = np.argmax(score, axis=1)

    print (engagement_score)
    return jsonify({'engagement_score': engagement_score})

if __name__ == '__main__':
    app.run(debug=True, port=8000)
