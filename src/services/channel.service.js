import api from "./api";

class ChannelApi{

    addChannel = async (adminId, channelName, details) => {
        
        const response = await api.post("/channel/addChannel", {adminId, channelName, details});
        
        if (response.data) {
            return response.data;
        }
    }

    getChannel = async (adminId) => {
        
        const response = await api.post("/channel/getChannels", {adminId});
        
        if (response.data) {
            return response.data;
        }
    }

    delChannel = async (adminId, channelId, channelType) => {
        
        const response = await api.post("/channel/delChannel", {adminId, channelId, channelType});
        
        if (response.data) {
            return response.data;
        }
    }

}

export default new ChannelApi();