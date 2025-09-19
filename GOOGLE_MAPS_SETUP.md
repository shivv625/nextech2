# Google Maps Integration Setup

This application now includes real-time army personnel location tracking using Google Maps. Follow these steps to enable the feature:

## 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for enhanced features)
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

## 2. Configure Environment Variables

1. Create a `.env` file in the project root directory
2. Add your Google Maps API key:

```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## 3. Restart Development Server

After adding the API key, restart the development server:

```bash
npm run dev
```

## 4. Features Available

### Command Center Dashboard

- **Real-time Army Tracking**: Live location updates of all army personnel
- **Interactive Google Maps**: Satellite view with custom markers
- **Status Monitoring**: Online, SOS, Mission, and Offline status tracking
- **Personnel Details**: Battery level, signal strength, last update time
- **Clickable Markers**: Click on markers to see detailed information

### Army Personnel Dashboard

- **Location Sharing**: One-click location sharing with command center
- **Real-time Updates**: Automatic location updates every 5 seconds
- **SOS Alerts**: Emergency alerts sent to command center
- **Team Communication**: Chat with other army personnel

## 5. Map Features

### Custom Markers

- 🛡️ **Green Circle**: Online personnel
- 🚨 **Red Circle (Pulsing)**: SOS emergency
- 🎯 **Blue Circle**: On mission
- ⚫ **Gray Circle**: Offline

### Interactive Elements

- **Click Markers**: View detailed personnel information
- **Real-time Updates**: Locations update automatically
- **Status Summary**: Quick overview of all personnel status
- **Refresh Button**: Manual location refresh

## 6. Security Notes

- Always restrict your API key to specific domains
- Monitor API usage in Google Cloud Console
- Consider implementing rate limiting for production use
- Use HTTPS in production environments

## 7. Troubleshooting

### Map Not Loading

- Check if API key is correctly set in `.env` file
- Verify API key has proper permissions
- Check browser console for error messages
- Ensure Maps JavaScript API is enabled

### Location Not Updating

- Check if location sharing is enabled in browser
- Verify GPS permissions are granted
- Check network connectivity

## 8. Production Deployment

For production deployment:

1. Set up proper environment variables on your hosting platform
2. Configure domain restrictions for your API key
3. Monitor API usage and costs
4. Implement proper error handling and fallbacks

## 9. Mock Data

If no API key is provided, the application will show:

- Setup instructions for Google Maps integration
- Mock data for demonstration purposes
- All features work except the actual map display

---

**Note**: This integration provides real-time location tracking capabilities for military and security applications. Ensure compliance with all applicable laws and regulations regarding location tracking and data privacy.
