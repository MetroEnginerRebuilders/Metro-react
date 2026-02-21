import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";
import SearchableSelect from "../../../../Components/SearchableSelect";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setField, setFormData, resetForm } from "./EditJob.slice";
import { getCustomerListApi } from "../../../../service/customer";
import { getBankAccountListApi } from "../../../../service/bankAccount";
import { getJobApi, updateJobApi } from "../../../../service/job";
import type { Customer } from "../../../../type/customer";
import type { BankAccount } from "../../../../type/bankAccount";
import type { CreateJobState, Job } from "../../../../type/job";

interface EditJobProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  job?: Job | null;
}

const EditJob = ({ open, onClose, onSuccess, job }: EditJobProps) => {
  const dispatch = useAppDispatch();
  const formState = useAppSelector((state) => state.editJob);

  const [loading, setLoading] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [loadingJobData, setLoadingJobData] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    if (open) {
      fetchDropdownData();
      if (job?.job_id) {
        fetchJobData(job.job_id);
      }
    }
  }, [open, job]);

  const fetchDropdownData = async () => {
    setLoadingDropdowns(true);
    try {
      const [customersResponse, accountsResponse] = await Promise.all([
        getCustomerListApi({ page: 1, limit: 100 }),
        getBankAccountListApi({ page: 1, limit: 100 }),
      ]);

      if (customersResponse.success && customersResponse.data) {
        setCustomers(customersResponse.data);
      }

      if (accountsResponse.success && accountsResponse.data) {
        setBankAccounts(accountsResponse.data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load dropdown data", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoadingDropdowns(false);
    }
  };

  const fetchJobData = async (jobId: string) => {
    setLoadingJobData(true);
    try {
      const response = await getJobApi(jobId);
      if (response.success && response.data) {
        const jobData = response.data;
        // Convert ISO date format to YYYY-MM-DD for date input
        const formatDateForInput = (dateString: string): string => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        };
        const formData: CreateJobState = {
          customer_id: jobData.customer_id || "",
          description: jobData.description || "",
          start_date: formatDateForInput(jobData.start_date || ""),
          received_items: jobData.received_items || "",
          advance_amount: jobData.advance_amount?.toString() || "",
          bank_account_id: jobData.bank_account_id || "",
        };
        dispatch(setFormData(formData));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch job data", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoadingJobData(false);
    }
  };

  const customerOptions = useMemo(
    () =>
      customers.map((customer) => ({
        value: customer.customer_id,
        label: customer.customer_name,
      })),
    [customers]
  );

  const bankAccountOptions = useMemo(
    () =>
      bankAccounts.map((account) => ({
        value: account.bank_account_id,
        label: `${account.account_name} - ${account.account_number}`,
      })),
    [bankAccounts]
  );

  const handleChange = (field: keyof CreateJobState, value: string) => {
    dispatch(setField({ field, value }));
  };

  const validateForm = (): boolean => {
    if (!formState.customer_id?.trim()) {
      toast.error("Customer is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    if (!formState.description?.trim()) {
      toast.error("Description is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    if (!formState.start_date?.trim()) {
      toast.error("Start date is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    if (!formState.received_items?.trim()) {
      toast.error("Received items is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    if (!formState.advance_amount?.trim()) {
      toast.error("Advance amount is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    if (!formState.bank_account_id?.trim()) {
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
    if (!job?.job_id) return;

    setLoading(true);
    try {
      const response = await updateJobApi(job.job_id, {
        customerId: formState.customer_id,
        description: formState.description,
        startDate: formState.start_date,
        receivedItems: formState.received_items,
        advanceAmount: formState.advance_amount,
        bankAccountId: formState.bank_account_id,
      });

      if (response.success) {
        toast.success("Job updated successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        handleClose();
        onSuccess?.();
      } else {
        toast.error(response.message || "Failed to update job", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update job", {
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

  const isFormReady = !loadingDropdowns && !loadingJobData && customers.length > 0 && bankAccounts.length > 0;

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Edit Job</span>
          <IconButton onClick={handleClose} size="small" sx={{ color: "text.secondary" }}>
            <FiX />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loadingJobData ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress />
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            {/* Customer Select */}
            <SearchableSelect
              label="Customer"
              options={customerOptions}
              value={formState.customer_id}
              onChange={(value) => handleChange("customer_id", value)}
              disabled={loadingDropdowns}
              required
            />

            {/* Description */}
            <TextField
              label="Description"
              value={formState.description}
              onChange={(e) => handleChange("description", e.target.value)}
              fullWidth
              multiline
              rows={3}
              required
            />

            {/* Start Date */}
            <TextField
              label="Start Date"
              type="date"
              value={formState.start_date}
              onChange={(e) => handleChange("start_date", e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: new Date().toISOString().split("T")[0],
              }}
              required
            />

            {/* Received Items */}
            <TextField
              label="Received Items"
              value={formState.received_items}
              onChange={(e) => handleChange("received_items", e.target.value)}
              fullWidth
              multiline
              rows={3}
              required
            />

            {/* Advance Amount */}
            <TextField
              label="Advance Amount"
              type="number"
              value={formState.advance_amount}
              onChange={(e) => handleChange("advance_amount", e.target.value)}
              fullWidth
              inputProps={{ step: "0.01", min: "0" }}
              required
            />

            {/* Bank Account Select */}
            <SearchableSelect
              label="Bank Account"
              options={bankAccountOptions}
              value={formState.bank_account_id}
              onChange={(value) => handleChange("bank_account_id", value)}
              disabled={loadingDropdowns}
              required
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || loadingJobData || !isFormReady}
        >
          {loading ? <CircularProgress size={20} /> : "Update Job"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditJob;
