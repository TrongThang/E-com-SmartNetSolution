import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IAttributeGroup, IApiResponse, IEmployee } from "@/models/interfaces/index";
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
    async add(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.post(employeeEndpoints.list, data);
        } catch (error) {
            throw error;
        }
    },
    async getById(id: string): Promise<IApiResponse<IEmployee>> {
        return axiosPrivate.get(`${employeeEndpoints.list}/${id}`);
    },
    async edit(id: string, data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.put(`${employeeEndpoints.list}/${id}`, data);
        } catch (error) {
            throw error;
        }
    },
    async delete(id: string,
        isRestore: boolean = false
    ): Promise<IApiResponse> {
        try {
            return await axiosPrivate.patch(`${employeeEndpoints.list}/${id}`, {
                isRestore: isRestore
            });
        } catch (error) {
            throw error;
        }
    }
};
export default EmployeeApi; 