import axiosPrivate from "../clients/private.client";
import axiosPublic from "../clients/public.client";
import { IApiResponse,  ILiked } from "@/models/interfaces/index";

const likdedEndpoints = {
    common: "liked",
};

const LikedApi = {
    async add(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.post(likdedEndpoints.common, data);
        } catch (error) {
            throw error;
        }
    },
    async delete(id: number | string, customer_id: string): Promise<IApiResponse> {
        try {
            return await axiosPrivate.delete(likdedEndpoints.common + "/" + customer_id +"/" + id);
        } catch (error) {
            throw error;
        }
    },
    async getById(customer_id: number | string): Promise<IApiResponse<ILiked>> {
        try {
            return await axiosPublic.get(`${likdedEndpoints.common}/${customer_id}`);
        } catch (error) {
            throw error;
        }
    },
};

export default LikedApi;
