import axios from "axios";
import type { StaffSalary, StaffSalaryFormData, StaffSalaryApiResponse, GetStaffSalaryListParams } from "../type/staffSalary";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getStaffSalaryListApi = async (params: GetStaffSalaryListParams): Promise<StaffSalaryApiResponse<StaffSalary[]>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/staff-salary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};

export const createStaffSalaryApi = async (data: StaffSalaryFormData): Promise<StaffSalaryApiResponse<StaffSalary>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${BASE_URL}/staff-salary`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateStaffSalaryApi = async (id: string, data: StaffSalaryFormData): Promise<StaffSalaryApiResponse<StaffSalary>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.put(`${BASE_URL}/staff-salary/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteStaffSalaryApi = async (id: string): Promise<StaffSalaryApiResponse<null>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.delete(`${BASE_URL}/staff-salary/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
