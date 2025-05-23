import axiosPrivate from "../clients/private.client";
import axiosPublic from "../clients/public.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse } from "@/models/interfaces";
import { IBlog } from "@/models/interfaces/index";

const blogEndpoints = {
    public: "blog",
};

const blogApi = {
    async list(params: {
        page?: number;
        limit?: number;
        filters?: FilterSearch[];
        order?: ESortOrderValue;
        sort?: keyof IBlog | "";
    }): Promise<IApiResponse<IBlog[]>> {
        return axiosPublic.get(blogEndpoints.public, {
            params: {
                ...params,
                filters: params.filters ? JSON.stringify(params.filters) : undefined,
            },
        });
    },

    async getById(id: number | string): Promise<IApiResponse<IBlog>> {
        return axiosPublic.get(`${blogEndpoints.public}/${id}`);
    },

    async add(data: any): Promise<IApiResponse> {
        return axiosPrivate.post(blogEndpoints.public, data);
    },

    async edit(data: any): Promise<IApiResponse> {
        return axiosPrivate.put(blogEndpoints.public, data);
    },

    async delete(id: number | string): Promise<IApiResponse> {
        return axiosPrivate.delete(`${blogEndpoints.public}/${id}`);
    },
};

export default blogApi;
