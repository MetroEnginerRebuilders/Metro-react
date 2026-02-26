import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Breadcrumb from "../../../Components/Breadcrumb";
import { getExpenseListApi } from "../../../service/expense";
import type { Expense } from "../../../type/expense";
import { formatCurrency, formatDate } from "../../../utils/formatters";

function MonthlyExpenseDetails() {
  const [loading, setLoading] = useState(false);
  const [expenseList, setExpenseList] = useState<Expense[]>([]);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/" },
    { label: "Monthly Expense" },
  ];

  useEffect(() => {
    fetchExpense();
  }, []);

  const fetchExpense = async () => {
    setLoading(true);
    try {
      const response = await getExpenseListApi({
        page: 1,
        limit: 1000,
        financeTypeCode: "EXPENSE",
      });
      if (response.success && response.data) {
        setExpenseList(response.data);
      } else {
        setExpenseList([]);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch expense details", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyExpenseItems = useMemo(
    () =>
      expenseList.filter((item) => {
        const date = new Date(item.transaction_date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }),
    [expenseList, currentMonth, currentYear]
  );

  return (
    <Box>
      <Breadcrumb items={breadcrumbItems} />
      <Box p={2}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Monthly Expense Details
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={240}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>SL NO</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>ITEM</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>NAME</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>LAST UPDATED DATE</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>AMOUNT</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {monthlyExpenseItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  monthlyExpenseItems.map((item, index) => (
                    <TableRow key={item.finance_id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.finance_category_name || "-"}</TableCell>
                      <TableCell>{item.description || "-"}</TableCell>
                      <TableCell>{formatDate(item.created_at || item.transaction_date)}</TableCell>
                      <TableCell>{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}

export default MonthlyExpenseDetails;
