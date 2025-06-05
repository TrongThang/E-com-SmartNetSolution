import axiosPrivate from "../clients/private.client";
import axiosPublic from "../clients/public.client";
import { IApiResponse,  IAddressBook } from "@/models/interfaces";

const addressBookEndpoints = {
    common: "address-book",
};

const addressBookApi = {
    async add(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.post(addressBookEndpoints.common, data);
        } catch (error) {
            throw error;
        }
    },
    async delete(customer_id: number | string, id: number | string): Promise<IApiResponse> {
        try {
            return await axiosPrivate.delete(addressBookEndpoints.common + "/" + customer_id + "/" + id);
        } catch (error) {
            throw error;
        }
    },
    async edit(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.put(addressBookEndpoints.common, data);
        } catch (error) {
            throw error;
        }
    },
    async getById(customer_id: number | string): Promise<IApiResponse<IAddressBook>> {
        try {
            return await axiosPublic.get(`${addressBookEndpoints.common}/customer/${customer_id}`);
        } catch (error) {
            throw error;
        }
    },
};

export default addressBookApi;
