import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';

export const uploadImageToFirebase = async (photo, userId, hiveId) => {
  try {
    // Normalize content:// → file://
    let uri = photo.uri;
    if (uri.startsWith('content://')) {
      const dest = `${RNFS.CachesDirectoryPath}/${Date.now()}_temp.jpg`;
      await RNFS.copyFile(uri, dest);
      uri = 'file://' + dest;
    }

    // 🔥 CREATE UNIQUE FILENAME
    // Use timestamp + random string + original filename (if available)
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const originalName = photo.fileName || 'photo.jpg';
    
    // Build unique filename: timestamp_randomId_originalName
    const uniqueFilename = `${timestamp}_${randomId}_${originalName}`;
    const filename = `hives/${userId}/${hiveId}/${uniqueFilename}`;
    
    console.log('📤 Uploading to Firebase:', filename);
    console.log('📸 From URI:', uri);

    const ref = storage().ref(filename);
    await ref.putFile(uri);

    const downloadURL = await ref.getDownloadURL();
    
    console.log('✅ Upload complete. URL:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('❌ Firebase upload error:', error);
    throw error;
  }
};