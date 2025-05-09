import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch } from "@/models/interfaces";
import { IApiResponse, ICategories } from "@/models/interfaces";
import axiosPrivate from "../clients/private.client";

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
        return axiosPrivate.get(categoryEndpoints.list, {
            params: { ...params, filters: JSON.stringify(params.filters) },
        });
    },
};
export default categoryApi; 