import AxiosInstance from "../helper/Axiosintances";

export const postNewsData = async () => {
    const res = await AxiosInstance().get('/api/postnews')
    console.log("check products data : ", res.data);
    return res.data;
}

export const addPostnews = async () => {
    const res = await AxiosInstance().post('/api/postnews/add')
    console.log("check add data : ", res.data);
    return res.data;
}

export const updatePostnews = async () => {
    const res = await AxiosInstance().put('/api/postnews/update')
    console.log("check update data : ", res.data);
    return res.data;
}

export const deletePostnews = async (id) => {
    const res = await AxiosInstance().delete(`/api/postnews/delete/${id}`);
    console.log("check delete data : ", res);
    return res;
}   