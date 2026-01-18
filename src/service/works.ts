import type { GetWorkParams, WorkListResponse, CreateWorkRequest, CreateWorkResponse, UpdateWorkRequest, UpdateWorkResponse, DeleteWorkResponse } from "../type/works";
import { commonApi } from "./commonStructure";

export const getWorkListApi = async (
  params?: GetWorkParams
): Promise<WorkListResponse> => {
  const response = await commonApi<WorkListResponse>(
    "GET",
    "/work",
    null,
    params ? {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
      },
    } : undefined
  );

  return response.data;
};

export const createWorkApi = async (
  body: CreateWorkRequest
): Promise<CreateWorkResponse> => {
  const response = await commonApi<CreateWorkResponse>(
    "POST",
    "/work",
    body
  );

  return response.data;
};

export const updateWorkApi = async (
  workId: string,
  body: UpdateWorkRequest
): Promise<UpdateWorkResponse> => {
  const response = await commonApi<UpdateWorkResponse>(
    "PUT",
    `/work/${workId}`,
    body
  );

  return response.data;
};

export const deleteWorkApi = async (
  workId: string
): Promise<DeleteWorkResponse> => {
  const response = await commonApi<DeleteWorkResponse>(
    "DELETE",
    `/work/${workId}`,
    null
  );

  return response.data;
};
