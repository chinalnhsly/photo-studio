const INITIAL_STATE = {
  userInfo: null,
  isLoggedIn: false
};

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        userInfo: action.payload,
        isLoggedIn: true
      };
    case 'LOGOUT':
      return {
        ...state,
        userInfo: null,
        isLoggedIn: false
      };
    default:
      return state;
  }
}
