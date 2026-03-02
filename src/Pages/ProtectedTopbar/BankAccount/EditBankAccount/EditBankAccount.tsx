import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  Box,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";

import type { AppDispatch, RootState } from "../../../../store/store";
import { setField, setFormData, resetForm } from "./EditBankAccount.slice";
import { updateBankAccountApi } from "../../../../service/bankAccount";
import type { BankAccount, EditBankAccountState } from "../../../../type/bankAccount";

interface EditBankAccountProps {
  open: boolean;
  onClose: () => void;
  account: BankAccount | null;
  onSuccess?: () => void;
}

const EditBankAccount = ({ open, onClose, account, onSuccess }: EditBankAccountProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { account_name, account_number, opening_balance, activate_date, inactivate_date } = useSelector(
    (state: RootState) => state.editBankAccount
  );

  const [loading, setLoading] = useState(false);
  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    if (open && account) {
      dispatch(setFormData({
        account_name: account.account_name,
        account_number: account.account_number,
        opening_balance: account.opening_balance,
        activate_date: todayDate,
        inactivate_date: todayDate,
      }));
    }
  }, [open, account, dispatch, todayDate]);

  const handleChange = (field: keyof EditBankAccountState, value: string) => {
    dispatch(setField({ field, value }));
  };

  const handleSubmit = async () => {
    if (!account) return;

    // Validation
    if (!account_name?.trim()) {
      toast.error("Account name is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!opening_balance?.trim()) {
      toast.error("Opening balance is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (isNaN(parseFloat(opening_balance))) {
      toast.error("Opening balance must be a valid number", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!activate_date) {
      toast.error("Activate date is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (activate_date > todayDate) {
      toast.error("Future dates are not allowed", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (inactivate_date && inactivate_date > todayDate) {
      toast.error("Future dates are not allowed", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        accountName: account_name,
        accountNumber: account_number,
        openingBalance: opening_balance,
        activateDate: activate_date,
        inactivateDate: inactivate_date || undefined,
      };

      const result = await updateBankAccountApi(account.bank_account_id, payload);
      
      if (result.success) {
        toast.success(result.message || "Bank account updated successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(resetForm());
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to update bank account";
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
          <span>Edit Bank Account</span>
          <IconButton
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <FiX />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
            label="Account Name"
            value={account_name}
            onChange={(e) => handleChange("account_name", e.target.value)}
            fullWidth
            required
            size="small"
          />
          <TextField
            label="Account Number"
            value={account_number}
            onChange={(e) => handleChange("account_number", e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Opening Balance"
            value={opening_balance}
            onChange={(e) => handleChange("opening_balance", e.target.value)}
            fullWidth
            required
            size="small"
            type="number"
            inputProps={{ step: "0.01", min: "0" }}
          />
          <TextField
            label="Activate Date"
            value={activate_date}
            onChange={(e) => handleChange("activate_date", e.target.value)}
            fullWidth
            required
            size="small"
            type="date"
            inputProps={{ max: todayDate }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Inactivate Date"
            value={inactivate_date}
            onChange={(e) => handleChange("inactivate_date", e.target.value)}
            fullWidth
            size="small"
            type="date"
            inputProps={{ max: todayDate }}
            InputLabelProps={{
              shrink: true,
            }}
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

export default EditBankAccount;
