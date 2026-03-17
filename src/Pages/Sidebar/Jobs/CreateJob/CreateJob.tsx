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
import { setField, resetForm } from "./CreateJob.slice";
import { getCustomerListApi } from "../../../../service/customer";
import { getActiveBankAccountListApi } from "../../../../service/bankAccount";
import { createJobApi } from "../../../../service/job";
import type { Customer } from "../../../../type/customer";
import type { BankAccount } from "../../../../type/bankAccount";
import type { CreateJobState } from "../../../../type/job";

interface CreateJobProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateJob = ({ open, onClose, onSuccess }: CreateJobProps) => {
  const dispatch = useAppDispatch();
  const formState = useAppSelector((state) => state.createJob);

  const [loading, setLoading] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    if (open) {
      fetchDropdownData();
      if (!formState.start_date) {
        const today = new Date().toISOString().split("T")[0];
        dispatch(setField({ field: "start_date", value: today }));
      }
    }
  }, [open, dispatch, formState.start_date]);

  const fetchDropdownData = async () => {
    setLoadingDropdowns(true);
    try {
      const fetchAllCustomers = async (): Promise<Customer[]> => {
        const limit = 200;
        const firstPageResponse = await getCustomerListApi({ page: 1, limit });

        if (!firstPageResponse.success || !firstPageResponse.data) {
          return [];
        }

        const totalPages = firstPageResponse.pagination?.totalPages || 1;
        const allCustomers = [...firstPageResponse.data];

        if (totalPages > 1) {
          const remainingRequests = Array.from({ length: totalPages - 1 }, (_, index) =>
            getCustomerListApi({ page: index + 2, limit })
          );

          const remainingResponses = await Promise.all(remainingRequests);
          remainingResponses.forEach((response) => {
            if (response.success && response.data) {
              allCustomers.push(...response.data);
            }
          });
        }

        const uniqueCustomers = Array.from(
          new Map(allCustomers.map((customer) => [String(customer.customer_id), customer])).values()
        );

        return uniqueCustomers;
      };

      const [allCustomers, accountsResponse] = await Promise.all([
        fetchAllCustomers(),
        getActiveBankAccountListApi(),
      ]);

      setCustomers(allCustomers);

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

  const customerOptions = useMemo(
    () =>
      customers.map((customer) => ({
        value: String(customer.customer_id),
        label: customer.customer_name,
      })),
    [customers]
  );

  const bankAccountOptions = useMemo(
    () =>
      bankAccounts.map((account) => ({
        value: account.bank_account_id,
        label: (account.account_number || "").trim()
          ? `${account.account_name} - ${account.account_number}`
          : account.account_name,
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

    if (formState.advance_amount?.trim()) {
      if (isNaN(parseFloat(formState.advance_amount))) {
        toast.error("Advance amount must be a valid number", {
          position: "top-center",
          autoClose: 3000,
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        customerId: formState.customer_id,
        description: formState.description,
        startDate: formState.start_date,
        receivedItems: formState.received_items,
        advanceAmount: formState.advance_amount,
        bankAccountId: formState.bank_account_id,
      };

      const result = await createJobApi(payload);

      if (result.success) {
        toast.success(result.message || "Job created successfully", {
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
      const errorMessage = error?.response?.data?.message || error.message || "Failed to create job";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <span>Create Job</span>
          <IconButton
            onClick={onClose}
            disabled={loading}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <FiX />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <SearchableSelect
            label="Customer"
            value={formState.customer_id}
            onChange={(value) => handleChange("customer_id", value)}
            options={customerOptions}
            loading={loadingDropdowns}
            disabled={loadingDropdowns}
            required
            size="small"
          />

          <TextField
            label="Job Description"
            value={formState.description}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
            size="small"
            multiline
            rows={2}
          />

          <TextField
            label="Start Date"
            type="date"
            value={formState.start_date}
            onChange={(e) => handleChange("start_date", e.target.value)}
            fullWidth
            required
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              max: new Date().toISOString().split("T")[0],
            }}
          />

          <TextField
            label="Received Items"
            value={formState.received_items}
            onChange={(e) => handleChange("received_items", e.target.value)}
            fullWidth
            required
            size="small"
            multiline
            rows={2}
          />

          <TextField
            label="Advance Amount"
            type="text"
            value={formState.advance_amount}
            onChange={(e) => handleChange("advance_amount", e.target.value)}
            fullWidth
            size="small"
            inputProps={{ min: 0, step: "0.01" }}
          />

          <SearchableSelect
            label="Bank Account"
            value={formState.bank_account_id}
            onChange={(value) => handleChange("bank_account_id", value)}
            options={bankAccountOptions}
            loading={loadingDropdowns}
            disabled={loadingDropdowns}
            size="small"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateJob;
