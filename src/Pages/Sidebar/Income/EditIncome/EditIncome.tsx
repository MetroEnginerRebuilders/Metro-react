import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";

import type { AppDispatch, RootState } from "../../../../store/store";
import { setField, setIncomeData, resetForm } from "./EditIncome.slice";
import { updateIncomeApi } from "../../../../service/income";
import { getIncomeCategoryListApi } from "../../../../service/incomeCategory";
import { getBankAccountListApi } from "../../../../service/bankAccount";
import type { IncomeCategory } from "../../../../type/incomeCategory";
import type { BankAccount } from "../../../../type/bankAccount";
import type { Income, EditIncomeState } from "../../../../type/income";
import SearchableSelect from "../../../../Components/SearchableSelect";

interface EditIncomeProps {
  open: boolean;
  onClose: () => void;
  income: Income | null;
}

const EditIncome = ({ open, onClose, income }: EditIncomeProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    transaction_date,
    amount,
    description,
    bank_account_id,
    remarks,
    finance_category_id,
  } = useSelector((state: RootState) => state.editIncome);

  const [loading, setLoading] = useState(false);
  const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  useEffect(() => {
    if (open && income) {
      dispatch(setIncomeData(income));
      fetchDropdownData();
    }
  }, [open, income, dispatch]);

  const fetchDropdownData = async () => {
    setLoadingDropdowns(true);
    try {
      const [categoriesResponse, accountsResponse] = await Promise.all([
        getIncomeCategoryListApi(),
        getBankAccountListApi({ page: 1, limit: 100 }),
      ]);

      if (categoriesResponse.success && categoriesResponse.data) {
        // Filter only income categories (finance_type_code === 'INCOME')
        const incomeOnly = categoriesResponse.data.filter(
          (cat) => cat.finance_type_code === "INCOME"
        );
        setIncomeCategories(incomeOnly);
      } else {
        console.warn('[EditIncome] Categories response invalid:', { success: categoriesResponse.success, hasData: !!categoriesResponse.data });
      }

      if (accountsResponse.success && accountsResponse.data) {
        setBankAccounts(accountsResponse.data);
      } else {
        console.warn('[EditIncome] Bank accounts response invalid:', { success: accountsResponse.success, hasData: !!accountsResponse.data });
      }
    } catch (error: any) {
      console.error('[EditIncome] Error fetching dropdown data:', {
        error,
        message: error?.message,
        response: error?.response,
        responseData: error?.response?.data
      });
      toast.error(error?.response?.data?.message || "Failed to fetch dropdown data", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoadingDropdowns(false);
    }
  };

  const handleChange = (field: keyof EditIncomeState, value: string) => {
    dispatch(setField({ field, value }));
  };

  const incomeCategoryOptions = useMemo(
    () => {
      const options = incomeCategories.map((cat) => ({
        value: cat.finance_category_id,
        label: cat.finance_category_name,
      }));
      return options;
    },
    [incomeCategories]
  );

  const bankAccountOptions = useMemo(
    () => {
      const options = bankAccounts.map((acc) => ({
        value: acc.bank_account_id,
        label: acc.account_name,
      }));
      return options;
    },
    [bankAccounts]
  );

  const validateForm = (): boolean => {
    if (!finance_category_id?.trim()) {
      toast.error("Income category is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    if (!transaction_date?.trim()) {
      toast.error("Transaction date is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    if (!amount?.trim() || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    if (!bank_account_id?.trim()) {
      toast.error("Bank account is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!income) return;
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        transactionDate: transaction_date,
        amount: amount,
        description: description,
        bankAccountId: bank_account_id,
        remarks: remarks,
        financeCategoryId: finance_category_id,
        financeTypeCode: "INCOME",
      };

      const result = await updateIncomeApi(income.finance_id, payload);

      if (result.success) {
        toast.success(result.message || "Income updated successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(resetForm());
        onClose();
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Failed to update income";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(resetForm());
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <span>Edit Income</span>
          <IconButton
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <FiX />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <SearchableSelect
            label="Income Category"
            value={finance_category_id}
            onChange={(value) => handleChange("finance_category_id", value)}
            options={incomeCategoryOptions}
            loading={loadingDropdowns}
            disabled={loadingDropdowns}
            required
            size="small"
          />

          <TextField
            label="Transaction Date"
            type="date"
            value={transaction_date}
            onChange={(e) => handleChange("transaction_date", e.target.value)}
            fullWidth
            required
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Amount"
            type="text"
            value={amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            fullWidth
            required
            size="small"
            inputProps={{ min: 0, step: "0.01" }}
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
            size="small"
            multiline
            rows={2}
          />

          <SearchableSelect
            label="Bank Account"
            value={bank_account_id}
            onChange={(value) => handleChange("bank_account_id", value)}
            options={bankAccountOptions}
            loading={loadingDropdowns}
            disabled={loadingDropdowns}
            required
            size="small"
          />

          <TextField
            label="Remarks"
            value={remarks}
            onChange={(e) => handleChange("remarks", e.target.value)}
            fullWidth
            size="small"
            multiline
            rows={2}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditIncome;
