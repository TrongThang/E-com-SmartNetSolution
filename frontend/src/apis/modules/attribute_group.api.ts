import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IAttributeGroup, IApiResponse } from "@/models/interfaces";
import axiosPrivate from "../clients/private.client";
import { add } from "date-fns";

const categoryEndpoints = {
    list: "/attribute_group",
};

const attributeGroupApi = {
    async list(params: {
        page?: number;
        limit?: number;
        filters?: FilterSearch[];
        sort?: keyof IAttributeGroup | "";
        order?: ESortOrderValue;
    }): Promise<IApiResponse<IAttributeGroup[]>> {
        return axiosPrivate.get(categoryEndpoints.list, {
            params: { ...params, filters: JSON.stringify(params.filters) },
        });
    },
    async add(
        data: IAttributeGroup
    ): Promise<IApiResponse<IAttributeGroup>> {
        return axiosPrivate.post(categoryEndpoints.list, data);
    },
    async edit(
        id: number,
        data: IAttributeGroup
    ): Promise<IApiResponse<IAttributeGroup>> {
        return axiosPrivate.put(`${categoryEndpoints.list}/${id}`, data);
    },
    async deleted(
        id: number,
        isRestore: boolean = false
    ): Promise<IApiResponse<IAttributeGroup>> {
        return axiosPrivate.patch(`${categoryEndpoints.list}/${id}`, {
            isRestore: isRestore});
    }
};
export default attributeGroupApi; 