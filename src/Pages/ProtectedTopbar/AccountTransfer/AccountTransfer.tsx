import {
  Button,
  TextField,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import type { AppDispatch, RootState } from "../../../store/store";
import { setField, resetForm } from "./AccountTransfer.slice";
import type { AccountTransferState, BankAccount } from "../../../type/bankAccount";
import { getBankAccountListApi, transferBankAccountApi } from "../../../service/bankAccount";
import Breadcrumb from "../../../Components/Breadcrumb";
import SearchableSelect from "../../../Components/SearchableSelect";

function AccountTransfer() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { from_account_id, to_account_id, amount, transfer_date } = useSelector(
    (state: RootState) => state.accountTransfer
  );

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const response = await getBankAccountListApi({ limit: 100 });
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
      label: `${account.account_name} - ${account.account_number} (₹${parseFloat(account.current_balance).toFixed(2)})`,
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
        navigate("/admin/account");
        dispatch(resetForm());
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
      </div>

      {/* Form Section */}
      <div className="flex-1 px-3 py-4">
        <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
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
    </div>
  );
}

export default AccountTransfer;
