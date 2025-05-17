import axiosPrivate from "../clients/private.client";
import { IApiResponse } from "@/models/interfaces";

const warehouseEndpoints = {
    list: "/warehouse",
    detail: (id: number) => `/warehouse/${id}`,
    create: "/warehouse",
    update: "/warehouse",
    delete: (id: number) => `/warehouse/${id}`,
};

const WarehouseApi = {
    async list(params?: any): Promise<IApiResponse<any[]>> {
        return axiosPrivate.get(warehouseEndpoints.list, {
            params: params ? { ...params, filters: params.filters ? JSON.stringify(params.filters) : undefined } : undefined,
        });
    },
    async detail(id: number): Promise<IApiResponse<any>> {
        return axiosPrivate.get(warehouseEndpoints.detail(id));
    },
    async create(data: { name: string, address: string }): Promise<IApiResponse<any>> {
        return axiosPrivate.post(warehouseEndpoints.create, data);
    },
    async update(data: { id: number, name: string, address: string }): Promise<IApiResponse<any>> {
        return axiosPrivate.put(warehouseEndpoints.update, data);
    },
    async delete(id: number): Promise<IApiResponse<any>> {
        return axiosPrivate.delete(warehouseEndpoints.delete(id));
    },
};

export default WarehouseApi; 