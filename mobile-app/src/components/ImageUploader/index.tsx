import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.scss';

interface ImageUploaderProps {
  files: string[];
  onChange: (files: string[]) => void;
  maxCount?: number;
  multiple?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  files = [],
  onChange,
  maxCount = 9,
  multiple = true
}) => {
  const [uploading, setUploading] = useState(false);
  
  // 选择图片
  const handleChooseImage = async () => {
    if (uploading) return;
    
    try {
      setUploading(true);
      
      // 选择图片
      const result = await Taro.chooseImage({
        count: multiple ? Math.min(maxCount - files.length, 9) : 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      });
      
      // 处理选择结果
      const newImages = [...files];
      result.tempFilePaths.forEach(path => {
        if (newImages.length < maxCount) {
          newImages.push(path);
        }
      });
      
      onChange(newImages);
    } catch (error) {
      console.error('选择图片失败:', error);
    } finally {
      setUploading(false);
    }
  };
  
  // 预览图片
  const handlePreviewImage = (current: string) => {
    Taro.previewImage({
      current,
      urls: files
    });
  };
  
  // 删除图片
  const handleRemoveImage = (index: number) => {
    const newImages = [...files];
    newImages.splice(index, 1);
    onChange(newImages);
  };
  
  return (
    <View className="image-uploader">
      <View className="image-list">
        {files.map((file, index) => (
          <View key={index} className="image-item">
            <Image
              src={file}
              className="preview-image"
              mode="aspectFill"
              onClick={() => handlePreviewImage(file)}
            />
            <View 
              className="remove-icon"
              onClick={() => handleRemoveImage(index)}
            >
              <AtIcon value="close" size="14" color="#fff" />
            </View>
          </View>
        ))}
        
        {files.length < maxCount && (
          <View 
            className="upload-button"
            onClick={handleChooseImage}
          >
            <AtIcon value="add" size="24" color="#999" />
          </View>
        )}
      </View>
      
      <View className="hint-text">
        {files.length} / {maxCount}
      </View>
    </View>
  );
};

export default ImageUploader;
