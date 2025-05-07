import axiosPrivate from "../clients/private.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IImportWarehouse } from "@/models/interfaces";

const importWarehouseEndpoints = {
    common: "kho",
};

const importWarehouseApi = {
    async list(params: {
        page?: number;
        limit?: number;
        filters?: FilterSearch[];
        // sort?: keyof IImportWarehouseType | "";
        order?: ESortOrderValue;
    }): Promise<IApiResponse<IImportWarehouse[]>> {
        return axiosPrivate.get(importWarehouseEndpoints.common, {
            params: { ...params, filters: JSON.stringify(params.filters) },
        });
    },
    async add(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.post(importWarehouseEndpoints.common, data);
        } catch (error) {
            throw error;
        }
    },
    async delete(id: number | string): Promise<IApiResponse> {
        try {
            return await axiosPrivate.delete(importWarehouseEndpoints.common + "/" + id);
        } catch (error) {
            throw error;
        }
    },
    async edit(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.put(importWarehouseEndpoints.common, data);
        } catch (error) {
            throw error;
        }
    },
}

export default importWarehouseApi;