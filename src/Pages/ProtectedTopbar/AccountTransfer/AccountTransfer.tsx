import {
  Button,
  TextField,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { AppDispatch, RootState } from "../../../store/store";
import { setField, resetForm } from "./AccountTransfer.slice";
import type { AccountTransferListItem, AccountTransferState, BankAccount } from "../../../type/bankAccount";
import { getAccountTransferListApi, getActiveBankAccountListApi, transferBankAccountApi } from "../../../service/bankAccount";
import Breadcrumb from "../../../Components/Breadcrumb";
import CommonPagination from "../../../Components/CommonPagination";
import SearchableSelect from "../../../Components/SearchableSelect";
import { commonTableHeadSx } from "../../../utils/tableHeaderStyle";
import { formatDate } from "../../../utils/formatters";

const getToday = () => new Date().toISOString().split("T")[0];

const getMonthStart = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
};

function AccountTransfer() {
  const dispatch = useDispatch<AppDispatch>();
  const { from_account_id, to_account_id, amount, transfer_date } = useSelector(
    (state: RootState) => state.accountTransfer
  );

  const [showTransferForm, setShowTransferForm] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transferRows, setTransferRows] = useState<AccountTransferListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);
  const today = getToday();
  const [fromDate, setFromDate] = useState(getMonthStart());
  const [toDate, setToDate] = useState(today);
  const pageLimit = 10;

  useEffect(() => {
    fetchTransferList(getMonthStart(), today, 1);
  }, []);

  useEffect(() => {
    if (showTransferForm && !transfer_date) {
      dispatch(setField({ field: "transfer_date", value: today }));
    }
  }, [showTransferForm, transfer_date, dispatch, today]);

  const normalizeTransferRow = (row: any): AccountTransferListItem => ({
    account_transfer_id: row.account_transfer_id || row.accountTransferId || row.id,
    account_name: row.account_name || row.accountName || "-",
    finance_type_name: row.finance_type_name || row.financeTypeName || "-",
    reference_type: row.reference_type || row.referenceType || "-",
    transaction_date: row.transaction_date || row.transactionDate || "",
    description: row.description || "-",
    amount: row.amount || 0,
  });

  const fetchTransferList = async (from: string, to: string, page: number = 1) => {
    setListLoading(true);
    try {
      const response = await getAccountTransferListApi({
        fromDate: from,
        toDate: to,
        search: "",
        page,
        limit: pageLimit,
      });

      if (response.success && response.data) {
        setTransferRows(response.data.map(normalizeTransferRow));
        setPagination(response.pagination || null);
      } else {
        setTransferRows([]);
        setPagination(null);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch account transfers", {
        position: "top-center",
        autoClose: 3000,
      });
      setTransferRows([]);
      setPagination(null);
    } finally {
      setListLoading(false);
    }
  };

  const fetchBankAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const response = await getActiveBankAccountListApi();
      if (response.success && response.data) {
        setBankAccounts(response.data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch bank accounts", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleChange = (field: keyof AccountTransferState, value: string) => {
    dispatch(setField({ field, value }));
  };

  // Prepare options for SearchableSelect
  const bankAccountOptions = useMemo(() =>
    bankAccounts.map((account) => ({
      value: account.bank_account_id,
      label: (account.account_number || "").trim()
        ? `${account.account_name} - ${account.account_number}`
        : account.account_name,
    })),
    [bankAccounts]
  );

  const handleTransfer = async () => {
    // Validation
    if (!from_account_id) {
      toast.error("Please select from account", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!to_account_id) {
      toast.error("Please select to account", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (from_account_id === to_account_id) {
      toast.error("From and To accounts cannot be the same", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!amount?.trim()) {
      toast.error("Amount is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Amount must be a valid positive number", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!transfer_date) {
      toast.error("Transfer date is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (transfer_date > today) {
      toast.error("Transfer date cannot be in the future", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fromAccountId: from_account_id,
        toAccountId: to_account_id,
        amount: amount,
        transferDate: transfer_date,
      };

      const result = await transferBankAccountApi(payload);
      
      if (result.success) {
        toast.success(result.message || "Transfer completed successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(resetForm());
        setShowTransferForm(false);
        fetchTransferList(fromDate, toDate, currentPage);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to transfer";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both from and to dates", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (fromDate > toDate) {
      toast.error("From date cannot be greater than to date", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setCurrentPage(1);
    fetchTransferList(fromDate, toDate, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTransferList(fromDate, toDate, page);
  };

  const handleOpenTransferForm = async () => {
    setShowTransferForm(true);
    dispatch(setField({ field: "transfer_date", value: today }));
    await fetchBankAccounts();
  };

  const handleBackToList = () => {
    setShowTransferForm(false);
    dispatch(resetForm());
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Masterdata", path: "/master" },
    { label: "Account Transfer" }
  ];

  return (
    <div className="flex flex-col">
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Header Section */}
      <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
          ACCOUNT TRANSFER
        </h1>

        {!showTransferForm && (
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box display="flex" gap={1} flexWrap="wrap">
              <TextField
                label="From Date"
                type="date"
                size="small"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: today }}
              />
              <TextField
                label="To Date"
                type="date"
                size="small"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: today }}
              />
              <Button variant="contained" onClick={handleApplyFilter}>
                Apply
              </Button>
            </Box>

            <Button variant="contained" onClick={handleOpenTransferForm}>
              Account Transfer
            </Button>
          </Box>
        )}
      </div>

      {showTransferForm ? (
        <div className="flex-1 px-3 py-4">
          <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <h2 className="text-xl font-semibold">Create Account Transfer</h2>
              <Button variant="outlined" onClick={handleBackToList}>Back to List</Button>
            </Box>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <SearchableSelect
                label="From Bank Account"
                value={from_account_id}
                onChange={(value) => handleChange("from_account_id", value)}
                options={bankAccountOptions}
                loading={loadingAccounts}
                disabled={loadingAccounts}
                required
                size="small"
              />

              <SearchableSelect
                label="To Bank Account"
                value={to_account_id}
                onChange={(value) => handleChange("to_account_id", value)}
                options={bankAccountOptions}
                loading={loadingAccounts}
                disabled={loadingAccounts}
                required
                size="small"
              />

              <TextField
                label="Amount to Transfer"
                value={amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                fullWidth
                required
                size="small"
                type="number"
                inputProps={{ step: "0.01", min: "0" }}
              />

              <TextField
                label="Transfer Date"
                value={transfer_date}
                onChange={(e) => handleChange("transfer_date", e.target.value)}
                fullWidth
                required
                size="small"
                type="date"
                inputProps={{ max: today }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <Button
                variant="contained"
                onClick={handleTransfer}
                disabled={loading || loadingAccounts}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : "Transfer"}
              </Button>
            </div>
          </Paper>
        </div>
      ) : (
        <div className="flex-1 px-3 py-4 overflow-auto">
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={commonTableHeadSx}>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>SL NO</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>ACCOUNT NAME</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>TYPE</TableCell>
                  {/* <TableCell style={{ fontWeight: "bold" }}>REFERENCE TYPE</TableCell> */}
                  <TableCell style={{ fontWeight: "bold" }}>TRANSACTION DATE</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>DESCRIPTION</TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>AMOUNT</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {listLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : transferRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  transferRows.map((row, index) => (
                    <TableRow key={row.account_transfer_id || `${row.account_name}-${row.transaction_date}-${index}`} hover>
                      <TableCell>
                        {pagination
                          ? (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1
                          : index + 1}
                      </TableCell>
                      <TableCell>{row.account_name || "-"}</TableCell>
                      <TableCell>{row.finance_type_name || "-"}</TableCell>
                      {/* <TableCell>{row.reference_type || "-"}</TableCell> */}
                      <TableCell>{formatDate(row.transaction_date)}</TableCell>
                      <TableCell>{row.description || "-"}</TableCell>
                      <TableCell>{row.amount || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <CommonPagination
            mode="server"
            currentPage={pagination?.currentPage || currentPage}
            totalPages={pagination?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default AccountTransfer;
