import axiosPublic from "../clients/public.client";

const contactEndpoints = {
    create: "contact",
};

const contactApi = {
    create: (data: any) => axiosPublic.post(contactEndpoints.create, data),
};

export default contactApi;
