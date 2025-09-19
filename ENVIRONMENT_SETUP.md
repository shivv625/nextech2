# Environment Setup Guide

This guide explains how to configure environment variables for the Rakshak AI Watch application.

## Quick Setup

1. **Create Environment File**:

   ```bash
   # Create a .env file in the project root
   touch .env
   ```

2. **Add Required Variables**:
   Copy the following content to your `.env` file:

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

   # Development Settings
   VITE_DEBUG_MODE=true
   VITE_LOG_LEVEL=info
   ```

3. **Restart Development Server**:
   ```bash
   npm run dev
   ```

## Detailed Configuration

### Google Maps Integration

**Required for live location tracking**

1. **Get Google Maps API Key**:

   - Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - Create a new project or select existing
   - Enable "Maps JavaScript API"
   - Create credentials (API Key)
   - Restrict the key to your domain for security

2. **Add to .env**:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Feature Flags

Control which features are enabled:

```env
# Enable/disable Google Maps
VITE_ENABLE_GOOGLE_MAPS=true

# Enable/disable real-time location tracking
VITE_ENABLE_REAL_TIME_TRACKING=true

# Enable/disable object detection
VITE_ENABLE_OBJECT_DETECTION=true

# Enable/disable night vision
VITE_ENABLE_NIGHT_VISION=true
```

### Camera Configuration

Adjust camera settings:

```env
# Default camera resolution
VITE_DEFAULT_CAMERA_WIDTH=640
VITE_DEFAULT_CAMERA_HEIGHT=480

# Maximum number of cameras
VITE_MAX_CAMERAS=4
```

### Object Detection Settings

Configure AI detection parameters:

```env
# Detection confidence threshold (0.0 - 1.0)
VITE_DETECTION_CONFIDENCE_THRESHOLD=0.5

# Update interval in milliseconds
VITE_DETECTION_UPDATE_INTERVAL=300
```

### Location Tracking Settings

Configure location tracking:

```env
# Location update interval in milliseconds
VITE_LOCATION_UPDATE_INTERVAL=5000

# Location accuracy threshold in meters
VITE_LOCATION_ACCURACY_THRESHOLD=10
```

### Security Configuration

For production deployment:

```env
# JWT Secret for authentication
VITE_JWT_SECRET=your_secure_jwt_secret_here

# Encryption key for sensitive data
VITE_ENCRYPTION_KEY=your_secure_encryption_key_here
```

### API Configuration

For backend integration:

```env
# API base URL
VITE_API_BASE_URL=http://localhost:3001/api

# WebSocket URL for real-time communication
VITE_WS_URL=ws://localhost:3001
```

## Environment Files

### Development (.env)

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_APP_ENVIRONMENT=development
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### Production (.env.production)

```env
VITE_GOOGLE_MAPS_API_KEY=your_production_google_maps_api_key
VITE_APP_ENVIRONMENT=production
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error
```

## Configuration Management

The application uses a centralized configuration system in `src/config/environment.ts`:

```typescript
import { config, isGoogleMapsEnabled } from "@/config/environment";

// Check if Google Maps is enabled
if (isGoogleMapsEnabled()) {
  // Initialize Google Maps
}

// Get configuration values
const apiUrl = config.api.baseUrl;
const updateInterval = config.location.updateInterval;
```

## Validation

The application automatically validates environment variables on startup:

- **Warnings**: Non-critical issues (e.g., missing API keys)
- **Errors**: Critical issues that prevent the app from running

Check the browser console for validation messages.

## Security Best Practices

1. **Never commit .env files** to version control
2. **Use different API keys** for development and production
3. **Restrict API keys** to specific domains
4. **Rotate secrets** regularly
5. **Use environment-specific** configuration files

## Troubleshooting

### Google Maps Not Loading

- Check if `VITE_GOOGLE_MAPS_API_KEY` is set correctly
- Verify the API key has proper permissions
- Check browser console for error messages

### Features Not Working

- Verify feature flags are set to `true`
- Check if required API keys are configured
- Review browser console for errors

### Environment Variables Not Loading

- Ensure `.env` file is in the project root
- Restart the development server after changes
- Check variable names start with `VITE_`

## Example .env File

```env
# ===========================================
# Rakshak AI Watch - Environment Configuration
# ===========================================

# Google Maps API Key (Required)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Application Settings
VITE_APP_NAME=Rakshak AI Watch
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_GOOGLE_MAPS=true
VITE_ENABLE_REAL_TIME_TRACKING=true
VITE_ENABLE_OBJECT_DETECTION=true
VITE_ENABLE_NIGHT_VISION=true

# Camera Settings
VITE_DEFAULT_CAMERA_WIDTH=640
VITE_DEFAULT_CAMERA_HEIGHT=480
VITE_MAX_CAMERAS=4

# Detection Settings
VITE_DETECTION_CONFIDENCE_THRESHOLD=0.5
VITE_DETECTION_UPDATE_INTERVAL=300

# Location Settings
VITE_LOCATION_UPDATE_INTERVAL=5000
VITE_LOCATION_ACCURACY_THRESHOLD=10

# Development Settings
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=info

# Security (Change in production)
VITE_JWT_SECRET=your_jwt_secret_here
VITE_ENCRYPTION_KEY=your_encryption_key_here

# API Settings
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
```

---

**Note**: Remember to restart the development server after making changes to environment variables.
