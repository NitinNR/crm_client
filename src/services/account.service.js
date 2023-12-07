import api from "./api";

class AccountService {


    ChangePassword = async (adminId, oldPassword, newPassword) => {
        const response = await api
            .post("/auth/change-password", {
                 adminId, oldPassword, newPassword
            });
        // console.log("response",response)
        if (response.data) {
            return response.data;
        }
    }

}

export default new AccountService();