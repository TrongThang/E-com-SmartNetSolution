import axiosPrivate from "../clients/private.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IProduct, IProductDetail } from "@/models/interfaces/index";
import axiosPublic from "../clients/public.client";

const productEndpoints = {
    common: "product/admin",
};

const productPublic = {
    common: "product",
};

const productApi = {
    async search(params: {
        page?: number;
        limit?: number;
        filters?: any;
        order?: ESortOrderValue;
    }): Promise<IApiResponse<IProduct[]>> {
        
        return axiosPublic.get(productPublic.common, {
            params: { ...params, filters: JSON.stringify(params.filters) },
        });
    },

    async list(params: {
        page?: number;
        limit?: number;
        filters?: FilterSearch[];
        order?: ESortOrderValue;
    }): Promise<IApiResponse<IProduct[]>> {
        return axiosPrivate.get(productPublic.common, {
            params: params ? { ...params, filters: params.filters ? JSON.stringify(params.filters) : undefined } : undefined,
        });
    },
    async add(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.post(productPublic.common, data);
        } catch (error) {
            throw error;
        }
    },
    async delete(id: number | string): Promise<IApiResponse> {
        try {
            return await axiosPrivate.delete(productPublic.common + "/" + id);
        } catch (error) {
            throw error;
        }
    },
    async edit(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.put(productPublic.common, data);
        } catch (error) {
            throw error;
        }
    },
    async getById(id: number | string): Promise<IApiResponse<IProductDetail>> {
        try {
            return await axiosPublic.get(`${productPublic.common}/detail/${id}`);
        } catch (error) {
            throw error;
        }
    },
    async getBySlug(slug: string): Promise<IApiResponse<IProductDetail>> {
        try {
            return await axiosPublic.get(`${productPublic.common}/detail-by-slug/${slug}`);
        } catch (error) {
            throw error;
        }
    },
    async checkWarehouseInventory(product_id: number): Promise<IApiResponse> {
        try {
            return await axiosPublic.get(`${productPublic.common}/check-warehouse-inventory/${product_id}`);
        } catch (error) {
            throw error;
        }
    }
};

export default productApi;