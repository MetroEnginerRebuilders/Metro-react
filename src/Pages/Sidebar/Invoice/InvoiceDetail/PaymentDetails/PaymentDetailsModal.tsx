import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import { FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import ConfirmationDialog from "../../../../../Components/ConfirmationDialog";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import {
  setLoading,
  setPaymentDetails,
  setError,
  clearPaymentDetails,
} from "./PaymentDetails.slice";
import { deleteInvoicePaymentApi, getPaymentDetailsApi } from "../../../../../service/invoice";
import { commonTableHeadSx } from "../../../../../utils/tableHeaderStyle";
import { formatCurrency, formatDate } from "../../../../../utils/formatters";

interface PaymentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  invoiceId: string;
}

const PaymentDetailsModal = ({
  open,
  onClose,
  invoiceId,
}: PaymentDetailsModalProps) => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.paymentDetails);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const totalAmountValue = Number(data?.summary?.total_amount ?? 0);

  const fetchPaymentDetails = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await getPaymentDetailsApi(invoiceId);
      if (response.success && response.data) {
        dispatch(setPaymentDetails(response.data));
      } else {
        dispatch(setError("Failed to fetch payment details"));
        toast.error("Failed to fetch payment details", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch payment details";
      dispatch(setError(errorMessage));
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, invoiceId]);

  useEffect(() => {
    if (open && invoiceId) {
      fetchPaymentDetails();
    }
  }, [open, invoiceId, fetchPaymentDetails]);

  const handleDeleteClick = (invoicePaymentId: string) => {
    setPaymentToDelete(invoicePaymentId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!paymentToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await deleteInvoicePaymentApi(paymentToDelete);
      if (response.success) {
        toast.success(response.message || "Invoice payment deleted successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        setDeleteDialogOpen(false);
        setPaymentToDelete(null);
        await fetchPaymentDetails();
      } else {
        toast.error(response.message || "Failed to delete invoice payment", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete invoice payment", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(clearPaymentDetails());
    setDeleteDialogOpen(false);
    setPaymentToDelete(null);
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Payment Details</span>
          <IconButton onClick={handleClose} size="small" sx={{ color: "text.secondary" }}>
            <FiX />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress />
          </Box>
        ) : data ? (
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            {/* Summary Section */}
            <Paper className="p-4 bg-blue-50">
              <Box display="flex" flexWrap="wrap" gap={4}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Payments
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {data.summary.payment_count}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatCurrency(data.summary.total_amount)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Amount Paid
                  </Typography>
                  <Typography variant="h6" sx={{ color: "success.main", fontWeight: 600 }}>
                    {formatCurrency(data.summary.total_paid)}
                  </Typography>
                </Box>
                {totalAmountValue > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Balance Amount
                    </Typography>
                    <Typography variant="h6" sx={{ color: "error.main", fontWeight: 600 }}>
                      {formatCurrency(data.summary.balance_amount)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Payments Table */}
            {data.payments.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead sx={commonTableHeadSx}>
                    <TableRow>
                      <TableCell style={{ fontWeight: "bold" }}>SL NO</TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>Payment Date</TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>Amount Paid</TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>Bank Account</TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>Remarks</TableCell>
                      <TableCell style={{ fontWeight: "bold" }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.payments.map((payment, index) => (
                      <TableRow key={payment.invoice_payment_id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{formatDate(payment.payment_date)}</TableCell>
                        <TableCell sx={{ color: "success.main", fontWeight: 500 }}>
                          {formatCurrency(payment.amount_paid)}
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {payment.account_name || "-"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {payment.account_number || "-"} {payment.bank_name ? `(${payment.bank_name})` : ""}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{payment.remarks || "-"}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Delete">
                            <span>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(payment.invoice_payment_id)}
                                disabled={deleteLoading}
                              >
                                <FiTrash2 />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={200}
              >
                <Typography color="text.secondary">
                  No payment records found
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={300}
          >
            <Typography color="error">Failed to load payment details</Typography>
          </Box>
        )}
      </DialogContent>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Invoice Payment"
        message="Are you sure you want to delete this payment record?"
        confirmText="Delete"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleteLoading) {
            setDeleteDialogOpen(false);
            setPaymentToDelete(null);
          }
        }}
      />
    </Dialog>
  );
};

export default PaymentDetailsModal;
