import axiosPrivate from "../clients/private.client";
import { IApiResponse } from "@/models/interfaces";

const warrantyTimeEndpoints = {
    list: "/warrenty-time",
    detail: (id: number) => `/warrenty-time/${id}`,
    create: "/warrenty-time",
    update: "/warrenty-time",
    delete: (id: number) => `/warrenty-time/${id}`,
};

const WarrantyTimeApi = {
    async list(params?: any): Promise<IApiResponse<any[]>> {
        return axiosPrivate.get(warrantyTimeEndpoints.list, {
            params: params ? { ...params, filters: params.filters ? JSON.stringify(params.filters) : undefined } : undefined,
        });
    },
    async detail(id: number): Promise<IApiResponse<any>> {
        return axiosPrivate.get(warrantyTimeEndpoints.detail(id));
    },
    async create(data: { name: string, time: number }): Promise<IApiResponse<any>> {
        return axiosPrivate.post(warrantyTimeEndpoints.create, data);
    },
    async update(data: { id: number, name: string, time: number }): Promise<IApiResponse<any>> {
        return axiosPrivate.put(warrantyTimeEndpoints.update, data);
    },
    async delete(id: number): Promise<IApiResponse<any>> {
        return axiosPrivate.delete(warrantyTimeEndpoints.delete(id));
    },
};

export default WarrantyTimeApi; 