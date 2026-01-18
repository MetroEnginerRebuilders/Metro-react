export interface ChangePasswordRequest {
  username: string;
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}
export interface ChangePasswordData {
  username: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}