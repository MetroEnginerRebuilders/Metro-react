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
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";

import type { AppDispatch, RootState } from "../../../../store/store";
import { setField, resetForm } from "./CreateBankAccount.slice";
import { createBankAccountApi } from "../../../../service/bankAccount";
import type { CreateBankAccountState } from "../../../../type/bankAccount";

interface CreateBankAccountProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateBankAccount = ({ open, onClose, onSuccess }: CreateBankAccountProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { account_name, account_number, opening_balance, activate_date } = useSelector(
    (state: RootState) => state.createBankAccount
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CreateBankAccountState, value: string) => {
    dispatch(setField({ field, value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!account_name?.trim()) {
      toast.error("Account name is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!account_number?.trim()) {
      toast.error("Account number is required", {
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

    setLoading(true);
    try {
      const payload = {
        accountName: account_name,
        accountNumber: account_number,
        openingBalance: opening_balance,
        activateDate: activate_date,
      };

      const result = await createBankAccountApi(payload);
      
      if (result.success) {
        toast.success(result.message || "Bank account created successfully", {
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
      const errorMessage = error?.response?.data?.message || error.message || "Failed to create bank account";
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
          <span>Create Bank Account</span>
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
            required
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
            InputLabelProps={{
              shrink: true,
            }}
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

export default CreateBankAccount;
