import api from "./api";

class UserService {

    DashboardDetails = async (adminId) => {
        const response = await api.get("/user/dashboard_data", { params: { adminId } });
        // console.log("response.data",response)
        if (response.data) return response.data;
        return [];
    };

    UserList = async (adminId, page, rowsPerPage, filterData, selectedTags) => {
        const response = await api
            .post("/user/list", {
                adminId,
                page,
                rowsPerPage,
                filterData,
                selectedTags
            });
        if (response.data) {
            return response.data;
        }
    }

    ImportContacts = async (formData) => {
        // console.log("FILEE=---", formData);
        const response = await api.post("/user/contact-import", formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=MyBoundary`, // Set the correct Content-Type header
                'Accept': 'application/json',
            },
            //   params: {
            //     adminId, // Pass adminId and fileType as query parameters if needed
            //     fileType,
            //   },
        });

        if (response) {
            return response;
        }
    };


    UserDelete = async (userId, adminId) => {
        const response = await api
            .post("/user/delete", {
                userId,
                adminId
            });
        // console.log("response",response)
        if (response.data) {
            return response.data;
        }
    }

    UserUpdate = async (userId, adminId, fullName, displayName, email, whatsappNumber, privateNote, capturedData, avatarUrl) => {
        const response = await api
            .post("/user/update", {
                userId, adminId, fullName, displayName, email, whatsappNumber, privateNote, capturedData, avatarUrl,
            });
        // console.log("response",response)
        if (response.data) {
            return response.data;
        }
    }

    UserCreate = async (adminId, fullName, displayName, email, whatsappNumber, privateNote, avatarUrl) => {
        const response = await api.post("/user/create", {adminId, fullName, displayName, email, whatsappNumber, privateNote, avatarUrl});
        console.log(response.data);
        if (response.data) {
            return response.data;
        }
        // console.log(response.json());
        return response.response;
    }


    // --- Labels Service ----

    UserLabelList = async (adminId) => {
        const response = await api
            .post("/user/label-list", {
                adminId
            });
        // console.log("response",response)
        if (response.data) {
            return response.data;
        }
    }

    getTagBasedUsers = async (adminId, pageSize, page, tags) => {
        const response = await api
            .post("/user/tag_based_list", {
                // adminId, tags, page, pageSize
                adminId, pageSize, page, tags
            });
        // console.log("response",response)
        if (response.data) {
            return response.data;
        }
    }

    // All labels of a admin with tagged user
    UserLabel = async (adminId) => {
        const response = await api
            .post("/user/labels", {
                adminId
            });
        // console.log("response",response)
        if (response.data) {
            return response.data;
        }
    }

    editUserLabelUpdate = async (labelData) => {
        console.log("UUUUUUUUUUUU")
        const response = await api.post("/user/userLabel-update", {labelData});
        if (response.data) {
            return response.data;
        }
    }

    UserLabelUpdate = async (labelData) => {
        const response = await api
            .post("/user/label-update", {
                labelData
            });
        // console.log("response",response)
        if (response.data) {
            return response.data;
        }
    }

    // --- END Labels Service ----

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

export default new UserService();