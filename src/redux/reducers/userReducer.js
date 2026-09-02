import { LOGIN, LOGOUT } from "../actions/userActions";

const initState = {
  username: "",
  token: "",
  isAdmin: false,
  accountType: "",
  userId: null,
  supplierId: null,
  isAuthenticated: false,
};

const userReducer = (state = initState, action) => {
  const userData = action.payload;

  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        username: userData.username,
        token: userData.token,
        isAdmin: userData.isAdmin,
        accountType: userData.accountType,
        userId: userData.accountType === "clinic" ? userData.userId : null,
        supplierId:
          userData.accountType === "vendor" ? userData.userId : null,
        isAuthenticated: userData.isAuthenticated,
      };
    case LOGOUT:
      localStorage.clear();
      return initState;
    default:
      return state;
  }
};

export default userReducer;
