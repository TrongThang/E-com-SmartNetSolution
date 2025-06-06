import { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropper = ({ image, onCropComplete, aspectRatio = 16 / 9 }) => {
    const [crop, setCrop] = useState();
    const [imgSrc, setImgSrc] = useState(image);
    const [completedCrop, setCompletedCrop] = useState(null);
    const [imgRef, setImgRef] = useState(null);

    function onImageLoad(e) {
        setImgRef(e.currentTarget);
        setCrop(undefined);
    }

    const getCroppedImg = (src, crop) => {
        if (!imgRef) return;

        const image = new Image();
        image.src = src;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        return new Promise((resolve) => {
            image.onload = () => {
                // Tính toán tỷ lệ giữa kích thước hiển thị và kích thước thực của ảnh
                const scaleX = image.naturalWidth / imgRef.width;
                const scaleY = image.naturalHeight / imgRef.height;

                // Tính toán vị trí và kích thước thực tế của vùng cắt
                const cropX = crop.x * scaleX;
                const cropY = crop.y * scaleY;
                const cropWidth = crop.width * scaleX;
                const cropHeight = crop.height * scaleY;

                // Thiết lập kích thước canvas bằng với kích thước vùng cắt
                canvas.width = cropWidth;
                canvas.height = cropHeight;

                // Vẽ phần ảnh đã cắt vào canvas
                ctx.drawImage(
                    image,
                    cropX,
                    cropY,
                    cropWidth,
                    cropHeight,
                    0,
                    0,
                    cropWidth,
                    cropHeight
                );

                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
        });
    };

    const handleCropChange = (c) => {
        setCrop(c);
    };

    const handleCropComplete = (c) => {
        setCompletedCrop(c);
    };

    const handleSaveCrop = async () => {
        if (completedCrop?.width && completedCrop?.height) {
            const croppedImage = await getCroppedImg(imgSrc, completedCrop);
            onCropComplete(croppedImage);
        }
    };

    return (
        <div className="image-cropper bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Cắt ảnh</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p>Kéo và điều chỉnh khung để cắt ảnh theo tỷ lệ {aspectRatio === 16 / 9 ? '16:9' : aspectRatio === 16/5 ? '16:5' : '5:5'}</p>
                </div>
            </div>

            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-6">
                <ReactCrop
                    crop={crop}
                    onChange={handleCropChange}
                    onComplete={handleCropComplete}
                    aspect={aspectRatio}
                    className="max-h-[500px]"
                >
                    <img
                        ref={setImgRef}
                        src={imgSrc}
                        onLoad={onImageLoad}
                        alt="Crop me"
                        className="max-w-full"
                    />
                </ReactCrop>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    onClick={() => onCropComplete(null)}
                >
                    Hủy
                </button>
                <button
                    type="button"
                    className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSaveCrop}
                    disabled={!completedCrop?.width || !completedCrop?.height}
                >
                    Lưu ảnh đã cắt
                </button>
            </div>
        </div>
    );
};

export default ImageCropper; 