# YOLO Object Detection App - Frontend

This project is a frontend application that integrates with a YOLO-based object detection backend. It provides a live camera feed and displays detected objects in real-time.

## Project Structure

- **src/**: Contains the source code for the frontend application.
  - **components/**: Contains React components for the application.
    - **CameraPreview.jsx**: Displays the live camera feed and connects to the backend for object detection.
    - **DetectionLabel.jsx**: Displays labels for detected objects on the screen.
  - **App.jsx**: Main component that integrates the CameraPreview and DetectionLabel components.
  - **index.js**: Entry point for the React application.

## Setup Instructions

1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd yolo-object-detection-app/frontend
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed. Then run:
   ```
   npm install
   ```

3. **Run the Application**
   Start the development server:
   ```
   npm start
   ```

4. **Access the Application**
   Open your web browser and go to `http://localhost:3000` to view the application.

## Usage

- The application will display a live feed from the cameras.
- Detected objects will be labeled in real-time, identifying categories such as person, weapon, drone, and vehicle.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License.