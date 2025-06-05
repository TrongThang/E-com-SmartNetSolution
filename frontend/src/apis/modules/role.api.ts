import axiosPrivate from "../clients/private.client";
import { IApiResponse } from "@/models/interfaces/index";

const roleEndpoints = {
    list: "/role",
};

const roleApi = {
    async list(params?: any): Promise<IApiResponse<any[]>> {
        return axiosPrivate.get(roleEndpoints.list, {
            params: params ? { ...params, filters: params.filters ? JSON.stringify(params.filters) : undefined } : undefined,
        });
    },
};

export default roleApi; 