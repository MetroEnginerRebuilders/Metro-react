import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, type ChangeEvent } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import SearchableSelect from "../../../../Components/SearchableSelect";
import { getActiveBankAccountListApi } from "../../../../service/bankAccount";
import { makeStockPaymentApi } from "../../../../service/stock";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  closeStockPaymentModal,
  setBankAccounts,
  setLoadingBankAccounts,
  setPaymentError,
  setPaymentField,
  setPaymentLoading,
} from "./StockPayment.slice";

interface StockPaymentModalProps {
  stockTransactionId: string;
  remainingAmount: number;
  onPaymentSuccess?: () => Promise<void> | void;
}

function StockPaymentModal({ stockTransactionId, remainingAmount, onPaymentSuccess }: StockPaymentModalProps) {
  const dispatch = useAppDispatch();
  const {
    open,
    bankAccounts,
    loadingBankAccounts,
    paymentLoading,
    selectedBankAccountId,
    paymentDate,
    paymentAmount,
    remarks,
  } = useAppSelector((state) => state.stockPayment);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      if (!open) return;

      dispatch(setLoadingBankAccounts(true));
      try {
        const response = await getActiveBankAccountListApi();
        if (response.success && response.data) {
          dispatch(setBankAccounts(response.data));
        } else {
          const message = response.message || "Failed to fetch bank accounts";
          dispatch(setPaymentError(message));
          toast.error(message);
        }
      } catch (error: any) {
        const message = error?.response?.data?.message || "Failed to fetch bank accounts";
        dispatch(setPaymentError(message));
        toast.error(message);
      } finally {
        dispatch(setLoadingBankAccounts(false));
      }
    };

    fetchBankAccounts();
  }, [dispatch, open]);

  const handlePay = async () => {
    if (!selectedBankAccountId) {
      toast.error("Please select a bank account");
      return;
    }

    if (!paymentDate) {
      toast.error("Please select payment date");
      return;
    }

    const amountValue = Number(paymentAmount);
    if (!paymentAmount || Number.isNaN(amountValue) || amountValue <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (amountValue > remainingAmount) {
      toast.error("Payment amount cannot exceed remaining amount");
      return;
    }

    dispatch(setPaymentLoading(true));
    try {
      const response = await makeStockPaymentApi({
        stockTransactionId,
        bankAccountId: selectedBankAccountId,
        amountPaid: amountValue,
        paymentDate,
        remarks: remarks || undefined,
      });

      if (!response.success) {
        const message = response.message || "Failed to add stock payment";
        dispatch(setPaymentError(message));
        toast.error(message);
        return;
      }

      toast.success(response.message || "Stock payment added successfully");
      dispatch(closeStockPaymentModal());
      await onPaymentSuccess?.();
      dispatch(setPaymentError(null));
      dispatch(setPaymentField({ field: "remarks", value: "" }));
    } finally {
      dispatch(setPaymentLoading(false));
    }
  };

  const bankAccountOptions = bankAccounts.map((account) => ({
    value: account.bank_account_id,
    label: (account.account_number || "").trim()
      ? `${account.account_name} - ${account.account_number}`
      : account.account_name,
  }));

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Pay Stock</span>
          <IconButton
            onClick={() => dispatch(closeStockPaymentModal())}
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
            label="Bank Account"
            value={selectedBankAccountId}
            onChange={(value) => dispatch(setPaymentField({ field: "selectedBankAccountId", value }))}
            options={bankAccountOptions}
            loading={loadingBankAccounts}
            disabled={loadingBankAccounts}
            required
          />

          <TextField
            label="Payment Date"
            type="date"
            value={paymentDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              dispatch(setPaymentField({ field: "paymentDate", value: e.target.value }))
            }
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: today }}
            fullWidth
            required
          />

          <TextField
            label="Payment Amount"
            type="number"
            value={paymentAmount}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              dispatch(setPaymentField({ field: "paymentAmount", value: e.target.value }))
            }
            fullWidth
            required
            inputProps={{ min: "0", step: "0.01" }}
            helperText={`Remaining amount: ₹${remainingAmount.toFixed(2)}`}
          />

          <TextField
            label="Remarks"
            value={remarks}
            onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              dispatch(setPaymentField({ field: "remarks", value: e.target.value }))
            }
            multiline
            rows={3}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handlePay} disabled={paymentLoading}>
          {paymentLoading ? <CircularProgress size={20} /> : "Pay"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StockPaymentModal;