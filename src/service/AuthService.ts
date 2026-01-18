import type { LoginRequest, LoginResponse } from "../type/login";
import type { ChangePasswordRequest, ChangePasswordResponse } from "../type/changePassword";
import { commonApi } from "./commonStructure";

export const LoginApi = async (
  body: LoginRequest
): Promise<LoginResponse> => {
  const result = await commonApi<LoginResponse>(
    "POST",
    `/admin/login`, 
    body
  );

  return result.data;
};

export const ChangePasswordApi = async (
  body: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  const result = await commonApi<ChangePasswordResponse>(
    "POST",
    `/admin/change-password`,
    body
  );

  return result.data;
};
