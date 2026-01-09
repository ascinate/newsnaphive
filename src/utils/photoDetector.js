import { Platform, PermissionsAndroid } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

// Helper function to get date string in format "YYYY-MM-DD"
const getDateString = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // e.g., "2026-01-09"
};

export const checkForNewCameraPhotos = async () => {
  try {
    // Request permissions
    let hasPermission = false;
    
    if (Platform.OS === 'android') {
      const apiLevel = Platform.Version;
      if (apiLevel >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } else {
      hasPermission = true; // iOS auto-granted
    }

    if (!hasPermission) {
      console.log('❌ No permission for photos');
      return { hasNewPhotos: false, photoCount: 0, photos: [], latestDate: null };
    }

    console.log('✅ Permission granted, fetching photos...');

    // Fetch photos
    const params = {
      first: 5000,
      assetType: 'Photos',
      include: ['filename', 'timestamp'],
    };

    if (Platform.OS === 'ios') {
      params.groupTypes = 'SavedPhotos';
    } else {
      params.groupName = 'Camera';
    }

    const photos = await CameraRoll.getPhotos(params);
    console.log('📸 Total photos fetched:', photos.edges.length);

    // Get dates for last 3 days
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 2); // Today, yesterday, day before
    threeDaysAgo.setHours(0, 0, 0, 0);

    // Filter photos from last 3 days
    const recentPhotos = photos.edges
      .map(edge => {
        try {
          return {
            uri: edge.node.image.uri,
            timestamp: edge.node.timestamp,
            filename: edge.node.image.filename || 'unknown',
            dateString: getDateString(edge.node.timestamp),
          };
        } catch (err) {
          console.log('⚠️ Error mapping photo:', err);
          return null;
        }
      })
      .filter(photo => {
        if (!photo) return false;
        
        try {
          const photoDate = new Date(photo.timestamp * 1000);
          return photoDate >= threeDaysAgo;
        } catch (err) {
          console.log('⚠️ Error filtering photo:', err);
          return false;
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp); // Newest first

    console.log('📸 Recent photos (last 3 days):', recentPhotos.length);

    // Group photos by date
    const photosByDate = {};
    recentPhotos.forEach(photo => {
      if (!photosByDate[photo.dateString]) {
        photosByDate[photo.dateString] = [];
      }
      photosByDate[photo.dateString].push(photo);
    });

    // Get the latest date that has photos
    const latestDate = recentPhotos.length > 0 ? recentPhotos[0].dateString : null;

    console.log('📅 Photos grouped by date:', Object.keys(photosByDate));
    console.log('📅 Latest date with photos:', latestDate);

    return {
      hasNewPhotos: recentPhotos.length > 0,
      photoCount: recentPhotos.length,
      photos: recentPhotos,
      photosByDate: photosByDate,
      latestDate: latestDate,
    };

  } catch (error) {
    console.error('❌ Error in checkForNewCameraPhotos:', error);
    return { 
      hasNewPhotos: false, 
      photoCount: 0, 
      photos: [], 
      photosByDate: {},
      latestDate: null 
    };
  }
};