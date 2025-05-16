import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IAttributeGroup, IApiResponse } from "@/models/interfaces";
import axiosPrivate from "../clients/private.client";

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
};
export default attributeGroupApi; 