import { ESortOrderValue } from "@/models/enums/option";
import axiosPrivate from "../clients/private.client";
import axiosPublic from "../clients/public.client";
import { FilterSearch, IApiResponse,  IComponent } from "@/models/interfaces";

const componentEndpoints = {
    common: "component",
};

const ComponentApi = {
    async list(): Promise<IApiResponse<IComponent[]>> {
        return axiosPrivate.get(componentEndpoints.common);
    },
    async add(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.post(componentEndpoints.common, data);
        } catch (error) {
            throw error;
        }
    },
    async delete(component_id: string): Promise<IApiResponse> {
        try {
            return await axiosPrivate.delete(componentEndpoints.common + "/" + component_id);
        } catch (error) {
            throw error;
        }
    },
    async getById(component_id: number | string): Promise<IApiResponse<IComponent>> {
        try {
            return await axiosPublic.get(`${componentEndpoints.common}/${component_id}`);
        } catch (error) {
            throw error;
        }
    },
};

export default ComponentApi;
