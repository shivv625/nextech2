// Environment Configuration for Rakshak AI Watch
// This file manages all environment variables and configuration settings

export const config = {
  // Map Configuration
  map: {
    provider: "openstreetmap", // openstreetmap or googlemaps
    apiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      "your_google_maps_api_key_here",
    enabled: true, // Always enabled for OpenStreetMap
  },

  // Application Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || "Rakshak AI Watch",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
    environment: import.meta.env.VITE_APP_ENVIRONMENT || "development",
  },

  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
    wsUrl: import.meta.env.VITE_WS_URL || "ws://localhost:3001",
  },

  // Security Configuration
  security: {
    jwtSecret: import.meta.env.VITE_JWT_SECRET || "your_jwt_secret_here",
    encryptionKey:
      import.meta.env.VITE_ENCRYPTION_KEY || "your_encryption_key_here",
  },

  // Feature Flags
  features: {
    map: true, // Always enabled for OpenStreetMap
    realTimeTracking:
      import.meta.env.VITE_ENABLE_REAL_TIME_TRACKING !== "false",
    objectDetection: import.meta.env.VITE_ENABLE_OBJECT_DETECTION !== "false",
    nightVision: import.meta.env.VITE_ENABLE_NIGHT_VISION !== "false",
  },

  // Camera Configuration
  camera: {
    defaultWidth: parseInt(import.meta.env.VITE_DEFAULT_CAMERA_WIDTH || "640"),
    defaultHeight: parseInt(
      import.meta.env.VITE_DEFAULT_CAMERA_HEIGHT || "480"
    ),
    maxCameras: parseInt(import.meta.env.VITE_MAX_CAMERAS || "4"),
  },

  // Object Detection Configuration
  detection: {
    confidenceThreshold: parseFloat(
      import.meta.env.VITE_DETECTION_CONFIDENCE_THRESHOLD || "0.5"
    ),
    updateInterval: parseInt(
      import.meta.env.VITE_DETECTION_UPDATE_INTERVAL || "300"
    ),
  },

  // Location Tracking Configuration
  location: {
    updateInterval: parseInt(
      import.meta.env.VITE_LOCATION_UPDATE_INTERVAL || "5000"
    ),
    accuracyThreshold: parseInt(
      import.meta.env.VITE_LOCATION_ACCURACY_THRESHOLD || "10"
    ),
  },

  // Development Configuration
  development: {
    debugMode: import.meta.env.VITE_DEBUG_MODE === "true",
    logLevel: import.meta.env.VITE_LOG_LEVEL || "info",
  },
};

// Helper functions for configuration
export const isMapEnabled = () => {
  return config.map.enabled;
};

export const getMapProvider = () => {
  return config.map.provider;
};

export const isFeatureEnabled = (feature: keyof typeof config.features) => {
  return config.features[feature];
};

export const getApiUrl = (endpoint: string) => {
  return `${config.api.baseUrl}${endpoint}`;
};

export const getWebSocketUrl = () => {
  return config.api.wsUrl;
};

// Environment validation
export const validateEnvironment = () => {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check map configuration
  if (!config.map.enabled) {
    warnings.push("Map functionality is disabled.");
  }

  // Check required environment variables
  if (config.security.jwtSecret === "your_jwt_secret_here") {
    warnings.push("JWT secret not configured. Using default for development.");
  }

  if (config.security.encryptionKey === "your_encryption_key_here") {
    warnings.push(
      "Encryption key not configured. Using default for development."
    );
  }

  return { warnings, errors };
};

// Export default configuration
export default config;
