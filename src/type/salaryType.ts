export interface SalaryType {
  salary_type_id: string;
  salary_type: string;
  created_at: string;
}

export interface SalaryTypeListResponse {
  success: boolean;
  data: SalaryType[];
}
