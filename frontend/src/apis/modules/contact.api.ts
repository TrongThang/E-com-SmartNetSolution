import axiosPrivate from "../clients/private.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse } from "@/models/interfaces/index";

const contactEndpoints = {
    common: "contact",
};

const contactApi = {
    async list(params: {
        page?: number;
        limit?: number;
        filters?: FilterSearch[];
        order?: ESortOrderValue;
        sort?: string;
    }): Promise<IApiResponse<any[]>> {
        return axiosPrivate.get(contactEndpoints.common, {
            params: { ...params, filters: params.filters ? JSON.stringify(params.filters) : undefined },
        });
    },
    async create(data: any): Promise<IApiResponse<any>> {
        return axiosPrivate.post(contactEndpoints.common, data);
    },
    async edit(data: { id: number, status: number }): Promise<IApiResponse<any>> {
     
        return axiosPrivate.patch(contactEndpoints.common, data);
    },
    async delete(id: number): Promise<IApiResponse<any>> {
        return axiosPrivate.delete(`${contactEndpoints.common}/${id}`);
    },
    async getById(id: number): Promise<IApiResponse<any>> {
        return axiosPrivate.get(`${contactEndpoints.common}/${id}`);
    },
};

export default contactApi;
