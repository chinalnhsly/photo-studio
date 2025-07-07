import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import classNames from 'classnames';
import './index.scss';

interface RatingTagsProps {
  distribution: Record<string, number>;
  totalCount: number;
  onChange: (value: string) => void;
  value?: string;
}

const RatingTags: React.FC<RatingTagsProps> = ({
  distribution,
  totalCount,
  onChange,
  value = 'all'
}) => {
  // 处理标签点击
  const handleTagClick = (val: string) => {
    onChange(val);
  };

  // 计算百分比
  const calculatePercent = (count: number) => {
    if (totalCount === 0) return 0;
    return Math.round((count / totalCount) * 100);
  };

  return (
    <View className="rating-tags-component">
      {/* 全部评价标签 */}
      <View 
        className={classNames('rating-tag all', { active: value === 'all' })}
        onClick={() => handleTagClick('all')}
      >
        <Text>全部评价 ({totalCount})</Text>
      </View>
      
      {/* 好评标签 */}
      <View 
        className={classNames('rating-tag', { active: value === 'good' })}
        onClick={() => handleTagClick('good')}
      >
        <Text className="tag-text">好评</Text>
        <View className="tag-progress">
          <View 
            className="progress-bar" 
            style={{ width: `${calculatePercent(distribution['good'] || 0)}%` }} 
          />
        </View>
        <Text className="tag-percent">{calculatePercent(distribution['good'] || 0)}%</Text>
      </View>
      
      {/* 中评标签 */}
      <View 
        className={classNames('rating-tag', { active: value === 'neutral' })}
        onClick={() => handleTagClick('neutral')}
      >
        <Text className="tag-text">中评</Text>
        <View className="tag-progress">
          <View 
            className="progress-bar" 
            style={{ width: `${calculatePercent(distribution['neutral'] || 0)}%` }} 
          />
        </View>
        <Text className="tag-percent">{calculatePercent(distribution['neutral'] || 0)}%</Text>
      </View>
      
      {/* 差评标签 */}
      <View 
        className={classNames('rating-tag', { active: value === 'bad' })}
        onClick={() => handleTagClick('bad')}
      >
        <Text className="tag-text">差评</Text>
        <View className="tag-progress">
          <View 
            className="progress-bar" 
            style={{ width: `${calculatePercent(distribution['bad'] || 0)}%` }} 
          />
        </View>
        <Text className="tag-percent">{calculatePercent(distribution['bad'] || 0)}%</Text>
      </View>
      
      {/* 有图标签 */}
      <View 
        className={classNames('rating-tag', { active: value === 'withImages' })}
        onClick={() => handleTagClick('withImages')}
      >
        <Text className="tag-text">有图</Text>
        <View className="tag-progress">
          <View 
            className="progress-bar" 
            style={{ width: `${calculatePercent(distribution['withImages'] || 0)}%` }} 
          />
        </View>
        <Text className="tag-percent">{calculatePercent(distribution['withImages'] || 0)}%</Text>
      </View>
    </View>
  );
};

export default RatingTags;
