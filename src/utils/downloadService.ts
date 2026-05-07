import RNFS from 'react-native-fs';
import { RootState } from '../stores';
import { useSelector } from 'react-redux';


export const downloadSong = async (item: any) => {
  const {serverUrl,token} = useSelector((state:RootState) => state.auth);
  const downloadUrl = `${serverUrl}/Items/${item.Id}/Download?api_key=${token}`;

  const filePath = `${RNFS.DocumentDirectoryPath}/${item.Id}.mp3`;

  const result = await RNFS.downloadFile({
    fromUrl: downloadUrl,
    toFile: filePath,
  }).promise;

  if (result.statusCode === 200) {
    return filePath;
  } else {
    throw new Error('Download failed');
  }
};
