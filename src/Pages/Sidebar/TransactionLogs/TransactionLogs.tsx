import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getDailyTransactionApi } from "../../../service/transactionLogs";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { commonTableHeadSx } from "../../../utils/tableHeaderStyle";
import { clearTransactionLogs, setTransactionLogs } from "./TransactionLogs.slice";
import { formatCurrency } from "../../../utils/formatters";

const formatToInputDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTransactionKind = (description: string): "income" | "expense" | "unknown" => {
  const normalizedDescription = description.trim().toLowerCase();
  const prefix = normalizedDescription.split("-")[0]?.trim();

  if (["income", "invoice", "job"].includes(prefix)) {
    return "income";
  }

  if (["expense", "stock", "salary", "commission"].includes(prefix)) {
    return "expense";
  }

  if (normalizedDescription.includes("commission")) {
    return "expense";
  }

  return "unknown";
};

const resolveTransactionKind = (
  financeTypeName: string | null | undefined,
  description: string | null | undefined
): "income" | "expense" | "unknown" => {
  const normalizedFinanceTypeName = (financeTypeName || "").trim().toLowerCase();

  if (normalizedFinanceTypeName === "income") {
    return "income";
  }

  if (normalizedFinanceTypeName === "expense") {
    return "expense";
  }

  return getTransactionKind(description || "");
};

const formatParticulars = (description: string | null | undefined): string => {
  if (!description) {
    return "-";
  }

  const trimmedDescription = description.trim();
  if (!trimmedDescription) {
    return "-";
  }

  const firstCharacter = trimmedDescription.charAt(0);
  if (firstCharacter === firstCharacter.toLowerCase() && firstCharacter !== firstCharacter.toUpperCase()) {
    return firstCharacter.toUpperCase() + trimmedDescription.slice(1);
  }

  return trimmedDescription;
};

function TransactionLogs() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transactionLogs.list);
  const [loading, setLoading] = useState(false);
  const today = useMemo(() => new Date(), []);
  const todayDate = useMemo(() => formatToInputDate(today), [today]);
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [appliedDate, setAppliedDate] = useState(todayDate);

  const { totalIncome, totalExpense } = useMemo(() => {
    return transactions.reduce(
      (totals, item) => {
        const transactionKind = resolveTransactionKind(
          item.financeTypeName,
          item.description
        );
        if (transactionKind === "income") {
          totals.totalIncome += Number(item.amount) || 0;
        }
        if (transactionKind === "expense") {
          totals.totalExpense += Number(item.amount) || 0;
        }
        return totals;
      },
      { totalIncome: 0, totalExpense: 0 }
    );
  }, [transactions]);

  useEffect(() => {
    fetchDailyTransactions(appliedDate);
  }, [appliedDate]);

  const fetchDailyTransactions = async (date: string) => {
    setLoading(true);
    try {
      const response = await getDailyTransactionApi(date);
      if (response.success && response.data) {
        dispatch(setTransactionLogs(response.data));
      } else {
        dispatch(clearTransactionLogs());
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch daily transactions", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(clearTransactionLogs());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Daily Transaction Logs
      </Typography>

      <Box mb={2} display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <TextField
          label="Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: todayDate }}
          size="small"
        />
        <Button
          variant="contained"
          onClick={() => setAppliedDate(selectedDate)}
          disabled={loading}
        >
          Apply
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={commonTableHeadSx}>
            <TableRow>
              <TableCell>
                SL NO
              </TableCell>
              <TableCell>
                PERTICULARS
              </TableCell>
              <TableCell>
                INCOME
              </TableCell>
              <TableCell>
                EXPENSE
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((item, index) => {
                const transactionKind = resolveTransactionKind(
                  item.financeTypeName,
                  item.description
                );

                return (
                <TableRow key={item.transaction_id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{formatParticulars(item.description)}</TableCell>
                  <TableCell>
                    {transactionKind === "income" ? formatCurrency(item.amount) : "-"}
                  </TableCell>
                  <TableCell>
                    {transactionKind === "expense" ? formatCurrency(item.amount) : "-"}
                  </TableCell>
                </TableRow>
              );})
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" gap={3} flexWrap="wrap">
        <Typography variant="body1" fontWeight={600}>
          Total Income: {formatCurrency(totalIncome)}
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          Total Expense: {formatCurrency(totalExpense)}
        </Typography>
      </Box>
    </Box>
  );
}

export default TransactionLogs;
