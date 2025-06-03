import axiosPrivate from "../clients/private.client";
import { ESortOrderValue } from "@/models/enums/option";
import axiosPublic from "../clients/public.client";
import { jwtDecode } from "jwt-decode";
import { IApiResponse } from "@/models/interfaces";
import { FilterSearch } from "@/models/interfaces";

const cartEndpoints = {
    common: "cart",
};

const productEndpoints = {
    common: "product",
};

interface DecodedToken {
    customer_id: number;
}

const userInfo = (): number | string | null => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) return null;

        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.customer_id;
    } catch (error) {
        console.error("Invalid or expired token", error);
        return null;
    }
};
const customer_id = userInfo();

const cartApi = {
    async getCart(params: {
        page?: number;
        limit?: number;
        filters?: FilterSearch[];
        order?: ESortOrderValue;
    }): Promise<IApiResponse> {
        return axiosPrivate.get(cartEndpoints.common, {
            params: { ...params, filters: JSON.stringify(params.filters) },
        });
    },
    async add(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.post(cartEndpoints.common, data);
        } catch (error) {
            throw error;
        }
    },
    async delete(id: number | string): Promise<IApiResponse> {
        try {
            return await axiosPrivate.delete(cartEndpoints.common + "/" + id);
        } catch (error) {
            throw error;
        }
    },
    async edit(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.put(cartEndpoints.common, data);
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
    async deleteAll(): Promise<IApiResponse> {
        return await axiosPublic.delete(cartEndpoints.common);
    },
    async updateCart(customer_id: number | string, cart: any): Promise<IApiResponse> {
        return await axiosPublic.put(cartEndpoints.common + "/update", { customer_id, items: cart.items });
    },
    async removeFromCart(productId: number | string): Promise<IApiResponse> {
        return await axiosPublic.delete(cartEndpoints.common + "/customer/" + customer_id + "/product/" + productId);
    },
    async removeAllFromCart(): Promise<IApiResponse> {
        return await axiosPublic.delete(cartEndpoints.common + "/all/" + customer_id);
    },
    async updateQuantity(customer_id: number | string, product_id: number | string, quantity: number): Promise<IApiResponse> {
        return await axiosPublic.put(cartEndpoints.common + "/update-quantity", { customer_id, product_id, quantity });
    },
    async removeSelected(items: any): Promise<IApiResponse> {
        return await axiosPublic.delete(cartEndpoints.common + "/selected/" + customer_id, { data: { items } });
    }
};

export default cartApi;