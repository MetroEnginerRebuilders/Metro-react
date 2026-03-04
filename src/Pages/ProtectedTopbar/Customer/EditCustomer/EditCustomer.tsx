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
import { setField, setCustomerData, resetForm } from "./EditCustomer.slice";
import { updateCustomerApi } from "../../../../service/customer";
import { getCustomerTypeListApi } from "../../../../service/customerType";
import type { CustomerType } from "../../../../type/customerType";
import type { Customer, EditCustomerState } from "../../../../type/customer";
import SearchableSelect from "../../../../Components/SearchableSelect";

interface EditCustomerProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
}

const EditCustomer = ({ open, onClose, customer }: EditCustomerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { customer_name, customer_address1, customer_address2, customer_phone_number, customer_type_id } = useSelector(
    (state: RootState) => state.editCustomer
  );

  const [loading, setLoading] = useState(false);
  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  useEffect(() => {
    if (open && customer) {
      dispatch(setCustomerData(customer));
      fetchCustomerTypes();
    }
  }, [open, customer, dispatch]);

  const fetchCustomerTypes = async () => {
    setLoadingTypes(true);
    try {
      const response = await getCustomerTypeListApi();
      if (response.success && response.data) {
        setCustomerTypes(response.data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch customer types", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleChange = (field: keyof EditCustomerState, value: string | number) => {
    dispatch(setField({ field, value }));
  };

  // Prepare options for SearchableSelect
  const customerTypeOptions = useMemo(() =>
    customerTypes.map((type) => ({
      value: type.customer_type_id,
      label: type.customer_type_name,
    })),
    [customerTypes]
  );

  const validatePhoneNumber = (phone: string): boolean => {
    // Basic validation: only digits, 10-15 characters
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async () => {
    if (!customer) return;

    // Validation
    if (!customer_name?.trim()) {
      toast.error("Customer name is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!customer_address1?.trim()) {
      toast.error("Address 1 is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!customer_phone_number?.trim()) {
      toast.error("Phone number is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!validatePhoneNumber(customer_phone_number)) {
      toast.error("Please enter a valid phone number (10-15 digits)", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!customer_type_id) {
      toast.error("Customer type is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerName: customer_name,
        customerAddress1: customer_address1,
        customerAddress2: customer_address2 || "",
        customerPhoneNumber: customer_phone_number,
        customerTypeId: customer_type_id,
      };

      const result = await updateCustomerApi(customer.customer_id, payload);
      
      if (result.success) {
        toast.success(result.message || "Customer updated successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(resetForm());
        onClose();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to update customer";
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
          <span>Edit Customer</span>
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
            label="Customer Name"
            value={customer_name}
            onChange={(e) => handleChange("customer_name", e.target.value)}
            fullWidth
            required
            size="small"
          />

          <SearchableSelect
            label="Customer Type"
            value={customer_type_id !== null ? customer_type_id.toString() : ""}
            onChange={(value) => handleChange("customer_type_id", value)}
            options={customerTypeOptions}
            loading={loadingTypes}
            disabled={loadingTypes}
            required
            size="small"
          />

          <TextField
            label="Address 1"
            value={customer_address1}
            onChange={(e) => handleChange("customer_address1", e.target.value)}
            fullWidth
            required
            size="small"
            multiline
            rows={2}
          />

          <TextField
            label="Address 2"
            value={customer_address2}
            onChange={(e) => handleChange("customer_address2", e.target.value)}
            fullWidth
            size="small"
            multiline
            rows={2}
          />

          <TextField
            label="Phone Number"
            value={customer_phone_number}
            onChange={(e) => handleChange("customer_phone_number", e.target.value)}
            fullWidth
            required
            size="small"
            placeholder="10-15 digits"
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

export default EditCustomer;
