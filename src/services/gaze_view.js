import React, { useEffect, useState, useMemo } from 'react';

export const GazeView = ({ updateEngagementScore }) => {
  var gazeX = 0;
  var gazeY = 0;
  // let eyeTrackingBaseUri = "http://localhost:8765";
  // var fixations = [];

  const [fixations, setFixations] = useState([]);
  const eyeTrackingBaseUri = useMemo(() => "http://localhost:8765", []);

  console.log("Rendering GazeView component");

  const handleGaze = (e) => {
    var d = e.data.split(',');
    if (d[1] === 0 || d[1] === 'nan') {
      return;
    }

    const x = parseFloat(d[1]) - window.screenX;
    const y = parseFloat(d[2]) - window.screenY - (window.outerHeight - window.innerHeight);

    gazeX = gazeX * 0.9 + x * 0.1;
    gazeY = gazeY * 0.9 + y * 0.1;

    const canvas = document.getElementById('gaze-canvas');
    if (canvas === null) {
      return;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(68, 77, 146, 0.2)';
    ctx.arc(gazeX, gazeY, 50, 0, Math.PI * 2, true);
    ctx.fill();
  };

  const handleFixation = (e) => {
    var d = e.data.split(',');
    if (d[1] === 0 || d[1] === 'nan') {
      return;
    }

    const timestamp = d[0];
    const x = parseFloat(d[1]) - window.screenX;
    const y = parseFloat(d[2]) - window.screenY - (window.outerHeight - window.innerHeight);
    const duration = parseFloat(d[3]);
    const pupil_diameter = parseFloat(d[7])

    fixations.push([timestamp, x, y, duration, pupil_diameter]);
    if (fixations.length > 90) {
      fixations.shift();
    }

    const canvas = document.getElementById('fixation-canvas');
    if (canvas === null) {
      return;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var lastX = null;
    var lastY = null;
    for (const fixation of fixations) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(115, 130, 245, 0.2)';
      ctx.arc(fixation[1], fixation[2], fixation[3] / 20, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.closePath();

      if (lastX) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(115, 130, 245, 0.4)';
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(fixation[1], fixation[2]);
        ctx.closePath();
        ctx.stroke();
      }
      lastX = fixation[1];
      lastY = fixation[2];
    }
  };

  useEffect(() => {
    try {
      const wsBaseURL = eyeTrackingBaseUri.replace(RegExp('https?'), 'ws');
      const prefix = 'tobii_pro';

      const wsr = new WebSocket(`${wsBaseURL}/${prefix}/raw`); // FIXME: replace with /gaze/
      wsr.onmessage = handleGaze;

      const wsf = new WebSocket(`${wsBaseURL}/${prefix}/fixation`); // FIXME: replace with /gaze/
      wsf.onmessage = handleFixation;

      return () => {
        // Cleanup WebSocket connections
        wsr.close();
        wsf.close();
      };
    } catch (error) {
      console.error('Error establishing WebSocket connections:', error);
    }
  }, [eyeTrackingBaseUri]);

  useEffect(() => {
    const timer = setInterval(() => {
      
      if (fixations.length > 0) {
        const dataToSend = JSON.stringify({ fixationData: { fixations } });
        console.log('Sending data to server:');
  
        fetch('http://localhost:8000/predict_engagement', {
          mode: 'cors', // Allow CORS explicitly
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
          },
          body: dataToSend,
        })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
            console.log("Calling updateEngagementScore function");
            updateEngagementScore(data.engagementScore);
            })
          .catch((error) => {
            console.error('Error:', error);
          });
      } else {
        console.log('Fixations array is empty, not sending data to server.');
      }
    }, 3000);
  
    return () => {
      clearInterval(timer);
    };
  }, [fixations, updateEngagementScore]);

  useEffect(() => {
    updateCanvas();
    window.addEventListener('resize', updateCanvas);
    return () => {
      window.removeEventListener('resize', updateCanvas);
    };
  }, []);

  const updateCanvas = () => {
    document.querySelectorAll('.loggerstation-canvas').forEach((dom) => {
      if ('width' in dom && 'height' in dom) {
        dom.width = window.innerWidth;
        dom.height = window.innerHeight;
      }
    });
  };

  return (
    <>
      <canvas
        id="gaze-canvas"
        className="loggerstation-canvas"
      ></canvas>
      <canvas
        id="loggerstation fixation-canvas"
        className="loggerstation-canvas"
      ></canvas>
    </>
  );
};
