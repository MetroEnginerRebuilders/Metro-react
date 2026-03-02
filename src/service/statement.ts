import axios from "axios";
import type { StatementApiResponse, StatementFilterPayload } from "../type/statement";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getStatementListApi = async (
  payload: StatementFilterPayload
): Promise<StatementApiResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${BASE_URL}/statement`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
