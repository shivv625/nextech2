#!/usr/bin/env node

/**
 * Environment Setup Script for Rakshak AI Watch
 * This script helps users set up their environment variables
 */

import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const envTemplate = `# Environment Variables for Rakshak AI Watch
# Generated on ${new Date().toISOString()}

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

# Security (Change in production)
VITE_JWT_SECRET=your_jwt_secret_here
VITE_ENCRYPTION_KEY=your_encryption_key_here

# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
`;

async function setupEnvironment() {
  console.log("🚀 Rakshak AI Watch - Environment Setup");
  console.log("=====================================\n");

  // Check if .env already exists
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const overwrite = await question(
      "⚠️  .env file already exists. Overwrite? (y/N): "
    );
    if (overwrite.toLowerCase() !== "y" && overwrite.toLowerCase() !== "yes") {
      console.log("❌ Setup cancelled.");
      rl.close();
      return;
    }
  }

  console.log("📝 Setting up environment variables...\n");

  // Ask for Google Maps API key
  console.log("🗺️  Google Maps Integration:");
  console.log(
    "   Get your API key from: https://console.cloud.google.com/google/maps-apis"
  );
  console.log("   Enable: Maps JavaScript API\n");

  const googleMapsKey = await question(
    "   Enter your Google Maps API key (or press Enter to skip): "
  );

  // Ask for other configurations
  const appName =
    (await question("   App name (default: Rakshak AI Watch): ")) ||
    "Rakshak AI Watch";
  const environment =
    (await question(
      "   Environment (development/production, default: development): "
    )) || "development";
  const debugMode = await question("   Enable debug mode? (Y/n): ");

  // Generate .env content
  let envContent = envTemplate;

  if (googleMapsKey.trim()) {
    envContent = envContent.replace(
      "your_google_maps_api_key_here",
      googleMapsKey.trim()
    );
  }

  envContent = envContent.replace("Rakshak AI Watch", appName);
  envContent = envContent.replace("development", environment);

  if (debugMode.toLowerCase() === "n" || debugMode.toLowerCase() === "no") {
    envContent = envContent.replace(
      "VITE_DEBUG_MODE=true",
      "VITE_DEBUG_MODE=false"
    );
  }

  // Write .env file
  try {
    fs.writeFileSync(envPath, envContent);
    console.log("\n✅ Environment setup complete!");
    console.log(`📁 .env file created at: ${envPath}`);

    if (!googleMapsKey.trim()) {
      console.log("\n⚠️  Note: Google Maps API key not provided.");
      console.log(
        "   The app will show setup instructions for Google Maps integration."
      );
    }

    console.log("\n🔄 Next steps:");
    console.log("   1. Restart your development server: npm run dev");
    console.log("   2. Open http://localhost:8087 in your browser");
    console.log("   3. Configure additional settings in .env if needed");
  } catch (error) {
    console.error("❌ Error creating .env file:", error.message);
  }

  rl.close();
}

// Run setup
setupEnvironment().catch(console.error);
