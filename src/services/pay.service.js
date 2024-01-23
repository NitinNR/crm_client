import api from "./api";

class PayService {

    Payment = async (admin_id, plan_id) => {
        const response = await api.post("/pay/stripe_pay", { admin_id, plan_id });
        if (response.data) {
            return response.data;
        }
        return response

    }
}
export default new PayService();