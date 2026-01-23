import axios from "axios";
import type { Model, ModelFormData, ModelApiResponse, GetModelListParams } from "../type/model";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getModelListApi = async (params: GetModelListParams): Promise<ModelApiResponse<Model[]>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/model`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};

export const createModelApi = async (data: ModelFormData): Promise<ModelApiResponse<Model>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${BASE_URL}/model`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateModelApi = async (id: string, data: ModelFormData): Promise<ModelApiResponse<Model>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.put(`${BASE_URL}/model/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteModelApi = async (id: string): Promise<ModelApiResponse<null>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.delete(`${BASE_URL}/model/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
