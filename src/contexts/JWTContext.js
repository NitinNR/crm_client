import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// Services
import TokenService from '../services/token.service';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user,isAuthenticated } = action.payload;

    return {
      ...state,
      isAuthenticated,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: false,
      user,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = await TokenService.getLocalAccessToken();

        // console.log( "isValidToken accessToken", isValidToken(accessToken), "Local accessToken", accessToken)
        // console.log("USER", TokenService.getUser())

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          // let statusInfo = {
          //   status: false,
          //   ack : "Dashboard Details",
          //   userInfo : {
          //       id: '',
          //       fullName: '',
          //       role: '',
          //       email: '',
          //       companyName: '',
          //   },
          //   data: {},
          //   };
          const adminId = TokenService.getUser().userInfo.id
          const response = await axios.post('/api/user/UserDetails',{
            adminId,
          });
          // console.log("response.data",response.data.data.userInfo)
          const  user = response.data?.data.userInfo;
          TokenService.setData("userDetails",user)
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/signin', {
      email,
      password,
    });
    const { accessToken} = response.data;
    const user = response.data;
    const AuthenticationStatus = response.data.status
    
    setSession(accessToken);
    // console.log("response.data:",response.data)
    TokenService.setUser(response.data)
    // window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
        isAuthenticated: AuthenticationStatus,
      },
    });
  };

  const register = async (fullName, email, password, companyName, chatbotNumber, website) => {
    const response = await axios.post('/api/auth/signup', {
      fullName,
      email,
      password,
      companyName,
      chatbotNumber,
      website,
      
    });
    
    const user  = response.data;
    // console.log("RES in JWTcontext", user)
    // window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    TokenService.removeUser()
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
