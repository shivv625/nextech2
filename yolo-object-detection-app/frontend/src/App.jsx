import React from 'react';
import CameraPreview from './components/CameraPreview';
import DetectionLabel from './components/DetectionLabel';

function App() {
    return (
        <div className="App">
            <h1>YOLO Object Detection</h1>
            <CameraPreview />
            <DetectionLabel />
        </div>
    );
}

export default App;