import { decode as atob, encode as btoa } from 'base-64';
import { ImageEditor } from '@react-native-community/image-editor';
import ImageResizer from 'react-native-image-resizer';

export default compressImage = async (uri, quality = 80, maxFileSizeKB = 300) => {
  let currentQuality = quality;
  let resizedUri = uri;

  while (currentQuality > 10) {
    const resizedImage = await ImageResizer.createResizedImage(
      resizedUri,
      800, // width (bạn có thể tính toán lại nếu cần)
      800, // height
      'JPEG',
      currentQuality
    );

    const fileInfo = await fetch(resizedImage.uri);
    const blob = await fileInfo.blob();

    if (blob.size / 1024 <= maxFileSizeKB) {
      return resizedImage.uri;
    }

    // Lặp: giảm chất lượng ảnh nếu kích thước vẫn quá lớn
    resizedUri = resizedImage.uri;
    currentQuality -= 10;
  }

  return resizedUri;
};
