import axiosPrivate from "../clients/private.client";
import axiosPublic from "../clients/public.client";
import { IApiResponse, IOrder } from "@/models/interfaces";

const orderEndpoints = {
    user: "order/customer"
};

const orderApi = {
    async canceled(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.put(orderEndpoints.user, data);
        } catch (error) {
            throw error;
        }
    },

    async getById(customer_id: number | string): Promise<IApiResponse<IOrder>> {
        try {
            return await axiosPublic.get(`${orderEndpoints.user}/${customer_id}`);
        } catch (error) {
            throw error;
        }
    },
};

export default orderApi;
