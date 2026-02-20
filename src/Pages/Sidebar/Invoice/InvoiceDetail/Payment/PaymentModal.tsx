import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  IconButton,
  Autocomplete,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import {
  setLoading,
  setBankAccounts,
  setError,
  setPaymentLoading,
  setPaymentError,
} from "./Payment.slice";
import {
  getBankAccountsApi,
  makePaymentApi,
} from "../../../../../service/invoice";
import type { BankAccount, MakePaymentPayload } from "../../../../../type/invoice";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  invoiceId: string;
  totalAmount: string | number;
  balanceAmount?: string | number;
  onPaymentSuccess?: () => void;
}

const PaymentModal = ({
  open,
  onClose,
  invoiceId,
  totalAmount,
  balanceAmount,
  onPaymentSuccess,
}: PaymentModalProps) => {
  const dispatch = useAppDispatch();
  const { bankAccounts, loading, paymentLoading } = useAppSelector(
    (state) => state.payment
  );

  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(
    null
  );
  const [paymentDate, setPaymentDate] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState(false);

  // Set current date on component mount or when modal opens
  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split("T")[0];
      setPaymentDate(today);
      setAmountPaid((balanceAmount ?? totalAmount).toString());
      setStatus(false);
      fetchBankAccounts();
    }
  }, [open, balanceAmount, totalAmount]);

  const fetchBankAccounts = async () => {
    dispatch(setLoading(true));
    try {
      const response = await getBankAccountsApi();
      if (response.success && response.data) {
        dispatch(setBankAccounts(response.data));
      } else {
        dispatch(setError("Failed to fetch bank accounts"));
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch bank accounts";
      dispatch(setError(errorMessage));
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleMakePayment = async () => {
    // Validation
    if (!selectedBankAccount?.bank_account_id) {
      toast.error("Please select a bank account", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!paymentDate) {
      toast.error("Please select a payment date", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!amountPaid || parseFloat(amountPaid) <= 0) {
      toast.error("Please enter a valid amount", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    dispatch(setPaymentLoading(true));
    try {
      const payload: MakePaymentPayload = {
        invoice_id: invoiceId,
        bank_account_id: selectedBankAccount.bank_account_id,
        payment_date: paymentDate,
        amount_paid: parseFloat(amountPaid),
        status,
        remarks: remarks || undefined,
      };

      const response = await makePaymentApi(payload);

      if (response.success) {
        toast.success("Payment made successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        handleClose();
        onPaymentSuccess?.();
      } else {
        dispatch(setPaymentError(response.message || "Failed to make payment"));
        toast.error(response.message || "Failed to make payment", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to make payment";
      dispatch(setPaymentError(errorMessage));
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      dispatch(setPaymentLoading(false));
    }
  };

  const handleClose = () => {
    setSelectedBankAccount(null);
    setPaymentDate("");
    setAmountPaid("");
    setRemarks("");
    setStatus(false);
    onClose();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Make Payment</span>
          <IconButton onClick={handleClose} size="small" sx={{ color: "text.secondary" }}>
            <FiX />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          {/* Bank Account Select */}
          <Box>
            <Autocomplete
              size="small"
              options={bankAccounts}
              getOptionLabel={(option) =>
                typeof option === "string"
                  ? option
                  : `${option.account_name || ""} - ${option.account_number || ""}`
              }
              value={selectedBankAccount}
              onChange={(_, newValue) => setSelectedBankAccount(newValue)}
              disabled={loading}
              isOptionEqualToValue={(option, value) =>
                option.bank_account_id === value?.bank_account_id
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Bank Account"
                  placeholder="Select bank account"
                  required
                  error={!selectedBankAccount}
                />
              )}
              noOptionsText="No bank accounts available"
              loading={loading}
            />
          </Box>

          {/* Payment Date */}
          <Box>
            <TextField
              type="date"
              label="Payment Date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              inputProps={{
                max: today,
              }}
              fullWidth
              required
              error={!paymentDate}
              helperText={!paymentDate ? "Please select a payment date" : ""}
            />
          </Box>

          {/* Amount Paid */}
          <Box>
            <TextField
              type="number"
              label="Amount Paid"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              fullWidth
              required
              inputProps={{
                min: "0",
                step: "0.01",
              }}
              error={!amountPaid || parseFloat(amountPaid) <= 0}
              helperText={
                !amountPaid || parseFloat(amountPaid) <= 0
                  ? "Please enter a valid amount"
                  : ""
              }
            />
          </Box>

          {/* Remarks */}
          <Box>
            <TextField
              label="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Enter payment remarks (optional)"
            />
          </Box>

          {/* Status */}
          <Box>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <RadioGroup
                row
                value={status ? "true" : "false"}
                onChange={(e) => setStatus(e.target.value === "true")}
              >
                <FormControlLabel value="true" control={<Radio />} label="Completed" />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="Not Completed"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleMakePayment}
          variant="contained"
          disabled={paymentLoading}
        >
          {paymentLoading ? <CircularProgress size={20} /> : "Make Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
