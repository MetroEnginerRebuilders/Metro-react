import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableHead, TableRow, Typography, Paper,
} from "@mui/material";
import { FiX } from "react-icons/fi";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { getStockPaymentDetailsApi } from "../../../../service/stock";
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

    useEffect(() => {
        const fetchPaymentDetails = async () => {
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
            }
        };

        fetchPaymentDetails();
    }, [dispatch, open, stockTransactionId]);

    const handleClose = () => {
        dispatch(clearPaymentDetails());
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
        </Dialog>
    );
}

export default StockPaymentDetailsModal;