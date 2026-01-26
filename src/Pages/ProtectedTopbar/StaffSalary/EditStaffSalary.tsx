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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";

import type { AppDispatch, RootState } from "../../../store/store";
import { setField, setFormData, resetForm } from "./EditStaffSalary.slice";
import { updateStaffSalaryApi } from "../../../service/staffSalary";
import type { StaffSalary, EditStaffSalaryState } from "../../../type/staffSalary";
import type { Staff } from "../../../type/staff";
import type { BankAccount } from "../../../type/bankAccount";
import type { SalaryType } from "../../../type/salaryType";
import { formatCurrency } from "../../../utils/formatters";

interface EditStaffSalaryProps {
  open: boolean;
  onClose: () => void;
  salary: StaffSalary | null;
  staffList: Staff[];
  bankAccounts: BankAccount[];
  salaryTypes: SalaryType[];
  loadingDropdowns: boolean;
  onSuccess?: () => void;
}

const EditStaffSalary = ({ 
  open, 
  onClose, 
  salary, 
  staffList,
  bankAccounts,
  salaryTypes,
  loadingDropdowns,
  onSuccess 
}: EditStaffSalaryProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { staff_id, bank_account_id, effective_date, amount, salary_type_id, remarks } = useSelector(
    (state: RootState) => state.editStaffSalary
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && salary) {
      const formattedDate = salary.effective_date ? new Date(salary.effective_date).toISOString().split('T')[0] : '';
      
      dispatch(setFormData({
        staff_id: salary.staff_id,
        bank_account_id: salary.bank_account_id,
        effective_date: formattedDate,
        amount: salary.amount,
        salary_type_id: salary.salary_type_id,
        remarks: salary.remarks,
      }));
    }
  }, [open, salary, dispatch]);

  const handleChange = (field: keyof EditStaffSalaryState, value: string) => {
    dispatch(setField({ field, value }));
  };

  const handleSubmit = async () => {
    if (!salary) return;

    // Validation
    if (!staff_id) {
      toast.error("Please select staff", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!bank_account_id) {
      toast.error("Please select bank account", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!effective_date) {
      toast.error("Effective date is required", {
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

    if (!salary_type_id) {
      toast.error("Please select salary type", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        staffId: staff_id,
        bankAccountId: bank_account_id,
        effectiveDate: effective_date,
        amount: amountValue,
        salaryTypeId: salary_type_id,
        remarks: remarks,
      };

      const result = await updateStaffSalaryApi(salary.staff_salary_id, payload);
      
      if (result.success) {
        toast.success(result.message || "Staff salary updated successfully", {
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
      const errorMessage = error?.response?.data?.message || error.message || "Failed to update staff salary";
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
          <span>Edit Staff Salary</span>
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
          <FormControl fullWidth required size="small" disabled={loadingDropdowns}>
            <InputLabel>Staff</InputLabel>
            <Select
              value={staff_id}
              onChange={(e) => handleChange("staff_id", e.target.value)}
              label="Staff"
            >
              {loadingDropdowns ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                  <span style={{ marginLeft: "10px" }}>Loading...</span>
                </MenuItem>
              ) : staffList.length === 0 ? (
                <MenuItem disabled>No active staff available</MenuItem>
              ) : (
                staffList.map((staff) => (
                  <MenuItem key={staff.staff_id} value={staff.staff_id}>
                    {staff.staff_name} - ₹{formatCurrency(staff.salary)}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth required size="small" disabled={loadingDropdowns}>
            <InputLabel>Bank Account</InputLabel>
            <Select
              value={bank_account_id}
              onChange={(e) => handleChange("bank_account_id", e.target.value)}
              label="Bank Account"
            >
              {loadingDropdowns ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                  <span style={{ marginLeft: "10px" }}>Loading...</span>
                </MenuItem>
              ) : bankAccounts.length === 0 ? (
                <MenuItem disabled>No bank accounts available</MenuItem>
              ) : (
                bankAccounts.map((account) => (
                  <MenuItem key={account.bank_account_id} value={account.bank_account_id}>
                    {account.account_name} - {account.account_number}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            label="Effective Date"
            value={effective_date}
            onChange={(e) => handleChange("effective_date", e.target.value)}
            fullWidth
            required
            size="small"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            fullWidth
            required
            size="small"
            type="text"
            inputProps={{ step: "0.01", min: "0" }}
          />

          <FormControl fullWidth required size="small" disabled={loadingDropdowns}>
            <InputLabel>Salary Type</InputLabel>
            <Select
              value={salary_type_id}
              onChange={(e) => handleChange("salary_type_id", e.target.value)}
              label="Salary Type"
            >
              {loadingDropdowns ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                  <span style={{ marginLeft: "10px" }}>Loading...</span>
                </MenuItem>
              ) : salaryTypes.length === 0 ? (
                <MenuItem disabled>No salary types available</MenuItem>
              ) : (
                salaryTypes.map((type) => (
                  <MenuItem key={type.salary_type_id} value={type.salary_type_id}>
                    {type.salary_type}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            label="Remarks"
            value={remarks}
            onChange={(e) => handleChange("remarks", e.target.value)}
            fullWidth
            size="small"
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

export default EditStaffSalary;
