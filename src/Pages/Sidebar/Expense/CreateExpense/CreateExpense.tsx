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
import { setField, resetForm } from "./CreateExpense.slice";
import { createExpenseApi } from "../../../../service/expense";
import { getExpenseCategoryListApi } from "../../../../service/expenseCategory";
import { getActiveBankAccountListApi } from "../../../../service/bankAccount";
import type { ExpenseCategory } from "../../../../type/expenseCategory";
import type { BankAccount } from "../../../../type/bankAccount";
import type { CreateExpenseState } from "../../../../type/expense";
import SearchableSelect from "../../../../Components/SearchableSelect";

interface CreateExpenseProps {
  open: boolean;
  onClose: () => void;
}

const CreateExpense = ({ open, onClose }: CreateExpenseProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    transaction_date,
    amount,
    description,
    bank_account_id,
    remarks,
    finance_category_id,
  } = useSelector((state: RootState) => state.createExpense);

  const [loading, setLoading] = useState(false);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  useEffect(() => {
    if (open) {
      fetchDropdownData();
      if (!transaction_date) {
        const today = new Date().toISOString().split("T")[0];
        dispatch(setField({ field: "transaction_date", value: today }));
      }
    }
  }, [open, dispatch, transaction_date]);

  const fetchDropdownData = async () => {
    setLoadingDropdowns(true);
    try {
      const [categoriesResponse, accountsResponse] = await Promise.all([
        getExpenseCategoryListApi(),
        getActiveBankAccountListApi(),
      ]);

      if (categoriesResponse.success && categoriesResponse.data) {
        // Filter only expense categories (finance_type_code === 'EXPENSE')
        const expenseOnly = categoriesResponse.data.filter(
          (cat) => cat.finance_type_code === "EXPENSE"
        );
        setExpenseCategories(expenseOnly);
      }

      if (accountsResponse.success && accountsResponse.data) {
        setBankAccounts(accountsResponse.data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch dropdown data", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoadingDropdowns(false);
    }
  };

  const handleChange = (field: keyof CreateExpenseState, value: string) => {
    dispatch(setField({ field, value }));
  };

  const expenseCategoryOptions = useMemo(
    () =>
      expenseCategories.map((cat) => ({
        value: cat.finance_category_id,
        label: cat.finance_category_name,
      })),
    [expenseCategories]
  );

  const bankAccountOptions = useMemo(
    () =>
      bankAccounts.map((acc) => ({
        value: acc.bank_account_id,
        label: (acc.account_number || "").trim()
          ? `${acc.account_name} - ${acc.account_number}`
          : acc.account_name,
      })),
    [bankAccounts]
  );

  const validateForm = (): boolean => {
    if (!finance_category_id?.trim()) {
      toast.error("Expense category is required", {
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
        financeTypeCode: "EXPENSE",
      };

      const result = await createExpenseApi(payload);

      if (result.success) {
        toast.success(result.message || "Expense created successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(resetForm());
        onClose();
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Failed to create expense";
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
    <Dialog open={open} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <span>Create Expense</span>
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
            label="Expense Category"
            value={finance_category_id}
            onChange={(value) => handleChange("finance_category_id", value)}
            options={expenseCategoryOptions}
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
            inputProps={{
              max: new Date().toISOString().split("T")[0],
            }}
          />

          <TextField
            label="Amount"
            type="number"
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
          {loading ? <CircularProgress size={24} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateExpense;
