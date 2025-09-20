import React, { useEffect, useRef, useState } from 'react';
import DetectionLabel from './DetectionLabel';

const CameraPreview = () => {
    const videoRef = useRef(null);
    const [detections, setDetections] = useState([]);

    useEffect(() => {
        const startVideo = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;

            // Start detecting objects
            detectObjects();
        };

        const detectObjects = async () => {
            const response = await fetch('http://localhost:5000/detect'); // Adjust the endpoint as needed
            const data = await response.json();
            setDetections(data.detections);

            // Call detectObjects again after a delay
            setTimeout(detectObjects, 1000); // Adjust the interval as needed
        };

        startVideo();

        return () => {
            if (videoRef.current) {
                const stream = videoRef.current.srcObject;
                if (stream) {
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());
                }
            }
        };
    }, []);

    return (
        <div>
            <video ref={videoRef} autoPlay playsInline width="640" height="480" />
            <DetectionLabel detections={detections} />
        </div>
    );
};

export default CameraPreview;