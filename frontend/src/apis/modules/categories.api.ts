import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, ICategories } from "@/models/interfaces";
import axiosPrivate from "../clients/private.client";
import axiosPublic from "../clients/public.client";

const categoryEndpoints = {
    list: "/categories",
};

const categoryApi = {
    async list(params: {
        page?: number;
        limit?: number;
        filters?: FilterSearch[];
        sort?: keyof ICategories | "";
        order?: ESortOrderValue;
    }): Promise<IApiResponse<ICategories[]>> {
        return axiosPublic.get(categoryEndpoints.list, {
            params: params ? { ...params, filters: params.filters ? JSON.stringify(params.filters) : undefined } : undefined,
        });
    },
    async getById(id: number): Promise<IApiResponse<ICategories>> {
        return axiosPublic.get(`${categoryEndpoints.list}/${id}`);
    },
    async add(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.post(categoryEndpoints.list, data);
        } catch (error) {
            throw error;
        }
    },
    async edit(id: number, data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.put(`${categoryEndpoints.list}/${id}`, data);
        } catch (error) {
            throw error;
        }
    },
    async delete(id: number): Promise<IApiResponse> {
        try {
            return await axiosPrivate.patch(`${categoryEndpoints.list}/${id}/softDelete`);
        } catch (error) {
            throw error;
        }
    },
    async restore(id: number): Promise<IApiResponse> {
        try {
            return await axiosPrivate.patch(`${categoryEndpoints.list}/${id}/restore`);
        } catch (error) {
            throw error;
        }
    },
};
export default categoryApi; 