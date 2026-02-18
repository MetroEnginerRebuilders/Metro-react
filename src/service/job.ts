import axios from "axios";
import type { Job, JobApiResponse, GetJobListParams, CreateJobRequest, CreateJobResponse } from "../type/job";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getJobListApi = async (
  params: GetJobListParams
): Promise<JobApiResponse<Job[]>> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/job`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};

export const createJobApi = async (
  data: CreateJobRequest
): Promise<CreateJobResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${BASE_URL}/job`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
