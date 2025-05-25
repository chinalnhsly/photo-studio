export const CACHE_KEYS = {
  PRODUCT: {
    DETAIL: (id: number) => `product:${id}:detail`,
    LIST: (page: number) => `product:list:${page}`,
  },
  USER: {
    PROFILE: (id: number) => `user:${id}:profile`,
    TOKEN: (id: number) => `user:${id}:token`,
  },
  MEMBER: {
    POINTS: (id: number) => `member:${id}:points`,
    LEVEL: (id: number) => `member:${id}:level`,
  },
  BOOKING: {
    SLOTS: (date: string) => `booking:slots:${date}`,
  }
};
