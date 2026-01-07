import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';

export const uploadImageToFirebase = async (photo, userId, hiveId) => {
  // Normalize content:// → file://
  let uri = photo.uri;
  if (uri.startsWith('content://')) {
    const dest = `${RNFS.CachesDirectoryPath}/${Date.now()}.jpg`;
    await RNFS.copyFile(uri, dest);
    uri = 'file://' + dest;
  }

  const filename = `hives/${userId}/${hiveId}/${Date.now()}.jpg`;
  const ref = storage().ref(filename);

  await ref.putFile(uri);

  return await ref.getDownloadURL();
};
