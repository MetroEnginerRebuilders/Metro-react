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
import { setField, resetForm } from "./CreateCompany.slice";
import { createCompanyApi } from "../../../../service/company";
import type { CreateCompanyState } from "../../../../type/company";

interface CreateCompanyProps {
  open: boolean;
  onClose: () => void;
}

const CreateCompany = ({ open, onClose }: CreateCompanyProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { company_name, executive_name, executive_phone_number } = useSelector(
    (state: RootState) => state.createCompany
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CreateCompanyState, value: string) => {
    // Validate phone number: only digits and max 10 characters
    if (field === 'executive_phone_number') {
      if (value && !/^\d*$/.test(value)) {
        return; // Ignore non-numeric input
      }
      if (value.length > 10) {
        return; // Ignore if more than 10 digits
      }
    }
    dispatch(setField({ field, value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!company_name?.trim()) {
      toast.error("Company name is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (executive_phone_number?.trim() && executive_phone_number.length !== 10) {
      toast.error("Phone number must be exactly 10 digits", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        companyName: company_name,
        executiveName: executive_name,
        executivePhoneNumber: executive_phone_number,
      };

      const result = await createCompanyApi(payload);
      
      if (result.success) {
        toast.success(result.message || "Company created successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(resetForm());
        onClose();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to create company";
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
          <span>Create Company</span>
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
            label="Company Name"
            value={company_name}
            onChange={(e) => handleChange("company_name", e.target.value)}
            fullWidth
            required
            size="small"
          />
          <TextField
            label="Executive Name"
            value={executive_name}
            onChange={(e) => handleChange("executive_name", e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Phone Number"
            value={executive_phone_number}
            onChange={(e) => handleChange("executive_phone_number", e.target.value)}
            fullWidth
            size="small"
            placeholder="10 digits"
            inputProps={{ maxLength: 10 }}
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

export default CreateCompany;
