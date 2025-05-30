import axiosPrivate from "../clients/private.client"
import type { IApiResponse } from "@/models/interfaces"

const planningEndpoints = {
    common: "planning",
    approve: (planningId: string) => `/planning/${planningId}/approve`,
    batches: (planningId: string) => `/planning/${planningId}/batches`,
    batchStatus: (batchId: string) => `/planning/batches/${batchId}/status`,
    devtem: "device-templates"
}

const PlanningApi = {
    async getAllDeviceTemplates(): Promise<IApiResponse> {
        try {
            return await axiosPrivate.get(planningEndpoints.devtem)
        } catch (error) {
            throw error
        }
    },


    async create(data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.post(planningEndpoints.common, data)
        } catch (error) {
            throw error
        }
    },

    async getAll(): Promise<IApiResponse> {
        try {
            return await axiosPrivate.get(planningEndpoints.common)
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    async getById(planningId: string): Promise<IApiResponse> {
        try {
            return await axiosPrivate.get(`${planningEndpoints.common}/${planningId}`)
        } catch (error) {
            throw error
        }
    },

    async approve(planningId: string, data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.post(planningEndpoints.approve(planningId), data)
        } catch (error) {
            throw error
        }
    },

    async createBatch(planningId: string, data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.post(planningEndpoints.batches(planningId), data)
        } catch (error) {
            throw error
        }
    },

    async getBatches(planningId: string): Promise<IApiResponse> {
        try {
            return await axiosPrivate.get(planningEndpoints.batches(planningId))
        } catch (error) {
            throw error
        }
    },

    async updateBatchStatus(batchId: string, data: any): Promise<IApiResponse> {
        try {
            return await axiosPrivate.put(planningEndpoints.batchStatus(batchId), data)
        } catch (error) {
            throw error
        }
    },

    async createWithBatches(data: { planning: any, batches: any[] }): Promise<IApiResponse> {
        try {
            return await axiosPrivate.post(`${planningEndpoints.common}/with-batches`, data)
        } catch (error) {
            throw error
        }
    },
}

export default PlanningApi
