import { AnyAction } from 'redux';
import { message } from 'antd';

// 自定义 Dva 类型，避免依赖导入问题
type Effect = (action: AnyAction, effects: EffectsCommandMap) => Generator<any, void, any>;
type Subscription = (api: SubscriptionAPI) => void | Function;

interface EffectsCommandMap {
  put: (action: AnyAction) => void;
  call: Function;
  select: Function;
  take: Function;
  cancel: Function;
  [key: string]: any;
}

// 更新 SubscriptionAPI 接口，明确定义 history 类型
interface SubscriptionAPI {
  dispatch: (action: AnyAction) => void;
  history: {
    listen: (callback: (location: any) => void) => () => void;
    location: {
      pathname: string;
    };
    push: (path: string | { pathname: string; query?: any; }) => void;
    replace: (path: string | { pathname: string; query?: any; }) => void;
    goBack: () => void;
    go: (step: number) => void;
  };
}

// 使用 Immer 风格 reducer 的类型定义
type ImmerReducer<S> = (state: S, action: AnyAction) => void;

// 定义全局状态接口
export interface GlobalStateType {
  collapsed: boolean;
  userInfo: {
    id?: number;
    name?: string;
    avatar?: string;
    role?: string;
    permissions?: string[];
    isLogin: boolean;
  };
  notices: NoticeItem[];
  theme: 'light' | 'dark';
  loading: boolean;
}

// 通知项类型
interface NoticeItem {
  id: string;
  title: string;
  content: string;
  type: 'message' | 'notification' | 'event'; 
  status: 'read' | 'unread';
  timestamp: number;
}

// 定义全局模型
export interface GlobalModelType {
  namespace: 'global';
  state: GlobalStateType;
  effects: {
    fetchUserInfo: Effect;
    fetchNotices: Effect;
    logout: Effect;
    updateTheme: Effect;
    readNotice: Effect;
  };
  reducers: {
    saveUserInfo: ImmerReducer<GlobalStateType>;
    saveNotices: ImmerReducer<GlobalStateType>;
    changeLayoutCollapsed: ImmerReducer<GlobalStateType>;
    changeTheme: ImmerReducer<GlobalStateType>;
    setLoading: ImmerReducer<GlobalStateType>;
    markNoticeAsRead: ImmerReducer<GlobalStateType>;
    clearNotices: ImmerReducer<GlobalStateType>;
  };
  subscriptions: { setup: Subscription };
}

// 初始全局状态
const initialState: GlobalStateType = {
  collapsed: false,
  userInfo: {
    isLogin: false,
  },
  notices: [],
  theme: 'light',
  loading: false,
};

// 全局模型
const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: initialState,

  effects: {
    // 获取用户信息
    *fetchUserInfo({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        // 实际项目中应该调用API
        // const response = yield call(getUserInfo);
        const response = {
          id: 1,
          name: '管理员',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
          role: 'admin',
          permissions: ['admin'],
        };
        
        yield put({
          type: 'saveUserInfo',
          payload: { ...response, isLogin: true },
        });
      } catch (error) {
        console.error('获取用户信息失败:', error);
        message.error('获取用户信息失败');
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    // 获取通知列表
    *fetchNotices(_, { call, put }) {
      try {
        // 实际项目中应该调用API
        // const response = yield call(getNotices);
        const response = [
          {
            id: '1',
            title: '系统通知',
            content: '系统将于今晚22:00进行维护升级',
            type: 'notification',
            status: 'unread',
            timestamp: Date.now(),
          },
          {
            id: '2',
            title: '新订单提醒',
            content: '您有3个新订单等待处理',
            type: 'message',
            status: 'unread',
            timestamp: Date.now() - 3600000,
          },
        ];
        
        yield put({
          type: 'saveNotices',
          payload: response,
        });
      } catch (error) {
        console.error('获取通知失败:', error);
      }
    },

    // 退出登录
    *logout(_, { call, put }) {
      try {
        // 实际项目中应该调用API
        // yield call(logout);
        
        // 清除本地存储的token
        localStorage.removeItem('token');
        
        yield put({
          type: 'saveUserInfo',
          payload: { isLogin: false },
        });
        
        // 跳转到登录页
        window.location.href = '/user/login';
      } catch (error) {
        console.error('退出失败:', error);
        message.error('退出失败');
      }
    },

    // 更新主题
    *updateTheme({ payload }, { put }) {
      const { theme } = payload;
      yield put({
        type: 'changeTheme',
        payload: theme,
      });
      
      // 保存主题设置到本地存储
      localStorage.setItem('theme', theme);
    },

    // 标记通知为已读
    *readNotice({ payload }, { put }) {
      yield put({
        type: 'markNoticeAsRead',
        payload,
      });
    },
  },

  reducers: {
    // 保存用户信息
    saveUserInfo(state, { payload }) {
      state.userInfo = {
        ...state.userInfo,
        ...payload,
      };
    },
    
    // 保存通知列表
    saveNotices(state, { payload }) {
      state.notices = payload;
    },
    
    // 更改侧边栏折叠状态
    changeLayoutCollapsed(state, { payload }) {
      state.collapsed = payload;
    },
    
    // 更改主题
    changeTheme(state, { payload }) {
      state.theme = payload;
    },
    
    // 设置加载状态
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    
    // 标记通知为已读
    markNoticeAsRead(state, { payload }) {
      const { id } = payload;
      state.notices = state.notices.map(notice => 
        notice.id === id ? { ...notice, status: 'read' } : notice
      );
    },
    
    // 清空通知
    clearNotices(state) {
      state.notices = [];
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // 使用更安全的方式处理 listen 回调
      return history.listen((location: any) => {
        const { pathname } = location;
        
        // 如果不是登录页，且有token，则获取用户信息
        const token = localStorage.getItem('token');
        if (pathname !== '/user/login' && token) {
          dispatch({ type: 'fetchUserInfo' });
          dispatch({ type: 'fetchNotices' });
        }
        
        // 从本地存储中恢复主题设置
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        if (savedTheme && savedTheme !== initialState.theme) {
          dispatch({
            type: 'changeTheme',
            payload: savedTheme,
          });
        }
      });
    },
  },
};

export default GlobalModel;
