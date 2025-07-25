import axiosPrivate from "../clients/private.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IReview, IProductDetail } from "@/models/interfaces/index";
import axiosPublic from "../clients/public.client";

const reviewEndpoints = {
    common: "review/admin",
};

const reviewPublic = {
    common: "review",
};

const reviewApi = {
    async list(params: {
        page?: number;
        limit?: number;
        filters?: FilterSearch[];
        order?: ESortOrderValue;
    }): Promise<IApiResponse<IReview[]>> {
        return axiosPrivate.get(reviewPublic.common, {
            params: { ...params, filters: JSON.stringify(params.filters) },
        });
    },
    async add(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.post(reviewPublic.common, data);
        } catch (error) {
            throw error;
        }
    },
    async delete(id: number | string): Promise<IApiResponse> {
        try {
            return await axiosPrivate.delete(reviewPublic.common + "/" + id);
        } catch (error) {
            throw error;
        }
    },
    async edit(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.put(reviewPublic.common, data);
        } catch (error) {
            throw error;
        }
    },
    async getByProductId(id: number | string): Promise<IApiResponse<IReview[]>> {
        try {
            const filter: FilterSearch = {
                field: "product_id",
                condition: "=",
                value: id,
            }

            return await axiosPublic.get(`${reviewPublic.common}`, {
                params: { filter: JSON.stringify([filter]), }
            });
        } catch (error) {
            throw error;
        }
    },
    async detail(id: number | string): Promise<IApiResponse<IReview>> {
        try {
            return await axiosPrivate.get(`${reviewPublic.common}/detail/${id}`);
        } catch (error) {
            throw error;
        }
    },
    async checkCustomerIsOrderAndReview(customer_id: number | string, product_id: number | string): Promise<IApiResponse<{ isOrder: boolean, isReview: boolean }>> {
        try {
            console.log('customer_id', customer_id);
            console.log('product_id', product_id);
            return await axiosPrivate.get(`${reviewPublic.common}/check-customer-is-order-and-review`, {
                params: { customer_id, product_id }
            });
        } catch (error) {
            throw error;
        }
    }
};

export default reviewApi;