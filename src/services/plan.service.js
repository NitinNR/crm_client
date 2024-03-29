import api from "./api";

class PlanService {

    PlanList = async () => {
        const response = await api.get("/plan/list", {});
        if (response.data) {
            return response.data;
        }
    }

    PlanUpdate = async (admin_id, plan_id) => {
        const response = await api.put("/plan/update", { admin_id, plan_id });
        if (response) {
            return response.data;
        }
    }

    PlanCancel = async (admin_id,plan_id) => {
        const response = await api.delete("/plan/cancel",{ data:{admin_id,plan_id}});
        if (response) {
            return response.data;
        }

    }

    PlanAdmin = async (admin_id) => {
        const response = await api.get("/plan/id", { params:{admin_id }});
        if (response) {
            return response.data;
        }

    }
}
export default new PlanService();