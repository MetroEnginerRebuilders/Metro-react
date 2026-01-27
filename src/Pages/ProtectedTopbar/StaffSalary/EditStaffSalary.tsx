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

import type { AppDispatch, RootState } from "../../../store/store";
import { setField, setFormData, resetForm } from "./EditStaffSalary.slice";
import { updateStaffSalaryApi } from "../../../service/staffSalary";
import type { StaffSalary, EditStaffSalaryState } from "../../../type/staffSalary";
import type { Staff } from "../../../type/staff";
import type { BankAccount } from "../../../type/bankAccount";
import type { SalaryType } from "../../../type/salaryType";
import SearchableSelect from "../../../Components/SearchableSelect";

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

  // Prepare options for SearchableSelect
  const staffOptions = useMemo(() => 
    staffList.map((staff) => ({
      value: staff.staff_id,
      label: staff.staff_name,
    })),
    [staffList]
  );

  const bankAccountOptions = useMemo(() =>
    bankAccounts.map((account) => ({
      value: account.bank_account_id,
      label: `${account.account_name} - ${account.account_number}`,
    })),
    [bankAccounts]
  );

  const salaryTypeOptions = useMemo(() =>
    salaryTypes.map((type) => ({
      value: type.salary_type_id,
      label: type.salary_type,
    })),
    [salaryTypes]
  );

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
          <SearchableSelect
            label="Staff"
            value={staff_id}
            onChange={(value) => handleChange("staff_id", value)}
            options={staffOptions}
            loading={loadingDropdowns}
            disabled={loadingDropdowns}
            required
            size="small"
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

          <SearchableSelect
            label="Salary Type"
            value={salary_type_id}
            onChange={(value) => handleChange("salary_type_id", value)}
            options={salaryTypeOptions}
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
