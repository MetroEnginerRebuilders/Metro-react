import axios from "axios";
import type {
  Job,
  JobApiResponse,
  GetJobListParams,
  CreateJobRequest,
  CreateJobResponse,
  DeleteJobResponse,
  UpdateJobRequest,
  UpdateJobResponse,
  GetJobResponse,
} from "../type/job";

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

export const deleteJobApi = async (
  jobId: string
): Promise<DeleteJobResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.delete(`${BASE_URL}/job/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getJobApi = async (
  jobId: string
): Promise<GetJobResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/job/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateJobApi = async (
  jobId: string,
  data: UpdateJobRequest
): Promise<UpdateJobResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.put(`${BASE_URL}/job/${jobId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
