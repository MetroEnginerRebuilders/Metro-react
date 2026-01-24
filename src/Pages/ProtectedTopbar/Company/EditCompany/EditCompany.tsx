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
import { setField, setFormData, resetForm } from "./EditCompany.slice";
import { updateCompanyApi } from "../../../../service/company";
import type { Company, EditCompanyState } from "../../../../type/company";

interface EditCompanyProps {
  open: boolean;
  onClose: () => void;
  company: Company | null;
}

const EditCompany = ({ open, onClose, company }: EditCompanyProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { company_name, executive_name, executive_phone_number } = useSelector(
    (state: RootState) => state.editCompany
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && company) {
      dispatch(setFormData({
        company_name: company.company_name,
        executive_name: company.executive_name,
        executive_phone_number: company.executive_phone_number,
      }));
    }
  }, [open, company, dispatch]);

  const handleChange = (field: keyof EditCompanyState, value: string) => {
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
    if (!company) return;

    // Validation
    if (!company_name?.trim()) {
      toast.error("Company name is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!executive_name?.trim()) {
      toast.error("Executive name is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!executive_phone_number?.trim()) {
      toast.error("Phone number is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (executive_phone_number.length !== 10) {
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

      const result = await updateCompanyApi(company.company_id, payload);
      
      if (result.success) {
        toast.success(result.message || "Company updated successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(resetForm());
        onClose();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to update company";
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
          <span>Edit Company</span>
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
            required
            size="small"
          />
          <TextField
            label="Phone Number"
            value={executive_phone_number}
            onChange={(e) => handleChange("executive_phone_number", e.target.value)}
            fullWidth
            required
            size="small"
            placeholder="10 digits"
            inputProps={{ maxLength: 10 }}
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

export default EditCompany;
