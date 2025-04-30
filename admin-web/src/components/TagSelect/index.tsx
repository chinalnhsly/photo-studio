import React, { useState, useRef, useEffect } from 'react';
import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import './index.less';

export interface TagSelectProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  suggestions?: string[];
  options?: string[]; // options 是 suggestions 的别名
  maxTagsShown?: number; // maxTagsShown 是 maxTags 的别名
  colorMap?: Record<string, string>; // 添加颜色映射支持
  disabled?: boolean; // 添加禁用状态支持
}

const TagSelect: React.FC<TagSelectProps> = ({
  value = [],
  onChange,
  maxTags = 20,
  maxTagsShown, // 新增属性
  placeholder = '添加标签',
  suggestions = [],
  options = [], // 新增属性
  colorMap = {}, // 新增属性
  disabled = false, // 新增属性
}) => {
  const allSuggestions = [...suggestions, ...options].filter((v, i, a) => a.indexOf(v) === i);
  const effectiveMaxTags = maxTagsShown !== undefined ? maxTagsShown : maxTags;

  const [tags, setTags] = useState<string[]>(value);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [editInputIndex, setEditInputIndex] = useState<number>(-1);
  const [editInputValue, setEditInputValue] = useState<string>('');

  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    if (editInputIndex !== -1) {
      editInputRef.current?.focus();
    }
  }, [editInputIndex]);

  useEffect(() => {
    if (value !== tags) {
      setTags(value);
    }
  }, [value]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
    onChange?.(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue) && tags.length < effectiveMaxTags) {
      const newTags = [...tags, inputValue];
      setTags(newTags);
      onChange?.(newTags);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    onChange?.(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  const getTagColor = (tag: string) => {
    return colorMap[tag] || undefined;
  };

  return (
    <div className={`tag-select ${disabled ? 'disabled' : ''}`}>
      {tags.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size="small"
              className="tag-input"
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
              disabled={disabled}
            />
          );
        }

        const isLongTag = tag.length > 20;

        const tagElem = (
          <Tag
            className="tag"
            key={tag}
            closable={!disabled}
            color={getTagColor(tag)}
            onClose={() => handleClose(tag)}
            onClick={() => {
              if (!disabled) {
                setEditInputIndex(index);
                setEditInputValue(tag);
              }
            }}
          >
            <span>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          className="tag-input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
          disabled={disabled}
        />
      ) : (
        tags.length < effectiveMaxTags && !disabled && (
          <Tag className="tag-plus" onClick={showInput}>
            <PlusOutlined /> {placeholder}
          </Tag>
        )
      )}

      {allSuggestions.length > 0 && inputVisible && !disabled && (
        <div className="tag-suggestions">
          {allSuggestions
            .filter(item => !tags.includes(item) && item.includes(inputValue))
            .slice(0, 6)
            .map(suggestion => (
              <Tag
                key={suggestion}
                className="suggestion-tag"
                color={getTagColor(suggestion)}
                onClick={() => {
                  setInputValue(suggestion);
                  handleInputConfirm();
                }}
              >
                {suggestion}
              </Tag>
            ))}
        </div>
      )}
    </div>
  );
};

export default TagSelect;
