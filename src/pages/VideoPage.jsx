import React, { useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import * as faceapi from "face-api.js"
import { createMatcher } from '../api/face'
import JSON_PROFILE from '../descriptors/bnk48.json';
const VideoPage = () => {
    const [isLoading,setIsLoading]=useState(false)
    const canvasRef = useRef()
    const videoRef = useRef()
    useEffect(() => {
        (() => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(devices => {
                videoRef.current.srcObject = devices
            }).then(async () => {
                await Promise.all([faceapi.loadTinyFaceDetectorModel("/models"), faceapi.loadFaceLandmarkTinyModel('/models'), faceapi.loadFaceRecognitionModel('/models')]).then(videoHandle)
            })
        })()
    }, [])
    const videoHandle = async () => {
        setInterval(async () => {
            const data = await faceapi
                .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks(true)
                .withFaceDescriptors();
            const faceMatchers = await createMatcher(JSON_PROFILE)
            canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current)
            faceapi.matchDimensions(canvasRef.current, {
                width: 500,
                height: 400
            })
            const resixed = faceapi.resizeResults(data, {
                width: 500,
                height: 400
            })
            for (const item of resixed) {
                const box = item.detection.box
                const drawBox = new faceapi.draw.DrawBox(box, {
                    label: faceMatchers.findBestMatch(item.descriptor)
                })
                drawBox.draw(canvasRef.current)
                
            }
        }, 1000)
    }
    return (
        <div style={{ display: 'flex' }}>
            <video crossOrigin='anonymous' style={{ width: 500, height: 400 }} autoPlay ref={videoRef} />
            <canvas ref={canvasRef} style={{ position: 'absolute', width: 500, height: 400 }}></canvas>
        </div>
    )
}

export default VideoPage