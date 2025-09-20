import React from 'react';

const DetectionLabel = ({ detections }) => {
    return (
        <div className="detection-labels">
            {detections.map((detection, index) => (
                <div key={index} className="detection-label">
                    <span>{detection.label}</span>: <span>{Math.round(detection.confidence * 100)}%</span>
                </div>
            ))}
        </div>
    );
};

export default DetectionLabel;