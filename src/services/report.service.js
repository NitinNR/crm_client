import api from "./api";

class ReportService {

    MessageReport = async (adminId, page, pageSize, filters, sortField, sortOrder) => {
        const response = await api
            .post("/report/message-list", {
                adminId, page, pageSize, filters, sortField, sortOrder
            });
        // console.log("response.data", response)
        if (response.data) {
            return response.data;
        }
    }
}
export default new ReportService();