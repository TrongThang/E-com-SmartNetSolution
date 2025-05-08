import axiosPrivate from "../clients/private.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IProduct, IProductDetail } from "@/models/interfaces";
import axiosPublic from "../clients/public.client";

const cartEndpoints = {
    common: "product/admin",
};


const cartApi = {
    async list(params: {
        page?: number;
        limit?: number;
        filters?: FilterSearch[];
        order?: ESortOrderValue;
    }): Promise<IApiResponse<IProduct[]>> {
        return axiosPrivate.get(cartEndpoints.common, {
            params: { ...params, filters: JSON.stringify(params.filters) },
        });
    },
    async add(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.post(cartEndpoints.common, data);
        } catch (error) {
            throw error;
        }
    },
    async delete(id: number | string): Promise<IApiResponse> {
        try {
            return await axiosPrivate.delete(cartEndpoints.common + "/" + id);
        } catch (error) {
            throw error;
        }
    },
    async edit(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.put(cartEndpoints.common, data);
        } catch (error) {
            throw error;
        }
    },
    async getById(customer_id: number | string): Promise<IApiResponse<IProductDetail>> {
        try {
            return await axiosPublic.get(`${cartEndpoints.common}/${customer_id}`);
        } catch (error) {
            throw error;
        }
    },
};

export default cartApi;