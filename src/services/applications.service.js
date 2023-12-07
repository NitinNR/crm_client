import api from './api';

class ApplicationService {
  AddApp = async (adminId, AppName, configs, Name) => {
    const response = await api.post('/user/add-app', {
      adminId,
      AppName,
      configs,
      Name,
    });
    // console.log("response",response)
    if (response.data) {
      return response.data;
    }
  };

  AppList = async (adminId) => {
    const response = await api.post('/user/app-list', {
      adminId,
    });
    // console.log("response",response)
    if (response.data) {
      return response.data;
    }
  };
}

export default new ApplicationService();
