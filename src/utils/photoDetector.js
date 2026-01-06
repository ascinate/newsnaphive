import { Platform, PermissionsAndroid } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

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
      return { hasNewPhotos: false, photoCount: 0, photos: [] };
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

    // Filter today's photos
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayPhotos = photos.edges
      .map(edge => {
        try {
          return {
            uri: edge.node.image.uri,
            timestamp: edge.node.timestamp,
            filename: edge.node.image.filename || 'unknown',
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
          photoDate.setHours(0, 0, 0, 0);
          return photoDate.getTime() === today.getTime();
        } catch (err) {
          console.log('⚠️ Error filtering photo:', err);
          return false;
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp);

    console.log('📸 Today\'s photos:', todayPhotos.length);

    return {
      hasNewPhotos: todayPhotos.length > 0,
      photoCount: todayPhotos.length,
      photos: todayPhotos,
    };

  } catch (error) {
    console.error('❌ Error in checkForNewCameraPhotos:', error);
    return { hasNewPhotos: false, photoCount: 0, photos: [] };
  }
};