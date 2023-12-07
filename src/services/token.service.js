class TokenService {

    getLocalRefreshToken = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.refreshToken;
    }

    getLocalAccessToken = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.accessToken;
    }

    updateLocalAccessToken = (token) => {
      const user = JSON.parse(localStorage.getItem("user"));
      user.accessToken = token;
      localStorage.setItem("user", JSON.stringify(user));
    }

    getUser = () =>{
      const user =  JSON.parse(localStorage.getItem("user"));
      return user;
    }
    
    setUser = (user) => {
    //   console.log(JSON.stringify(user));
      localStorage.setItem("user", JSON.stringify(user));
    }

    removeUser = () =>{
      localStorage.removeItem("user");
    }

    getData = (key) =>{
      const user =  JSON.parse(localStorage.getItem(key));
      return user;
    }
    
    setData = (key,value) => {
    //   console.log(JSON.stringify(user));
      localStorage.setItem(key, JSON.stringify(value));
    }

    removeData = (key) =>{
      localStorage.removeItem(key);
    }

    getUserID = ()=>{

      const user =  JSON.parse(localStorage.getItem("user"));
      return user.userInfo.id
    }
  }

  export default new TokenService();