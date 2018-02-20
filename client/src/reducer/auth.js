import { auth as authActionType } from '../action/types'
import { loginStatus as loginStatusType, token } from '../constant';
import Cookies from 'js-cookie';

const initialState = {
    loginStatus: loginStatusType.INITIAL
};

const reducer = (state = initialState, action) => {
    let { type } = action;
    switch(type) {
        case authActionType.REQUEST_LOGIN:
            return {
                ...state,
                loginStatus: loginStatusType.LOGIN_WAIT
            }
        case authActionType.LOGIN_FAILED:
            return {
                ...state,
                loginStatus: loginStatusType.LOGIN_FAIL,
                error: action.payload.error
            }
        case authActionType.LOGIN_SUCCESS:
            let date = new Date(Date.now());
            date.setHours(date.getHours() + 2);
            Cookies.set(token.cookieKey, action.payload.token, { expires: date });
            return {
                ...state,
                loginStatus: loginStatusType.LOGIN_SUCCESS
            }
        case authActionType.REQUEST_LOGOUT:
            return {
                ...state,
                logoutStatus: loginStatusType.INITIAL
            }
        default:
            return state;
    }
}

export default reducer;