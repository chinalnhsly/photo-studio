export const MEMBER_CONSTANTS = {
  DEFAULT_POINTS: 0,
  MIN_LEVEL_ID: 1,
  DEFAULT_STATUS: 'active',
  POINTS_EXPIRE_DAYS: 365,  // 积分有效期（天）
  MIN_POINTS_PER_TRANSACTION: 1,
  MAX_POINTS_PER_TRANSACTION: 100000,
};

export const POINT_OPERATION_TYPES = {
  ADD: 'add',
  DEDUCT: 'deduct',
  EXPIRE: 'expire',
  ADJUST: 'adjust'
};
