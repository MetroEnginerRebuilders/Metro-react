import {
  Button,
  Box,
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
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  clearMonthlyIncomeDetails,
  setMonthlyIncomeDetails,
} from "./MonthlyIncomeDetails.slice";
import Breadcrumb from "../../../Components/Breadcrumb";
import { getDashboardFinanceDateRangeApi } from "../../../service/dashboard";
import { commonTableHeadSx } from "../../../utils/tableHeaderStyle";
import { formatCurrency, formatDate } from "../../../utils/formatters";

const formatToApiDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatReferenceType = (referenceType: string | null): string => {
  if (!referenceType) {
    return "-";
  }

  return referenceType
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

function MonthlyIncomeDetails() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const incomeList = useAppSelector((state) => state.monthlyIncomeDetails.list);

  const today = useMemo(() => new Date(), []);
  const defaultFromDate = useMemo(
    () => formatToApiDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    [today]
  );
  const defaultToDate = useMemo(() => formatToApiDate(today), [today]);

  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/" },
    { label: "Monthly Income" },
  ];

  useEffect(() => {
    fetchIncome(defaultFromDate, defaultToDate);
  }, []);

  const fetchIncome = async (selectedFromDate: string, selectedToDate: string) => {
    setLoading(true);
    try {
      const response = await getDashboardFinanceDateRangeApi({
        fromDate: selectedFromDate,
        toDate: selectedToDate,
      });
      if (response.success && response.data) {
        const monthlyIncomeItems = response.data.filter(
          (item) => item.finance_type_code === "INCOME"
        );
        dispatch(setMonthlyIncomeDetails(monthlyIncomeItems));
      } else {
        dispatch(clearMonthlyIncomeDetails());
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch income details", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(clearMonthlyIncomeDetails());
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDateRange = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both from and to dates", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (fromDate > toDate) {
      toast.error("From date should not be greater than to date", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    fetchIncome(fromDate, toDate);
  };

  return (
    <Box>
      <Breadcrumb items={breadcrumbItems} />
      <Box p={2}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Monthly Income Details
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          <TextField
            label="From Date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <TextField
            label="To Date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <Button variant="contained" onClick={handleApplyDateRange}>
            Apply
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={240}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={commonTableHeadSx}>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>SL NO</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>ITEM</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>NAME</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>LAST UPDATED DATE</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>AMOUNT</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incomeList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  incomeList.map((item, index) => (
                    <TableRow key={item.transaction_id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{formatReferenceType(item.reference_type)}</TableCell>
                      <TableCell>{item.reference_name || "-"}</TableCell>
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

export default MonthlyIncomeDetails;
