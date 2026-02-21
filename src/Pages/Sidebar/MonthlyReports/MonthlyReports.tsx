import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Breadcrumb from "../../../Components/Breadcrumb";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  downloadMonthlyReportPdfApi,
  getMonthlyReportApi,
} from "../../../service/monthlyReport";
import {
  setData,
  setError,
  setLoading,
  setPrintLoading,
  setSelectedMonth,
  setSelectedYear,
} from "./MonthlyReports.slice";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import type { MonthlyReportDayItem } from "../../../type/monthlyReport";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEARS = Array.from({ length: 16 }, (_, index) => (2020 + index).toString());

const toNumber = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = typeof value === "string" ? parseFloat(value) : value;
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatAmountOrDash = (value: string | number | null | undefined): string => {
  const amount = toNumber(value);
  return amount === 0 ? "-" : formatCurrency(amount);
};

const normalizeExpenseType = (expenseType: string): string =>
  expenseType.trim().toLowerCase();

const getExpenseBuckets = (dailyReport: MonthlyReportDayItem) => {
  const buckets = {
    food: 0,
    spare: 0,
    stationary: 0,
    petrol: 0,
    field: 0,
    parcel: 0,
    material: 0,
    auto: 0,
    commission: 0,
    mobile: 0,
    other: 0,
  };

  dailyReport.expenses.forEach((expense) => {
    const expenseType = normalizeExpenseType(expense.expense_type);
    const amount = toNumber(expense.amount);

    if (expenseType.includes("food")) buckets.food += amount;
    else if (expenseType.includes("spare")) buckets.spare += amount;
    else if (expenseType.includes("stationary") || expenseType.includes("stationery")) buckets.stationary += amount;
    else if (expenseType.includes("petrol")) buckets.petrol += amount;
    else if (expenseType.includes("field")) buckets.field += amount;
    else if (expenseType.includes("parcel")) buckets.parcel += amount;
    else if (expenseType.includes("material")) buckets.material += amount;
    else if (expenseType.includes("auto")) buckets.auto += amount;
    else if (expenseType.includes("commission")) buckets.commission += amount;
    else if (expenseType.includes("mobile")) buckets.mobile += amount;
    else buckets.other += amount;
  });

  return buckets;
};

function MonthlyReports() {
  const dispatch = useAppDispatch();
  const { selectedMonth, selectedYear, loading, printLoading, data } = useAppSelector(
    (state) => state.monthlyReports
  );

  useEffect(() => {
    const now = new Date();
    if (!selectedMonth) {
      dispatch(setSelectedMonth(MONTHS[now.getMonth()]));
    }
    if (!selectedYear) {
      dispatch(setSelectedYear(now.getFullYear().toString()));
    }
  }, [dispatch, selectedMonth, selectedYear]);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Monthly Reports" },
  ];

  const hasFilterSelection = Boolean(selectedMonth && selectedYear);

  const handleViewReport = async () => {
    if (!selectedMonth || !selectedYear) {
      toast.error("Please select month and year", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await getMonthlyReportApi({
        year: selectedYear,
        month: selectedMonth,
      });

      if (response.success && response.data) {
        dispatch(setData(response.data));
      } else {
        const message = response.message || "Failed to fetch monthly report";
        dispatch(setError(message));
        dispatch(setData(null));
        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch monthly report";
      dispatch(setError(errorMessage));
      dispatch(setData(null));
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePrintReport = async () => {
    if (!selectedMonth || !selectedYear) {
      toast.error("Please select month and year", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    dispatch(setPrintLoading(true));
    try {
      const pdfBlob = await downloadMonthlyReportPdfApi({
        year: selectedYear,
        month: selectedMonth,
      });

      const fileUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `monthly-report-${selectedMonth}-${selectedYear}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(fileUrl);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to download monthly report";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      dispatch(setPrintLoading(false));
    }
  };

  const rows = useMemo(() => data?.daily_reports || [], [data]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="monthly-report-month-label">Month</InputLabel>
            <Select
              labelId="monthly-report-month-label"
              label="Month"
              value={selectedMonth}
              onChange={(event) => dispatch(setSelectedMonth(event.target.value))}
            >
              {MONTHS.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="monthly-report-year-label">Year</InputLabel>
            <Select
              labelId="monthly-report-year-label"
              label="Year"
              value={selectedYear}
              onChange={(event) => dispatch(setSelectedYear(event.target.value))}
            >
              {YEARS.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleViewReport}
            disabled={loading || !hasFilterSelection}
          >
            {loading ? <CircularProgress size={20} /> : "View"}
          </Button>

          <Button
            variant="contained"
            color="info"
            onClick={handlePrintReport}
            disabled={printLoading || !hasFilterSelection}
          >
            {printLoading ? <CircularProgress size={20} /> : "Print"}
          </Button>
        </Box>
      </div>

      <div className="flex-1 px-3 overflow-hidden mb-10">
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "100%",
            border: 1,
            borderColor: "grey.800",
          }}
        >
          <Table
            stickyHeader
            size="small"
            sx={{
              width: "100%",
              tableLayout: "fixed",
              "& .MuiTableCell-root": {
                px: 0.75,
                py: 0.5,
                fontSize: "0.72rem",
                lineHeight: 1.2,
                whiteSpace: "normal",
                wordBreak: "break-word",
                border: 1,
                borderColor: "grey.700",
              },
              "& .MuiTableHead-root .MuiTableCell-root": {
                borderColor: "grey.800",
                backgroundColor: "grey.50",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Food</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Spare</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Stationary</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Petrol</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Field</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Parcel</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Salary</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Material</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Auto</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Commission</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Mobile</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Other</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Total</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Income</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={15} align="center">
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={15} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No data found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((report) => {
                  const expenseBuckets = getExpenseBuckets(report);
                  const salary = toNumber(report.salary);
                  const total =
                    expenseBuckets.food +
                    expenseBuckets.spare +
                    expenseBuckets.stationary +
                    expenseBuckets.petrol +
                    expenseBuckets.field +
                    expenseBuckets.parcel +
                    salary +
                    expenseBuckets.material +
                    expenseBuckets.auto +
                    expenseBuckets.commission +
                    expenseBuckets.mobile +
                    expenseBuckets.other;

                  return (
                    <TableRow key={report.date} hover>
                      <TableCell>{formatDate(report.date)}</TableCell>
                      <TableCell>{formatAmountOrDash(expenseBuckets.food)}</TableCell>
                      <TableCell>{formatAmountOrDash(expenseBuckets.spare)}</TableCell>
                      <TableCell>{formatAmountOrDash(expenseBuckets.stationary)}</TableCell>
                      <TableCell>{formatAmountOrDash(expenseBuckets.petrol)}</TableCell>
                      <TableCell>{formatAmountOrDash(expenseBuckets.field)}</TableCell>
                      <TableCell>{formatAmountOrDash(expenseBuckets.parcel)}</TableCell>
                      <TableCell>{formatAmountOrDash(salary)}</TableCell>
                      <TableCell>{formatAmountOrDash(expenseBuckets.material)}</TableCell>
                      <TableCell>{formatAmountOrDash(expenseBuckets.auto)}</TableCell>
                      <TableCell>{formatAmountOrDash(expenseBuckets.commission)}</TableCell>
                      <TableCell>{formatAmountOrDash(expenseBuckets.mobile)}</TableCell>
                      <TableCell>{formatAmountOrDash(expenseBuckets.other)}</TableCell>
                      <TableCell>{formatAmountOrDash(total)}</TableCell>
                      <TableCell>{formatAmountOrDash(report.total_income)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default MonthlyReports;
