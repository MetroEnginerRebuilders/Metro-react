import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    CircularProgress,
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableHead, TableRow, Typography, Paper,
} from "@mui/material";
import { FiTrash2, FiX } from "react-icons/fi";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmationDialog from "../../../../Components/ConfirmationDialog";
import { deleteStockPaymentApi, getStockPaymentDetailsApi } from "../../../../service/stock";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { commonTableHeadSx } from "../../../../utils/tableHeaderStyle";
import { formatCurrency, formatDate } from "../../../../utils/formatters";
import {
    clearPaymentDetails,
    setError,
    setLoading,
    setPaymentDetails,
} from "./StockPaymentDetails.slice";

interface StockPaymentDetailsModalProps {
    open: boolean;
    onClose: () => void;
    stockTransactionId: string;
    isReturnStock?: boolean;
}
function StockPaymentDetailsModal({ open, onClose, stockTransactionId, isReturnStock = false }: StockPaymentDetailsModalProps) {
    const dispatch = useAppDispatch();
    const { data, loading } = useAppSelector((state) => state.stockPaymentDetails);
    const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchPaymentDetails = useCallback(async () => {
        if (!open || !stockTransactionId) return;

        dispatch(setLoading(true));
        try {
            const response = await getStockPaymentDetailsApi(stockTransactionId);
            if (response.success && response.data) {
                dispatch(setPaymentDetails(response.data));
            } else {
                const message = response.message || "Failed to fetch stock payment details";
                dispatch(setError(message));
                toast.error(message);
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || "Failed to fetch stock payment details";
            dispatch(setError(message));
            toast.error(message);
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, open, stockTransactionId]);

    useEffect(() => {
        fetchPaymentDetails();
    }, [fetchPaymentDetails]);

    const handleDeleteClick = (stockPaymentId: string) => {
        setPaymentToDelete(stockPaymentId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!paymentToDelete) return;

        setDeleteLoading(true);
        try {
            const response = await deleteStockPaymentApi(paymentToDelete);
            if (response.success) {
                toast.success(response.message || "Stock payment deleted successfully");
                setDeleteDialogOpen(false);
                setPaymentToDelete(null);
                await fetchPaymentDetails();
            } else {
                toast.error(response.message || "Failed to delete stock payment");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to delete stock payment");
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

    const totalAmountValue = Number(data?.summary?.total_amount ?? 0);

    return (
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <span>Stock Payment Details</span>
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
                                        {isReturnStock ? "Credit Amount" : "Total Amount"}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {formatCurrency(data.summary.total_amount)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {isReturnStock ? "Amount Get" : "Total Amount Paid"}
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

                        {data.payments.length > 0 ? (
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead sx={commonTableHeadSx}>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: "bold" }}>SL NO</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>Payment Date</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>{isReturnStock ? "Amount Get" : "Amount Paid"}</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>Bank Account</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }}>Remarks</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }} align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.payments.map((payment, index) => (
                                            <TableRow key={payment.stock_payment_id} hover>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{formatDate(payment.payment_on)}</TableCell>
                                                <TableCell sx={{ color: "success.main", fontWeight: 500 }}>
                                                    {formatCurrency(payment.amount_paid)}
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2">{payment.account_name || "-"}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {payment.account_number || "-"}
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
                                                                onClick={() => handleDeleteClick(payment.stock_payment_id)}
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
                            <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                                <Typography color="text.secondary">No payment records found</Typography>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                        <Typography color="error">Failed to load payment details</Typography>
                    </Box>
                )}
            </DialogContent>

            <ConfirmationDialog
                open={deleteDialogOpen}
                title="Delete Stock Payment"
                message="Are you sure you want to delete this stock payment?"
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
}

export default StockPaymentDetailsModal;