import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
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
import { getCustomerListApi } from "../../../service/customer";
import { getShopListApi } from "../../../service/shops";
import { getStatementListApi } from "../../../service/statement";
import type {
  CustomerStatementApiItem,
  ShopStatementApiItem,
  StatementFilterPayload,
  StatementRecord,
  StatementType,
} from "../../../type/statement";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { commonTableHeadSx } from "../../../utils/tableHeaderStyle";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import {
  resetSelectedReferenceId,
  setCustomerOptions,
  setOptionsLoading,
  setSelectedReferenceId,
  setSelectedType,
  setShopOptions,
  setShowFilterErrors,
  setStatementRows,
  setTableLoading,
} from "./Statement.slice";

const formatAmountOrDash = (value: number | null | undefined): string => {
  const amount = Number(value) || 0;
  return amount > 0 ? formatCurrency(amount) : "-";
};

function Statement() {
  const dispatch = useAppDispatch();
  const {
    selectedType,
    selectedReferenceId,
    showFilterErrors,
    customerOptions,
    shopOptions,
    optionsLoading,
    tableLoading,
    statementRows,
  } = useAppSelector((state) => state.statement);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Statement" },
  ];

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchCustomerOptions = async () => {
    const response = await getCustomerListApi({ page: 1, limit: 200 });
    if (!response.success || !response.data) {
      return [];
    }

    return response.data
      .filter((customer) => Boolean(customer.customer_id) && Boolean(customer.customer_name))
      .map((customer) => ({ id: customer.customer_id, name: customer.customer_name }));
  };

  const fetchShopOptions = async () => {
    const response = await getShopListApi({ page: 1, limit: 200 });
    if (!response.success || !response.data) {
      return [];
    }

    return response.data
      .filter((shop) => Boolean(shop.shop_id) && Boolean(shop.shop_name))
      .map((shop) => ({ id: shop.shop_id, name: shop.shop_name }));
  };

  const fetchFilterOptions = async () => {
    dispatch(setOptionsLoading(true));
    try {
      const [customers, shops] = await Promise.all([
        fetchCustomerOptions(),
        fetchShopOptions(),
      ]);
      dispatch(setCustomerOptions(customers));
      dispatch(setShopOptions(shops));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch filter options", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(setCustomerOptions([]));
      dispatch(setShopOptions([]));
    } finally {
      dispatch(setOptionsLoading(false));
    }
  };

  const referenceOptions = useMemo(
    () => (selectedType === "customer" ? customerOptions : shopOptions),
    [selectedType, customerOptions, shopOptions]
  );

  const buildFilterPayload = (): StatementFilterPayload => {
    if (selectedType === "customer") {
      return {
        type: "customer",
        customerId: selectedReferenceId || undefined,
      };
    }

    return {
      type: "shop",
      shopId: selectedReferenceId || undefined,
    };
  };

  const mapShopStatementRows = (rows: ShopStatementApiItem[]): StatementRecord[] => {
    return rows.map((row) => ({
      statement_id: row.transaction_id,
      date: row.transaction_date,
      type: "shop",
      stock_type: row.stock_type || "-",
      description: row.description || "-",
      item: `${row.spare_name || "-"} / ${row.model_name || "-"}`,
      account_payable: row.entry_type === "expense" ? Number(row.amount) || 0 : 0,
      account_transaction_amount: row.entry_type === "income" ? Number(row.amount) || 0 : 0,
    }));
  };

  const mapCustomerStatementRows = (rows: CustomerStatementApiItem[]): StatementRecord[] => {
    return rows.map((row) => ({
      statement_id: row.transaction_id,
      date: row.transaction_date,
      type: "customer",
      stock_type: row.transaction_type || "-",
      description: row.description,
      item: row.received_items || "-",
      account_payable: row.entry_type === "expense" ? Number(row.amount) || 0 : 0,
      account_transaction_amount: row.entry_type === "income" ? Number(row.amount) || 0 : 0,
    }));
  };

  const handleApply = () => {
    dispatch(setShowFilterErrors(true));

    const payload = buildFilterPayload();

    if (selectedType === "customer" && !payload.customerId) {
      toast.error("Please select customer", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (selectedType === "shop" && !payload.shopId) {
      toast.error("Please select shop", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    dispatch(setShowFilterErrors(false));
    fetchStatement(payload);
  };

  const fetchStatement = async (payload: StatementFilterPayload) => {
    dispatch(setTableLoading(true));
    try {
      const response = await getStatementListApi(payload);
      if (response.success && response.data) {
        if (payload.type === "shop") {
          dispatch(setStatementRows(mapShopStatementRows(response.data as ShopStatementApiItem[])));
        } else {
          dispatch(setStatementRows(mapCustomerStatementRows(response.data as CustomerStatementApiItem[])));
        }
      } else {
        dispatch(setStatementRows([]));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch statement", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(setStatementRows([]));
    } finally {
      dispatch(setTableLoading(false));
    }
  };

  const handleExport = () => {
    const headers = [
      "SL NO",
      "DATE",
      "TYPE",
      "DESCRIPTION",
      "ITEM",
      "ACCOUNT PAYABLE",
      "ACCOUNT TRANSACTION AMOUNT",
    ];

    const rows = statementRows.map((row, index) => [
      String(index + 1),
      formatDate(row.date),
      row.stock_type || (row.type === "customer" ? "Customer" : "Shop"),
      row.description,
      row.item,
      String(row.account_payable),
      String(row.account_transaction_amount),
    ]);

    const csvContent = [headers, ...rows]
      .map((line) => line.map((cell) => `"${String(cell).replaceAll("\"", "\"\"")}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "statement.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <Box p={2}>
      <Breadcrumb items={breadcrumbItems} />

      <Typography variant="h6" fontWeight={600} mb={2}>
        Statement
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={2}
        mb={2}
      >
        <Box display="flex" gap={2} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 180 }} required>
          <InputLabel id="statement-type-label">Type</InputLabel>
          <Select
            labelId="statement-type-label"
            label="Type"
            value={selectedType}
            onChange={(event) => {
              const nextType = event.target.value as StatementType;
              dispatch(setSelectedType(nextType));
              dispatch(resetSelectedReferenceId());
              dispatch(setShowFilterErrors(false));
            }}
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="shop">Shop</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{ minWidth: 220 }}
          required
          error={showFilterErrors && !selectedReferenceId}
        >
          <InputLabel id="statement-name-label">
            {selectedType === "customer" ? "Customer" : "Shop"}
          </InputLabel>
          <Select
            labelId="statement-name-label"
            label={selectedType === "customer" ? "Customer" : "Shop"}
            value={selectedReferenceId}
            onChange={(event) => {
              dispatch(setSelectedReferenceId(event.target.value));
              dispatch(setShowFilterErrors(false));
            }}
            disabled={optionsLoading}
          >
            {optionsLoading && (
              <MenuItem value="" disabled>
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={16} />
                  Loading...
                </Box>
              </MenuItem>
            )}
            {referenceOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
          {showFilterErrors && !selectedReferenceId && (
            <FormHelperText>
              Please select {selectedType === "customer" ? "customer" : "shop"}
            </FormHelperText>
          )}
        </FormControl>

        <Button
          variant="contained"
          onClick={handleApply}
          disabled={optionsLoading || !selectedReferenceId}
        >
          Apply
        </Button>
        </Box>

        <Button variant="outlined" onClick={handleExport} sx={{ ml: "auto" }}>
          Export
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={commonTableHeadSx}>
            <TableRow>
              <TableCell>SL NO</TableCell>
              <TableCell>DATE</TableCell>
              <TableCell>TYPE</TableCell>
              <TableCell>DESCRIPTION</TableCell>
              <TableCell>ITEM</TableCell>
              <TableCell>ACCOUNT PAYABLE</TableCell>
              <TableCell>ACCOUNT RECEIVABLE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress size={28} />
                      </TableCell>
                    </TableRow>
                  ) : statementRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
                    statementRows.map((row, index) => (
                <TableRow key={row.statement_id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{formatDate(row.date)}</TableCell>
                  <TableCell>{row.stock_type }</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.item}</TableCell>
                  <TableCell>{formatAmountOrDash(row.account_payable)}</TableCell>
                  <TableCell>{formatAmountOrDash(row.account_transaction_amount)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Statement;
