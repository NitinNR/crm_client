import api from "./api"

class WhatsAppApi {

    WhatsAppTemplateByChannel = async (adminID, channelID) => {
        const response = await api.get("/whatsapp/gettemplates", {params:{channelID,adminID}});
        console.log(response);
        if (response.status === 200) return response.data.templates;
        return [];
    }

}

export default new WhatsAppApi();