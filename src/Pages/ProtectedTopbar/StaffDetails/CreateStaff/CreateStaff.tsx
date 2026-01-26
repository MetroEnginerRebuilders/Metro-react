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
import { setField, resetForm } from "./CreateStaff.slice";
import { createStaffApi } from "../../../../service/staff";
import type { CreateStaffState } from "../../../../type/staff";

interface CreateStaffProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateStaff = ({ open, onClose, onSuccess }: CreateStaffProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { staff_name, salary, active_date } = useSelector(
    (state: RootState) => state.createStaff
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CreateStaffState, value: string) => {
    dispatch(setField({ field, value }));
  };

  const handleSubmit = async () => {
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

    setLoading(true);
    try {
      const payload = {
        staffName: staff_name,
        salary: parseFloat(salary),
        activeDate: active_date,
      };

      const result = await createStaffApi(payload);
      
      if (result.success) {
        toast.success(result.message || "Staff created successfully", {
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
      const errorMessage = error?.response?.data?.message || error.message || "Failed to create staff";
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
          <span>Create Staff</span>
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

export default CreateStaff;
