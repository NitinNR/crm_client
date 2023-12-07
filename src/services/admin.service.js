import api from "./api";

class AdminService {


    AdminUpdate = async (adminData) => {
        const response = await api
            .post("/user/account/update", {
                adminData,
            });
        // console.log("response",response)
        if (response.data) {
            return response.data;
        }
    }


    //   logout() {
    //     TokenService.removeUser();
    //   }
    //   register(username, email, password) {
    //     return api.post("/auth/signup", {
    //       username,
    //       email,
    //       password
    //     });
    //   }
    //   getCurrentUser() {
    //     return TokenService.getUser();
    //   }
}

export default new AdminService();