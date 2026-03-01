import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBarChart2, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CommonMonthSelect, { MONTH_OPTIONS } from "../../../Components/CommonMonthSelect";
import CommonYearSelect from "../../../Components/CommonYearSelect";
import {
  getDashboardIncomeExpenseApi,
  getDashboardYearlyIncomeExpenseApi,
} from "../../../service/dashboard";
import type {
  DashboardIncomeExpenseSummary,
  DashboardYearlyMonthlyDataItem,
} from "../../../type/dashboard";
import { formatCurrency } from "../../../utils/formatters";

const formatToApiDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const today = useMemo(() => new Date(), []);
  const [selectedMonth, setSelectedMonth] = useState(String(currentMonth));
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [dashboardSummary, setDashboardSummary] = useState<DashboardIncomeExpenseSummary>({
    from_date: "",
    to_date: "",
    total_income: 0,
    total_expense: 0,
    net_amount: 0,
  });
  const [yearlyMonthlyData, setYearlyMonthlyData] = useState<DashboardYearlyMonthlyDataItem[]>([]);

  const monthDateRange = useMemo(() => {
    const monthIndex = Number(selectedMonth) - 1;
    const fromDate = formatToApiDate(new Date(currentYear, monthIndex, 1));
    const isCurrentMonth = monthIndex === today.getMonth() && currentYear === today.getFullYear();
    const toDate = isCurrentMonth
      ? formatToApiDate(today)
      : formatToApiDate(new Date(currentYear, monthIndex + 1, 0));

    return { fromDate, toDate };
  }, [selectedMonth, currentYear, today]);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const response = await getDashboardIncomeExpenseApi(monthDateRange);
        if (response.success && response.data) {
          setDashboardSummary(response.data);
          return;
        }

        setDashboardSummary((prev) => ({
          ...prev,
          total_income: 0,
          total_expense: 0,
          net_amount: 0,
        }));
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch dashboard summary", {
          position: "top-right",
          autoClose: 3000,
        });
        setDashboardSummary((prev) => ({
          ...prev,
          total_income: 0,
          total_expense: 0,
          net_amount: 0,
        }));
      }
    };

    fetchDashboardSummary();
  }, [monthDateRange]);

  useEffect(() => {
    const fetchYearlyChartData = async () => {
      try {
        const response = await getDashboardYearlyIncomeExpenseApi({ year: Number(selectedYear) });
        if (response.success && response.data?.monthly_data) {
          setYearlyMonthlyData(response.data.monthly_data);
          return;
        }

        setYearlyMonthlyData([]);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch yearly dashboard data", {
          position: "top-right",
          autoClose: 3000,
        });
        setYearlyMonthlyData([]);
      }
    };

    fetchYearlyChartData();
  }, [selectedYear]);

  const monthlyIncome = dashboardSummary.total_income || 0;
  const monthlyExpense = dashboardSummary.total_expense || 0;

  const monthlyIncomeExpenseChartData = useMemo(
    () =>
      MONTH_OPTIONS.map((month) => {
        const monthNumber = Number(month.value);
        const monthData = yearlyMonthlyData.find((item) => item.month === monthNumber);
        return {
          label: month.label.slice(0, 3),
          income: monthData?.total_income ?? 0,
          expense: monthData?.total_expense ?? 0,
        };
      }),
    [yearlyMonthlyData]
  );

  const netAmount = dashboardSummary.net_amount ?? monthlyIncome - monthlyExpense;

  return (
    <Box p={{ xs: 1.5, md: 2.5 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          mb: 2,
          borderRadius: 3,
          border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(
              theme.palette.background.paper,
              1
            )})`,
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Monthly finance overview and quick insights
            </Typography>
          </Box>
          <CommonMonthSelect
            value={selectedMonth}
            onChange={setSelectedMonth}
            labelId="dashboard-month-label"
            minWidth={180}
          />
        </Box>
      </Paper>

      <>
        <Grid container spacing={2.5} mb={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  cursor: "pointer",
                  borderRadius: 3,
                  border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.22)}`,
                  background: (theme) =>
                    `linear-gradient(135deg, ${alpha(theme.palette.success.light, 0.24)}, ${alpha(
                      theme.palette.background.paper,
                      1
                    )})`,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 6,
                  },
                }}
                onClick={() => navigate("/dashboard/monthly-income")}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Monthly Income
                    </Typography>
                    <Avatar sx={{ bgcolor: (theme) => alpha(theme.palette.success.main, 0.2), color: "success.dark", width: 34, height: 34 }}>
                      <FiTrendingUp size={16} />
                    </Avatar>
                  </Box>
                  <Typography variant="h5" fontWeight={700} color="success.dark">
                    {formatCurrency(monthlyIncome)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  cursor: "pointer",
                  borderRadius: 3,
                  border: (theme) => `1px solid ${alpha(theme.palette.error.main, 0.22)}`,
                  background: (theme) =>
                    `linear-gradient(135deg, ${alpha(theme.palette.error.light, 0.2)}, ${alpha(
                      theme.palette.background.paper,
                      1
                    )})`,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 6,
                  },
                }}
                onClick={() => navigate("/dashboard/monthly-expense")}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Monthly Expense
                    </Typography>
                    <Avatar sx={{ bgcolor: (theme) => alpha(theme.palette.error.main, 0.2), color: "error.dark", width: 34, height: 34 }}>
                      <FiTrendingDown size={16} />
                    </Avatar>
                  </Box>
                  <Typography variant="h5" fontWeight={700} color="error.dark">
                    {formatCurrency(monthlyExpense)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
        </Grid>

        <Card sx={{ borderRadius: 3, mb: 2.5 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16), color: "primary.main", width: 32, height: 32 }}>
                  <FiBarChart2 size={16} />
                </Avatar>
                <Typography variant="subtitle1" fontWeight={700}>
                  Monthly Income vs Expense Graph
                </Typography>
              </Box>
              <CommonYearSelect
                value={selectedYear}
                onChange={setSelectedYear}
                labelId="dashboard-year-label"
                minWidth={120}
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box height={260} px={1}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyIncomeExpenseChartData}
                  margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={alpha(theme.palette.text.secondary, 0.2)}
                    vertical={false}
                  />
                  <XAxis dataKey="label" tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                  <YAxis tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                  <Legend />
                  <Tooltip
                    formatter={(value: number | string | undefined) => formatCurrency(Number(value ?? 0))}
                    contentStyle={{
                      borderRadius: 8,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
                    }}
                  />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill={theme.palette.success.light}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill={theme.palette.error.light}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Typography
          variant="subtitle2"
          sx={{ mt: 2, color: netAmount >= 0 ? "success.main" : "error.main", fontWeight: 700 }}
        >
          Net: {formatCurrency(netAmount)}
        </Typography>
      </>
    </Box>
  );
}

export default Dashboard;
