import axiosPrivate from "../clients/private.client";
import axiosPublic from "../clients/public.client";
import { requestGHN } from "@/utils/requestGHN";
import { IApiResponse, IAddressBook } from "@/models/interfaces";

const addressBookEndpoints = {
    common: "address-book",
    customer: "address-book/customer",
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
            return await axiosPrivate.delete(`${addressBookEndpoints.common}/${customer_id}/${id}`);
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
            return await axiosPublic.get(`${addressBookEndpoints.customer}/${customer_id}`);
        } catch (error) {
            throw error;
        }
    },
    async getCity(): Promise<IApiResponse> {
        try {
            const response = await requestGHN('/province', {
                method: 'GET',
            });
            return {
                status_code: 200,
                data: response.data,
            };
        } catch (error) {
            throw error;
        }
    },
    async getDistrict(provinceId: number | string): Promise<IApiResponse> {
        try {
            const response = await requestGHN('/district', {
                method: 'GET',
                params: { province_id: provinceId },
            });
            return {
                status_code: 200,
                data: response.data,
            };
        } catch (error) {
            throw error;
        }
    },
    async getWard(districtId: number | string): Promise<IApiResponse> {
        try {
            const response = await requestGHN('/ward', {
                method: 'GET',
                params: { district_id: districtId },
            });
            return {
                status_code: 200,
                data: response.data,
            };
        } catch (error) {
            throw error;
        }
    },
};

export default addressBookApi;