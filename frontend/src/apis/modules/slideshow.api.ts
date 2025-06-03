import axiosPrivate from "../clients/private.client";
import { IApiResponse } from "@/models/interfaces/index";

const slideshowEndpoints = {
    list: "/slideshow",
    detail: (id: number) => `/slideshow/${id}`,
    create: "/slideshow",
    update: "/slideshow",
    delete: (id: number) => `/slideshow/${id}`,
};

const SlideshowApi = {
    async list(params?: any): Promise<IApiResponse<any[]>> {
        return axiosPrivate.get(slideshowEndpoints.list, {
            params: params ? { ...params, filters: params.filters ? JSON.stringify(params.filters) : undefined } : undefined,
        });
    },
    async detail(id: number): Promise<IApiResponse<any>> {
        return axiosPrivate.get(slideshowEndpoints.detail(id));
    },
    async create(data: { text_button: string, link: string, image: string, status: boolean }): Promise<IApiResponse<any>> {
        return axiosPrivate.post(slideshowEndpoints.create, data);
    },
    async update(data: { id: number, text_button: string, link: string, image: string, status: boolean }): Promise<IApiResponse<any>> {
        return axiosPrivate.put(slideshowEndpoints.update, data);
    },
    async delete(id: number): Promise<IApiResponse<any>> {
        return axiosPrivate.delete(slideshowEndpoints.delete(id));
    },
};

export default SlideshowApi; 