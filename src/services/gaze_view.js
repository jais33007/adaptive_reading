import React from 'react'
import { useEffect } from 'react'

export const GazeView = () => {
  var gazeX = 0
  var gazeY = 0
  var fixations = []
  let eyeTrackingBaseUri = "http://localhost:8765"

  const handleGaze = (e) => {
    var d = e.data.split(',')
    if (d[1] === 0 || d[1] === 'nan') {
      return
    }

    const x = parseFloat(d[1]) - window.screenX
    const y =
      parseFloat(d[2]) -
      window.screenY -
      (window.outerHeight - window.innerHeight)

    gazeX = gazeX * 0.9 + x * 0.1
    gazeY = gazeY * 0.9 + y * 0.1

    const canvas = document.getElementById('gaze-canvas')
    if (canvas === null) {
      return
    }
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    ctx.fillStyle = 'rgba(68, 77, 146, 0.2)'
    ctx.arc(gazeX, gazeY, 50, 0, Math.PI * 2, true)
    ctx.fill()
  }

  const handleFixation = (e) => {
    var d = e.data.split(',')
    if (d[1] === 0 || d[1] === 'nan') {
      return
    }

    const timestamp = d[0]
    const x = parseFloat(d[1]) - window.screenX
    const y =
      parseFloat(d[2]) -
      window.screenY -
      (window.outerHeight - window.innerHeight)
    const duration = parseFloat(d[3])

    fixations.push([timestamp, x, y, duration])
    if (fixations.length > 5) {
      fixations.shift()
    }

    const canvas = document.getElementById('fixation-canvas')
    if (canvas === null) {
      return
    }
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    var lastX = null
    var lastY = null
    for (const fixation of fixations) {
      ctx.beginPath()
      ctx.fillStyle = 'rgba(115, 130, 245, 0.2)'
      ctx.arc(fixation[1], fixation[2], fixation[3] / 20, 0, Math.PI * 2, true)
      ctx.fill()
      ctx.closePath()

      if (lastX) {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(115, 130, 245, 0.4)'
        ctx.moveTo(lastX, lastY)
        ctx.lineTo(fixation[1], fixation[2])
        ctx.closePath()
        ctx.stroke()
      }
      lastX = fixation[1]
      lastY = fixation[2]
    }
  }

  useEffect(() => {
    try {
        const wsBaseURL = eyeTrackingBaseUri.replace(RegExp('https?'), 'ws')
        const prefix = 'tobii_pro'

        const wsr = new WebSocket(`${wsBaseURL}/${prefix}/raw`) // FIXME: replace with /gaze/
        wsr.onmessage = handleGaze

        const wsf = new WebSocket(`${wsBaseURL}/${prefix}/fixation`) // FIXME: replace with /gaze/
        wsf.onmessage = handleFixation
    } catch (error) {}
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const gazeData = {
        gazeX,
        gazeY,
      };
      const fixationData = {
        fixations,
      };
  
      fetch('http://localhost:8000/predict_engagement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gazeData, fixationData }),
      })
     .then(response => response.json())
     .then(data => {
        // Update the engagement score state variable based on the response
        // setEngagementScore(data.engagement_score);
      })
     .catch((error) => {
        console.error('Error:', error);
      });
    }, 4000);
  
    return () => {
      clearInterval(timer);
    };
  }, [gazeX, gazeY, fixations]);

  useEffect(() => {
    updateCanvas()
    window.addEventListener('resize', updateCanvas)
    return () => {
      window.removeEventListener('resize', updateCanvas)
    }
  }, [])

  const updateCanvas = () => {
    document.querySelectorAll('.loggerstation-canvas').forEach((dom) => {
      if ('width' in dom && 'height' in dom) {
        dom.width = window.innerWidth
        dom.height = window.innerHeight
      }
    })
  }

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
  )
}