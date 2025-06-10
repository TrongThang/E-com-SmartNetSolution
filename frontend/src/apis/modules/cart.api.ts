import axiosPrivate from "../clients/private.client";
import axiosPublic from "../clients/public.client";
import { ESortOrderValue } from "@/models/enums/option";
import { jwtDecode } from "jwt-decode";
import { IApiResponse } from "@/models/interfaces";
import { FilterSearch } from "@/models/interfaces";

const cartEndpoints = {
    common: "cart",
};

const productEndpoints = {
    common: "product",
};

const cartApi = {
    async getCart(params: {
        page?: number;
        limit?: number;
        filters?: FilterSearch[];
        order?: ESortOrderValue;
    }): Promise<IApiResponse> {
        return axiosPublic.get(cartEndpoints.common, {
            params: { ...params, filters: JSON.stringify(params.filters) },
        });
    },
    async addToCart(customer_id: number | string, product_id: number | string, quantity: number): Promise<IApiResponse> {
        try {
            return await axiosPublic.post(cartEndpoints.common + "/customer/" + customer_id, { product_id, quantity });
        } catch (error) {
            throw error;
        }
    },
    async delete(id: number | string): Promise<IApiResponse> {
        try {
            return await axiosPublic.delete(cartEndpoints.common + "/" + id);
        } catch (error) {
            throw error;
        }
    },
    async edit(data: any): Promise<IApiResponse> {
        try {
            return await axiosPublic.put(cartEndpoints.common, data);
        } catch (error) {
            throw error;
        }
    },
    async getByIdCustomer(customer_id: number | string): Promise<any> {
        try {
            return await axiosPublic.get(`${cartEndpoints.common}/customer/${customer_id}`);
        } catch (error) {
            throw error;
        }
    },
    async getList(params: {
        page?: number;
        limit?: number;
        filters?: FilterSearch[];
        order?: ESortOrderValue;
    }): Promise<any> {
        const response = await axiosPublic.get(cartEndpoints.common, {
        params: { ...params, filters: JSON.stringify(params.filters) },
        });
        
        return response;
    },
    async deleteAll(customer_id: number | string): Promise<IApiResponse> {
        return await axiosPublic.delete(cartEndpoints.common + "/all/" + customer_id);
    },
    async updateCart(customer_id: number | string, cart: any): Promise<IApiResponse> {
        return await axiosPublic.put(cartEndpoints.common + "/update", { customer_id, items: cart.items });
    },
    async removeFromCart(customer_id: number | string, productId: number | string): Promise<IApiResponse> {
        return await axiosPublic.delete(cartEndpoints.common + "/customer/" + customer_id + "/product/" + productId);
    },
    async removeAllFromCart(customer_id: number | string): Promise<IApiResponse> {
        return await axiosPublic.delete(cartEndpoints.common + "/all/" + customer_id);
    },
    async updateQuantity(customer_id: number | string, product_id: number | string, quantity: number): Promise<IApiResponse> {
        return await axiosPublic.put(cartEndpoints.common + "/update-quantity", { customer_id, product_id, quantity });
    },
    async removeSelected(customer_id: number | string, items: any): Promise<IApiResponse> {
        return await axiosPublic.delete(cartEndpoints.common + "/selected/" + customer_id, { data: { items } });
    }
};

export default cartApi;