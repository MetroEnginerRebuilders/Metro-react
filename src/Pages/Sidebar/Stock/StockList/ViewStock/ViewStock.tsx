import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumb from "../../../../../Components/Breadcrumb";
import ConfirmationDialog from "../../../../../Components/ConfirmationDialog";
import { deleteStockItemApi, getStockTransactionDetailsApi } from "../../../../../service/stock";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { commonTableHeadSx } from "../../../../../utils/tableHeaderStyle";
import { openStockPaymentModal } from "../../StockPayment/StockPayment.slice";
import StockPaymentModal from "../../StockPayment/StockPaymentModal";
import StockPaymentDetailsModal from "../../StockPaymentDetails/StockPaymentDetailsModal";
import { resetViewStock, setDetails, setError, setLoading } from "./ViewStock.slice";

function ViewStock() {
  const { stockTransactionId } = useParams<{ stockTransactionId: string }>();
  const dispatch = useAppDispatch();
  const { loading, details } = useAppSelector((state) => state.viewStock);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);

  const fetchDetails = useCallback(async () => {
    if (!stockTransactionId) {
      toast.error("Stock transaction ID is missing");
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await getStockTransactionDetailsApi(stockTransactionId);
      if (response.success && response.data) {
        dispatch(setDetails(response.data));
      } else {
        dispatch(setDetails(null));
        dispatch(setError(response.message || "Failed to fetch stock details"));
        toast.error(response.message || "Failed to fetch stock details");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to fetch stock details";
      dispatch(setDetails(null));
      dispatch(setError(message));
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, stockTransactionId]);

  useEffect(() => {
    fetchDetails();

    return () => {
      dispatch(resetViewStock());
    };
  }, [dispatch, fetchDetails]);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Stock", path: "/stock" },
    { label: "View Stock" },
  ];

  const handlePay = () => {
    const today = new Date().toISOString().split("T")[0];
    const totalAmount = Number(details?.transaction?.total_amount || 0);
    const amountPaid = Number(details?.transaction?.amount_paid || 0);
    const remainingAmount = Math.max(totalAmount - amountPaid, 0);

    dispatch(
      openStockPaymentModal({
        paymentDate: today,
        paymentAmount: remainingAmount.toFixed(2),
      })
    );
  };

  const handlePaymentDetails = () => {
    setPaymentDetailsOpen(true);
  };

  const handleDeleteClick = (stockTransactionItemId: string) => {
    setItemToDelete(stockTransactionItemId);
    setDeleteDialogOpen(true);
  };

  const totalAmount = Number(details?.transaction?.total_amount || 0);
  const amountPaid = Number(details?.transaction?.amount_paid || 0);
  const remainingAmount = Math.max(totalAmount - amountPaid, 0);

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await deleteStockItemApi(itemToDelete);
      if (response.success) {
        toast.success(response.message || "Stock item deleted successfully");
        setDeleteDialogOpen(false);
        setItemToDelete(null);
        await fetchDetails();
      } else {
        toast.error(response.message || "Failed to delete stock item");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete stock item");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography variant="h5" fontWeight={700}>
            VIEW STOCK
          </Typography>
          <Box display="flex" gap={1}>
            <Button variant="contained" onClick={handlePay}>Pay</Button>
            <Button variant="outlined" onClick={handlePaymentDetails}>Payment Details</Button>
          </Box>
        </Box>
      </div>

      <div className="flex-1 px-3 py-3 overflow-auto">
        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress size={32} />
          </Box>
        ) : !details ? (
          <Paper sx={{ p: 3, textAlign: "center" }}>No details found</Paper>
        ) : (
          <>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" fontWeight={700} mb={1.5}>Transaction Details</Typography>
              <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={1.25}>
                <Typography><strong>Shop:</strong> {details.transaction.shop_name || "-"}</Typography>
                <Typography><strong>Type:</strong> {details.transaction.stock_type_name || "-"}</Typography>
                <Typography><strong>Bank Account:</strong> {details.transaction.account_name || "-"}</Typography>
                <Typography><strong>Account Number:</strong> {details.transaction.account_number || "-"}</Typography>
                <Typography><strong>Order Date:</strong> {new Date(details.transaction.order_date).toLocaleDateString()}</Typography>
                <Typography><strong>Payment Status:</strong> {details.transaction.payment_status || "-"}</Typography>
                <Typography><strong>Total Amount:</strong> ₹{Number(details.transaction.total_amount || 0).toFixed(2)}</Typography>
                <Typography><strong>Amount Paid:</strong> ₹{Number(details.transaction.amount_paid || 0).toFixed(2)}</Typography>
                <Typography><strong>Description:</strong> {details.transaction.description || "-"}</Typography>
              </Box>
            </Paper>

            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead sx={commonTableHeadSx}>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>SL NO</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>COMPANY</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>MODEL</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>SPARE</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>QTY</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>PRICE</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>TOTAL</TableCell>
                    <TableCell style={{ fontWeight: "bold" }} align="center">ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">No item details found</TableCell>
                    </TableRow>
                  ) : (
                    details.items.map((item, index) => (
                      <TableRow key={item.stock_transaction_item_id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.company_name || "-"}</TableCell>
                        <TableCell>{item.model_name || "-"}</TableCell>
                        <TableCell>{item.spare_name || "-"}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{Number(item.price || 0).toFixed(2)}</TableCell>
                        <TableCell>₹{Number(item.line_total || 0).toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(item.stock_transaction_item_id)}
                            >
                              <FiTrash2 />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <ConfirmationDialog
              open={deleteDialogOpen}
              title="Delete Stock Item"
              message="Are you sure you want to delete this stock item? This action cannot be undone."
              confirmText="Delete"
              loading={deleteLoading}
              onConfirm={handleConfirmDelete}
              onCancel={() => {
                if (!deleteLoading) {
                  setDeleteDialogOpen(false);
                  setItemToDelete(null);
                }
              }}
            />

            <StockPaymentModal
              stockTransactionId={stockTransactionId || ""}
              remainingAmount={remainingAmount}
              onPaymentSuccess={fetchDetails}
            />

            <StockPaymentDetailsModal
              open={paymentDetailsOpen}
              onClose={() => setPaymentDetailsOpen(false)}
              stockTransactionId={stockTransactionId || ""}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ViewStock;