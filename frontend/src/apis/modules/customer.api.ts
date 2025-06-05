import axiosPrivate from "../clients/private.client";
import axiosPublic from "../clients/public.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, ICustomer } from "@/models/interfaces/index";

const customerEndpoints = {
    common: "customer/admin",
    user: "customer"
};

const customerApi = {
    async list(params: {
        page?: number;
        limit?: number;
        filters?: FilterSearch[];
        order?: ESortOrderValue;
    }): Promise<IApiResponse<ICustomer[]>> {
        return axiosPrivate.get(customerEndpoints.common, {
            params: params ? { ...params, filters: params.filters ? JSON.stringify(params.filters) : undefined } : undefined,
        });
    },
    async add(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.post(customerEndpoints.common, data);
        } catch (error) {
            throw error;
        }
    },
    async delete(id: number | string): Promise<IApiResponse> {
        try {
            return await axiosPrivate.delete(customerEndpoints.common + "/" + id);
        } catch (error) {
            throw error;
        }
    },
    async editAdmin(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.put(customerEndpoints.common, data);
        } catch (error) {
            throw error;
        }
    },

    async edit(data: any): Promise<IApiResponse> {
        try {
            return await axiosPublic.put(customerEndpoints.user, data);
        } catch (error) {
            throw error;
        }
    },
    async getById(customer_id: number | string): Promise<IApiResponse<ICustomer>> {
        try {
            return await axiosPublic.get(`${customerEndpoints.user}/${customer_id}`);
        } catch (error) {
            throw error;
        }
    },
};

export default customerApi;
