import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IAttributeGroup, IApiResponse, IEmployee } from "@/models/interfaces";
import axiosPrivate from "../clients/private.client";

const employeeEndpoints = {
    list: "/employee",
};

const EmployeeApi = {
    async list(params: {
        page?: number;
        limit?: number;
        filters?: FilterSearch[];
        sort?: keyof IEmployee | "";
        order?: ESortOrderValue;
    }): Promise<IApiResponse<IEmployee[]>> {
        return axiosPrivate.get(employeeEndpoints.list, {
            params: { ...params, filters: JSON.stringify(params.filters) },
        });
    },
};
export default EmployeeApi; 