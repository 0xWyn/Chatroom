import API from "./axiosInterceptor";

export async function PostService(data, link) {
    const response = await API.post({ link }, data);
    const information = response.data;

    return information;
}

export async function FetchService(link) {
    const response = await API.get(`${link}`);
    const information = response.data;

    return information;
}

export async function DeleteService(link) {
    const response = await API.delete(`${link}`);
    const information = response.data;

    return information;
}
