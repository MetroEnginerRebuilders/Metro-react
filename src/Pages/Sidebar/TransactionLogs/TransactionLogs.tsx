import {
  Box,
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
import { useMemo, useState } from "react";
import { commonTableHeadSx } from "../../../utils/tableHeaderStyle";
import { formatCurrency } from "../../../utils/formatters";

interface DailyTransactionItem {
  id: number;
  date: string;
  perticulars: string;
  income: number;
  expense: number;
}

const formatToInputDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DUMMY_TRANSACTIONS: DailyTransactionItem[] = [
  { id: 1, date: "2026-03-01", perticulars: "Lathe Work", income: 2500, expense: 0 },
  { id: 2, date: "2026-03-01", perticulars: "Petrol", income: 0, expense: 800 },
  { id: 3, date: "2026-03-01", perticulars: "Job Payment", income: 3200, expense: 0 },
  { id: 4, date: "2026-02-28", perticulars: "Office Supplies", income: 0, expense: 450 },
  { id: 5, date: "2026-02-28", perticulars: "Customer Payment", income: 1800, expense: 0 },
];

function TransactionLogs() {
  const today = useMemo(() => new Date(), []);
  const todayDate = useMemo(() => formatToInputDate(today), [today]);
  const [selectedDate, setSelectedDate] = useState(todayDate);

  const filteredTransactions = useMemo(
    () => DUMMY_TRANSACTIONS.filter((item) => item.date === selectedDate),
    [selectedDate]
  );

  return (
    <Box p={2}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Daily Transaction Logs
      </Typography>

      <Box mb={2}>
        <TextField
          label="Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: todayDate }}
          size="small"
        />
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
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((item, index) => (
                <TableRow key={item.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.perticulars}</TableCell>
                  <TableCell>{item.income ? formatCurrency(item.income) : "-"}</TableCell>
                  <TableCell>{item.expense ? formatCurrency(item.expense) : "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TransactionLogs;
