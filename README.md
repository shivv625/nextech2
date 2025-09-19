# 🛡️ Rakshak AI Watch

**Advanced Tactical Surveillance & Communication System**

A comprehensive military-grade surveillance and communication platform featuring real-time object detection, live location tracking, and multi-role access control.

## ✨ Features

### 🎯 **Command Center Dashboard**

- **Live Surveillance Feeds**: Real-time camera feeds with AI object detection
- **Google Maps Integration**: Live army personnel location tracking
- **YOLO v8 Object Detection**: Real-time detection of persons, vehicles, drones, and weapons
- **Threat Assessment**: Automated threat level analysis and alerts
- **Tactical Map**: Interactive map with real-time troop positions

### 👥 **Army Personnel Dashboard**

- **SOS Emergency System**: One-click emergency alerts to command center
- **Team Communication**: Real-time chat with other army personnel
- **Location Sharing**: GPS coordinates shared with command center
- **Team Status**: Live status monitoring of all team members
- **Tactical Interface**: Professional military-grade design

### 🗺️ **Real-time Location Tracking**

- **OpenStreetMap Integration**: High-quality open-source mapping
- **AIIMS Bhubaneswar Focus**: Centered on AIIMS Bhubaneswar, Odisha, India
- **Live Updates**: Real-time location tracking every 5 seconds
- **Custom Markers**: Color-coded personnel status indicators
- **Interactive Features**: Click markers for detailed information
- **Status Monitoring**: Battery, signal, and connection status

## 🚀 Quick Start

### 1. **Clone and Install**

```bash
git clone <repository-url>
cd rakshak-ai-watch-main
npm install
```

### 2. **Environment Setup**

```bash
# Run the interactive setup script
npm run setup

# Or manually create .env file
cp .env.example .env
# Edit .env with your settings (OpenStreetMap works without API keys)
```

### 3. **Start Development Server**

```bash
npm run dev
```

### 4. **Access the Application**

- Open `http://localhost:8087`
- Choose between Army Personnel or Command Center login
- Start using the tactical surveillance system

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Google Maps API Key (Required for live location tracking)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Application Configuration
VITE_APP_NAME=Rakshak AI Watch
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_GOOGLE_MAPS=true
VITE_ENABLE_REAL_TIME_TRACKING=true
VITE_ENABLE_OBJECT_DETECTION=true
VITE_ENABLE_NIGHT_VISION=true

# Camera Configuration
VITE_DEFAULT_CAMERA_WIDTH=640
VITE_DEFAULT_CAMERA_HEIGHT=480
VITE_MAX_CAMERAS=4

# Object Detection Configuration
VITE_DETECTION_CONFIDENCE_THRESHOLD=0.5
VITE_DETECTION_UPDATE_INTERVAL=300

# Location Tracking Configuration
VITE_LOCATION_UPDATE_INTERVAL=5000
VITE_LOCATION_ACCURACY_THRESHOLD=10

# Development Settings
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=info
```

### Google Maps Setup

1. **Get API Key**:

   - Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - Create a new project or select existing
   - Enable "Maps JavaScript API"
   - Create credentials (API Key)
   - Restrict the key to your domain for security

2. **Add to .env**:

   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Restart Server**:
   ```bash
   npm run dev
   ```

## 🎮 Usage

### Command Center Access

1. Go to `http://localhost:8087`
2. Click "Command Center Login"
3. Enter credentials (any username/password for demo)
4. Access the admin dashboard with:
   - Live surveillance feeds
   - Real-time army location tracking
   - Object detection alerts
   - Tactical map with troop positions

### Army Personnel Access

1. Go to `http://localhost:8087`
2. Click "Army Personnel Login"
3. Enter credentials (any username/password for demo)
4. Access the tactical dashboard with:
   - SOS emergency alerts
   - Team communication
   - Location sharing
   - Team status monitoring

## 🏗️ Architecture

### Frontend Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **TanStack Query** for state management

### Key Components

- **VideoFeed**: Camera feeds with object detection
- **LiveLocationMap**: Google Maps integration for location tracking
- **AlertSystem**: Real-time threat monitoring
- **TacticalMap**: Interactive tactical situation map
- **ArmyDashboard**: Army personnel communication interface

### Hooks and Services

- **useCamera**: Camera access and management
- **useYoloDetection**: AI object detection
- **useAlerts**: Alert management system
- **useSoldierLocations**: Real-time location tracking

## 🔒 Security Features

- **Role-based Access Control**: Separate interfaces for Army and Command Center
- **Authentication System**: Secure login with session management
- **Location Privacy**: GPS location sharing with consent
- **API Key Protection**: Environment variable configuration
- **HTTPS Ready**: Production-ready security configuration

## 📱 Mobile Responsive

- **Responsive Design**: Works on all device sizes
- **Touch-friendly**: Optimized for mobile devices
- **GPS Integration**: Real-time location tracking on mobile
- **Offline Capable**: Basic functionality without internet

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Environment-specific Builds

```bash
# Development build
npm run build:dev

# Production build
npm run build
```

## 📊 Performance

- **Real-time Updates**: 5-second location updates
- **Object Detection**: 300ms detection intervals
- **Camera Feeds**: Multiple simultaneous camera streams
- **Map Rendering**: Optimized Google Maps integration
- **Memory Management**: Efficient resource usage

## 🛠️ Development

### Project Structure

```
src/
├── components/
│   ├── dashboard/          # Main dashboard components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── pages/                 # Application pages
├── config/                # Configuration files
└── types/                 # TypeScript type definitions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run setup` - Interactive environment setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Check the [Environment Setup Guide](ENVIRONMENT_SETUP.md)
- Review the [Google Maps Setup Guide](GOOGLE_MAPS_SETUP.md)
- Open an issue on GitHub

## 🔮 Roadmap

- [ ] Backend API integration
- [ ] Real-time WebSocket communication
- [ ] Advanced AI models
- [ ] Mobile app development
- [ ] Cloud deployment options
- [ ] Multi-language support

---

**Built with ❤️ for military and security applications**
