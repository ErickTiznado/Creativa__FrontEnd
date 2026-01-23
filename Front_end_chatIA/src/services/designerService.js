import { api } from "./api";

export const getDesigners = async () => {
    const response = await api.get('/profiles/');
    console.log(response.data);
    return response.data;
}