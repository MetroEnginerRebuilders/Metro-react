import axios from "axios";
import type { Staff, StaffFormData, StaffEditFormData, StaffApiResponse, GetStaffListParams } from "../type/staff";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getStaffListApi = async (params: GetStaffListParams): Promise<StaffApiResponse<Staff[]>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/staff`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};

export const createStaffApi = async (data: StaffFormData): Promise<StaffApiResponse<Staff>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${BASE_URL}/staff`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateStaffApi = async (id: string, data: StaffEditFormData): Promise<StaffApiResponse<Staff>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.put(`${BASE_URL}/staff/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteStaffApi = async (id: string): Promise<StaffApiResponse<null>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.delete(`${BASE_URL}/staff/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getActiveStaffListApi = async (params: GetStaffListParams): Promise<StaffApiResponse<Staff[]>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/staff/active`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};
