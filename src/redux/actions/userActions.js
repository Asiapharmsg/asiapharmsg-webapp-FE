export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const login = (payload) => ({
  type: LOGIN,
  payload: {
    ...payload,
    isAuthenticated: true,
  },
});

export const logout = () => ({ type: LOGOUT });
