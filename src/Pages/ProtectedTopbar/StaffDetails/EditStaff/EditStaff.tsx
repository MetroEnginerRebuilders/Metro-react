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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";

import type { AppDispatch, RootState } from "../../../../store/store";
import { setField, setFormData, resetForm } from "./EditStaff.slice";
import { updateStaffApi } from "../../../../service/staff";
import type { Staff, EditStaffState } from "../../../../type/staff";

interface EditStaffProps {
  open: boolean;
  onClose: () => void;
  staff: Staff | null;
  onSuccess?: () => void;
}

const EditStaff = ({ open, onClose, staff, onSuccess }: EditStaffProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { staff_name, salary, active_date, inactive_date } = useSelector(
    (state: RootState) => state.editStaff
  );

  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (open && staff) {
      // Format the dates to YYYY-MM-DD for the date input
      const formattedActiveDate = staff.active_date ? new Date(staff.active_date).toISOString().split('T')[0] : '';
      const formattedInactiveDate = staff.inactive_date ? new Date(staff.inactive_date).toISOString().split('T')[0] : '';
      
      dispatch(setFormData({
        staff_name: staff.staff_name,
        salary: staff.salary,
        active_date: formattedActiveDate || today,
        inactive_date: formattedInactiveDate,
      }));
    }
  }, [open, staff, dispatch, today]);

  const handleChange = (field: keyof EditStaffState, value: string) => {
    dispatch(setField({ field, value }));
  };

  const handleSubmit = async () => {
    if (!staff) return;

    // Validation
    if (!staff_name?.trim()) {
      toast.error("Staff name is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!salary?.trim()) {
      toast.error("Salary is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (isNaN(parseFloat(salary))) {
      toast.error("Salary must be a valid number", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!active_date) {
      toast.error("Active date is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (active_date > today) {
      toast.error("Active date cannot be in the future", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (inactive_date?.trim() && inactive_date > today) {
      toast.error("Inactive date cannot be in the future", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        staffName: staff_name,
        salary: parseFloat(salary),
        activeDate: active_date,
      };

      // Only include inactiveDate if it has a value
      if (inactive_date?.trim()) {
        payload.inactiveDate = inactive_date;
      }

      const result = await updateStaffApi(staff.staff_id, payload);
      
      if (result.success) {
        toast.success(result.message || "Staff updated successfully", {
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
      const errorMessage = error?.response?.data?.message || error.message || "Failed to update staff";
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
          <span>Edit Staff</span>
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
            label="Staff Name"
            value={staff_name}
            onChange={(e) => handleChange("staff_name", e.target.value)}
            fullWidth
            required
            size="small"
          />
          <TextField
            label="Salary"
            value={salary}
            onChange={(e) => handleChange("salary", e.target.value)}
            fullWidth
            required
            size="small"
            type="number"
            inputProps={{ step: "0.01", min: "0" }}
          />
          <TextField
            label="Active Date"
            value={active_date}
            onChange={(e) => handleChange("active_date", e.target.value)}
            fullWidth
            required
            size="small"
            type="date"
            inputProps={{
              max: today,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Inactive Date"
            value={inactive_date}
            onChange={(e) => handleChange("inactive_date", e.target.value)}
            fullWidth
            size="small"
            type="date"
            inputProps={{
              max: today,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Optional: Set this date to mark staff as inactive"
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

export default EditStaff;
