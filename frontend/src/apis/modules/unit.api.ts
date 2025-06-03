import axiosPrivate from "../clients/private.client";
import { IApiResponse } from "@/models/interfaces/index";

const unitEndpoints = {
    list: "/unit",
    detail: (id: number) => `/unit/${id}`,
    create: "/unit",
    update: "/unit",
    delete: (id: number) => `/unit/${id}`,
};

const UnitApi = {
    async list(params?: any): Promise<IApiResponse<any[]>> {
        // params: { page, limit, filters, sort, order }
        return axiosPrivate.get(unitEndpoints.list, {
            params: params ? { ...params, filters: params.filters ? JSON.stringify(params.filters) : undefined } : undefined,
        });
    },
    async detail(id: number): Promise<IApiResponse<any>> {
        return axiosPrivate.get(unitEndpoints.detail(id));
    },
    async create(data: { name: string }): Promise<IApiResponse<any>> {
        return axiosPrivate.post(unitEndpoints.create, data);
    },
    async update(data: { id: number, name: string }): Promise<IApiResponse<any>> {
        return axiosPrivate.put(unitEndpoints.update, data);
    },
    async delete(id: number): Promise<IApiResponse<any>> {
        return axiosPrivate.delete(unitEndpoints.delete(id));
    },
};

export default UnitApi;
