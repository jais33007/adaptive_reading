import React, { useEffect } from 'react';
import axios from 'axios'
import { useQuery } from 'react-query'

 async function getEyeTrackerStatus(){
    const result = await axios.get('http://localhost:8765/tobii_pro/status/')
    return result.data
}

 async function getRecordingStatus(){
    const result = await axios.get('http://localhost:8765/recording/status/')
    return result.data
}

async function connectEyeTracker(){
    const result = await axios.get('http://localhost:8765/tobii_pro/connect/')
    return result.data
}
async function stopRecording(){
    const result = await axios.get('http://localhost:8765/recording/stop/')
    return result.data
}

async function disconnectEyeTracker(){
    const result = await axios.get('http://localhost:8765/tobii_pro/disconnect/')
    return result.data
}

async function startRecording(){
    const result = await axios.get('http://localhost:8765/recording/start/')
    return result.data
}

//<script>{handleMouseClickAnywhere()}</script>
async function captureScreen(){
    const result = await axios.get('http://localhost:8765/recording/capture/')
    return result.data
}

export function HandleMouseClickAnywhere(){
    useEffect(() => {
        window.addEventListener('mousedown', captureScreen());

        return () => {
                window.removeEventListener('mousedown', captureScreen());
            };
        }, []) 
}

function EyeTrackerComponent(){
    const { data: statusData, refetch: getEyeTrackerStatusApi } = useQuery('getStatus', getEyeTrackerStatus)
    const { data: recordingStatusData, refetch: getRecordingStatusApi } = useQuery('recordingStatus', getRecordingStatus)
    
    const { refetch: connectEyeTrackerApi} = useQuery('getConnectionStatus', connectEyeTracker,
    {onSuccess: ()=> {getEyeTrackerStatusApi(); getRecordingStatusApi()}, enabled:false})

    const { refetch: disconnectEyeTrackerApi} = useQuery('disconnect', disconnectEyeTracker,
    {onSuccess: ()=> {getEyeTrackerStatusApi(); getRecordingStatusApi()}, enabled:false})

    const { refetch: startRecordingApi} = useQuery('startRecording', startRecording,
    {onSuccess: ()=> {getEyeTrackerStatusApi(); getRecordingStatusApi()}, enabled:false})

    const { refetch: stopRecordingApi} = useQuery('stopRecording', stopRecording,
    {onSuccess: ()=> {getEyeTrackerStatusApi(); getRecordingStatusApi()}, enabled:false})

    //const { refetch: captureScreenApi} = useQuery('captureScreen', captureScreen,
    //{onSuccess: ()=> {getEyeTrackerStatusApi(); getRecordingStatusApi()}, enabled:false})

    useEffect(() => {
        const HandleMouseClickAnywhere = async () => {
          const result = await captureScreen();
          // Handle the captured result here
        };
    
        window.addEventListener('mousedown', HandleMouseClickAnywhere);
    
        return () => {
          window.removeEventListener('mousedown', HandleMouseClickAnywhere);
        };
      }, []); // Dependency array should be empty to run this effect once

    const isConnected = statusData && statusData.is_connected==true && statusData.is_supported==true
    const isRecording= recordingStatusData && recordingStatusData.is_recording==true && statusData && statusData.is_connected==true

    return (
        <div style={{ display: 'flex', width: '10rem', justifyContent: 'space-between' }}>
          <button onClick={() => (isConnected ? disconnectEyeTrackerApi() : connectEyeTrackerApi())}>
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      );
    }
    
    function EyeTrackerWrapper() {
      return <EyeTrackerComponent />;
    }
    
    export default EyeTrackerWrapper;


{/* <button onClick={()=>  isRecording ? stopRecordingApi() : startRecordingApi()}>{isRecording? "Stop Recording" : "Start Recording" }</button> */}