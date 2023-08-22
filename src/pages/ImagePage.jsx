import React, { useEffect, useRef, useState } from 'react'
import testImg from '../img/test.jpg';
import * as faceapi from "face-api.js"
import JSON_PROFILE from '../descriptors/bnk48.json';
import { createMatcher } from '../api/face';
import { Navigate } from 'react-router-dom';
const ImagePage = () => {
    const [isFace, setIsFace] = useState(false)
    const [isFace2, setIsFace2] = useState(false)
    const [state, setState] = useState({
        imageURL: testImg,
    })
    const [state2, setState2] = useState({
        imageURL: testImg,
    })
    const canvasRef = useRef()
    const imgRef = useRef()
    const canvasRef2 = useRef()
    const imgRef2 = useRef()
    const onClick = () => {
        if (!isFace || !isFace2) {
            alert('Cần chọn cảnh có khuôn mặt')
        }
        else {
            window.location.href = "https://www.facebook.com/"
            // <Navigate to={"https://www.facebook.com/"} />
        }
    }
    useEffect(() => {
        (async () => {
            // tải mô hình nhận diện khuôn mặt từ files models
            await Promise.all([faceapi.loadTinyFaceDetectorModel("/models"), faceapi.loadFaceLandmarkTinyModel('/models'), faceapi.loadFaceRecognitionModel('/models')]).then(await handleImage).then(() => {
                handleImage2()
            })
        })()
    }, [state, isFace,isFace2, state2])
    const handleImage = async () => {
        //tạo phần tử canvas từ img
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(imgRef.current)
        //sử dụng để so khớp kích thước của một đối tượng canvas với một kích thước đã chỉ định. 
        faceapi.matchDimensions(canvasRef.current, {
            width: 500,
            height: 400
        })
        //tải hình ảnh từ url cụ thể
        console.log(state.imageURL);
        const img = await faceapi.fetchImage(state.imageURL)
        console.log(img);
        //phát hiện các khuôn mặt có trong hình ảnh
        const data = await faceapi
            .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks(true)
            .withFaceDescriptors();
        //lấy mô tả khuôn mặt trong file có sẵn
        if (data.length > 0) {
            setIsFace(true)
        }
        const faceMatchers = await createMatcher(JSON_PROFILE)
        //thay đổi kích thước phát hiện khuôn mặt
        const resixed = faceapi.resizeResults(data, {
            width: 500,
            height: 400
        })
        for (const item of resixed) {
            const box = item.detection.box
            const drawBox = new faceapi.draw.DrawBox(box, {
                //tìm kiếm tên
                label: faceMatchers.findBestMatch(item.descriptor) || null
            })
            drawBox.draw(canvasRef.current)
        }
    }
    const handleImage2 = async () => {
        //tạo phần tử canvas từ img
        canvasRef2.current.innerHTML = faceapi.createCanvasFromMedia(imgRef2.current)
        //sử dụng để so khớp kích thước của một đối tượng canvas với một kích thước đã chỉ định. 
        faceapi.matchDimensions(canvasRef2.current, {
            width: 500,
            height: 400
        })
        //tải hình ảnh từ url cụ thể
        const img2 = await faceapi.fetchImage(state2.imageURL)
        //phát hiện các khuôn mặt có trong hình ảnh
        const data = await faceapi
            .detectAllFaces(img2, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks(true)
            .withFaceDescriptors();
        // lấy mô tả khuôn mặt trong file có sẵn
        if (data.length > 0) {
            setIsFace2(true)
        }
        else {
            setIsFace2(false)
        }
        const faceMatchers = await createMatcher(JSON_PROFILE)
        //thay đổi kích thước phát hiện khuôn mặt
        const resixed = faceapi.resizeResults(data, {
            width: 500,
            height: 400
        })
        for (const item of resixed) {
            const box = item.detection.box
            const drawBox = new faceapi.draw.DrawBox(box, {
                //tìm kiếm tên
                label: faceMatchers.findBestMatch(item.descriptor) || null
            })
            drawBox.draw(canvasRef2.current)
            console.log(drawBox.options.label.l);
        }
    }
    const handleFileChange = async (event) => {
        //tải ảnh lên
        const img = await faceapi.bufferToImage(event.target.files[0])
        setState({ ...state, imageURL: img.src })
    }
    const handleFileChange2 = async (event) => {
        //tải ảnh lên
        if (isFace) {
            const img = await faceapi.bufferToImage(event.target.files[0])
            setState2({ ...state, imageURL: img.src })
        }
    }
    console.log(canvasRef.current);
    return (
        <>
            <div style={{ display: 'flex' }}>
                {isFace && <p>pass</p>}
                <input
                    id="myFileUpload"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleFileChange}
                />
                <div style={{ display: 'flex' }}>
                    <img crossOrigin='anonymous' src={state.imageURL} ref={imgRef} alt="imageURL" style={{ width: 500, height: 400 }} />
                    <canvas ref={canvasRef} style={{ position: 'absolute', width: 500, height: 400 }}></canvas>
                </div>
                {isFace2 && <p>pass</p>}
                <input
                    id="myFileUpload"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleFileChange2}
                />
                <div style={{ display: 'flex' }}>
                    <img crossOrigin='anonymous' src={state2.imageURL} ref={imgRef2} alt="imageURL" style={{ width: 500, height: 400 }} />
                    <canvas ref={canvasRef2} style={{ position: 'absolute', width: 500, height: 400 }}></canvas>
                </div>
            </div>
            <button onClick={onClick}>Next</button>
        </>
    )
}

export default ImagePage