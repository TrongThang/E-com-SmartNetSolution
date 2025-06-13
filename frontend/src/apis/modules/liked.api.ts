import axiosPrivate from "../clients/private.client";
import axiosPublic from "../clients/public.client";
import { IApiResponse,  ILiked } from "@/models/interfaces/index";

const likedEndpoints  = {
    common: "liked",
};

const LikedApi = {
    async add(data: any): Promise<IApiResponse> {
        try {
            return await axiosPublic.post(likedEndpoints.common, {
                product_id: data.product_id,
                customer_id: data.customer_id,
            });
        } catch (error) {
            throw error;
        }
    },
    async checkLiked(data: any): Promise<IApiResponse> {
        try {
            return await axiosPublic.get(`${likedEndpoints.common}/${data.customer_id}/${data.product_id}/check`);
        } catch (error) {
            throw error;
        }
    },
    async delete(data: any): Promise<IApiResponse> {
        try {
            return await axiosPublic.delete(likedEndpoints.common + "/" + data.customer_id +"/" + data.product_id);
        } catch (error) {
            throw error;
        }
    },
    async getById(customer_id: number | string): Promise<IApiResponse<ILiked>> {
        try {
            return await axiosPublic.get(`${likedEndpoints.common}/detail/${customer_id}`);
        } catch (error) {
            throw error;
        }
    },
};

export default LikedApi;
