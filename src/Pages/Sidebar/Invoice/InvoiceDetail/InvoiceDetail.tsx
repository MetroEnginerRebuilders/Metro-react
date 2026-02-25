import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiTrash2, FiPrinter } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumb from "../../../../Components/Breadcrumb";
import AddInvoiceItemsModal from "./AddInvoiceItems/AddInvoiceItemsModal";
import PaymentModal from "./Payment/PaymentModal";
import PaymentDetailsModal from "./PaymentDetails/PaymentDetailsModal";
import { getInvoiceDetailsApi, deleteInvoiceItemApi, downloadInvoicePdfApi, getPaymentDetailsApi } from "../../../../service/invoice";
import { formatCurrency, formatDate, formatInvoiceItemRemarks } from "../../../../utils/formatters";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  setLoading,
  setInvoiceDetails,
  setError,
} from "./InvoiceDetail.slice";
import {
  setDeleteLoading,
  setDeleteError,
} from "./AddInvoiceItems/AddInvoiceItems.slice";

const InvoiceDetailPage = () => {
  const { invoiceId } = useParams();
  const dispatch = useAppDispatch();
  const invoiceDetail = useAppSelector((state) => state.invoiceDetail.detail);
  const loading = useAppSelector((state) => state.invoiceDetail.loading);
  const deleteLoading = useAppSelector((state) => state.addInvoiceItems.deleteLoading);
  const [appliedSearch, setAppliedSearch] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openPaymentDetailsModal, setOpenPaymentDetailsModal] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState<{
    total_amount: number | string;
    total_paid: number | string;
    balance_amount: number | string;
  } | null>(null);

  const fetchInvoiceDetail = async () => {
    if (!invoiceId) return;
    dispatch(setLoading(true));
    try {
      const response = await getInvoiceDetailsApi(invoiceId);
      if (response.success && response.data) {
        dispatch(setInvoiceDetails(response.data));
      } else {
        dispatch(setError("Failed to fetch invoice detail"));
      }

      try {
        const paymentDetailsResponse = await getPaymentDetailsApi(invoiceId);
        if (paymentDetailsResponse.success && paymentDetailsResponse.data?.summary) {
          setPaymentSummary(paymentDetailsResponse.data.summary);
        } else {
          setPaymentSummary(null);
        }
      } catch {
        setPaymentSummary(null);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch invoice detail";
      dispatch(setError(errorMessage));
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchInvoiceDetail();
  }, [invoiceId, dispatch]);

  const items = invoiceDetail?.items || [];

  const filteredItems = useMemo(() => {
    if (!appliedSearch.trim()) return items;
    const term = appliedSearch.toLowerCase();
    return items.filter((item) =>
      formatInvoiceItemRemarks(item).toLowerCase().includes(term)
    );
  }, [items, appliedSearch]);

  const handleOpenAdd = () => {
    setOpenAddModal(true);
  };

  const handleCloseAdd = () => {
    setOpenAddModal(false);
  };

  const handleAddItems = () => {
    // Refresh the invoice detail to get updated total amount from backend
    fetchInvoiceDetail();
  };

  const handleDeleteItem = async (invoiceItemId: string) => {
    if (!invoiceId) return;
    dispatch(setDeleteLoading(true));
    try {
      const response = await deleteInvoiceItemApi(invoiceId, invoiceItemId);
      if (response.success) {
        toast.success("Item deleted successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        // Refresh the invoice detail to update items list and total amount
        await fetchInvoiceDetail();
      } else {
        dispatch(setDeleteError(response.message || "Failed to delete item"));
        toast.error(response.message || "Failed to delete item", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to delete item";
      dispatch(setDeleteError(errorMessage));
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      dispatch(setDeleteLoading(false));
    }
  };

  const handleOpenPayment = () => {
    setOpenPaymentModal(true);
  };

  const handleClosePayment = () => {
    setOpenPaymentModal(false);
  };

  const handlePaymentSuccess = () => {
    // Refresh invoice details after successful payment
    fetchInvoiceDetail();
  };

  const handleOpenPaymentDetails = () => {
    setOpenPaymentDetailsModal(true);
  };

  const handleClosePaymentDetails = () => {
    setOpenPaymentDetailsModal(false);
  };

  const handlePrintInvoice = async () => {
    if (!invoiceId) return;
    setPrintLoading(true);
    try {
      const pdfBlob = await downloadInvoicePdfApi(invoiceId);
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(pdfBlob);
      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoiceDetail?.invoice_number || invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Invoice downloaded successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to download invoice";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setPrintLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Invoice", path: "/invoice" },
    { label: "Invoice Detail" },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex-1 px-3 pb-3 overflow-auto">
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : !invoiceDetail ? (
          <Typography color="error">Failed to load invoice details</Typography>
        ) : (
          <>
        {/* Header Section */}
        <Paper className="p-4 mb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
          <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Invoice Number
              </Typography>
              <Typography variant="h5" className="mb-3 font-bold">
                {invoiceDetail.invoice_number || invoiceDetail.invoice_id}
              </Typography>

              <Box display="flex" gap={3} flexDirection={{ xs: "column", sm: "row" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Invoice Date
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(invoiceDetail.invoice_date)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Job Number
                  </Typography>
                  <Typography variant="body2">
                    {invoiceDetail.job_number || invoiceDetail.job?.job_number || "-"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body2" sx={{ color: "success.main", fontWeight: 500 }}>
                    {invoiceDetail.invoice_status || "-"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box textAlign={{ xs: "left", sm: "right" }} mt={{ xs: 2, sm: 0 }}>
              <Typography variant="caption" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 600 }}>
                {formatCurrency(paymentSummary?.total_amount ?? 0)}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                Total Amount Paid: {formatCurrency(paymentSummary?.total_paid ?? 0)}
              </Typography>
              {parseFloat((paymentSummary?.total_amount ?? 0).toString()) > 0 && (
                <Typography variant="caption" display="block" color="text.secondary">
                  Balance Amount: {formatCurrency(paymentSummary?.balance_amount ?? 0)}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Customer & Job Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <Paper className="px-2 border-l-4 border-blue-500">
            <Typography variant="subtitle2" className="mb-2 font-bold">
              Customer Information
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" gap={2}>
                <Box flex={1}>
                  <Typography variant="caption" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body2">
                    {invoiceDetail.customer?.customer_name || invoiceDetail.customer_name}
                  </Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body2">
                    {invoiceDetail.customer?.customer_phone_number || "-"}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body2">
                  {invoiceDetail.customer?.customer_address1 || "-"}
                  {invoiceDetail.customer?.customer_address2 ? `, ${invoiceDetail.customer.customer_address2}` : ""}
                </Typography>
              </Box>
              
            </Box>
          </Paper>

          <Paper className="p-2 border-l-4 border-indigo-500">
            <Typography variant="subtitle2" className="mb-2 font-bold">
              Job Information
            </Typography>
            <Box display="flex" flexDirection="column">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Received Items
                </Typography>
                <Typography variant="body2">
                  {invoiceDetail.job?.received_items || "-"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body2">
                  {invoiceDetail.job?.description || "-"}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </div>

        <Paper className="p-4 border border-black mt-5">
          <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} mb={2}>
            <Box display="flex" gap={1} alignItems="center">
              <TextField
                size="small"
                placeholder="Search items"
                value={appliedSearch}
                onChange={(e) => setAppliedSearch(e.target.value)}
                sx={{ width: { xs: "100%", sm: "250px" } }}
              />
            </Box>

            <Box display="flex" gap={1} justifyContent={{ xs: "flex-start", sm: "flex-end" }}>
              <Button variant="contained" startIcon={<FiPlus />} onClick={handleOpenAdd}>
                Add Item
              </Button>
              <Tooltip title="Download Invoice PDF">
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<FiPrinter />}
                  onClick={handlePrintInvoice}
                  disabled={printLoading}
                >
                  {printLoading ? "Downloading..." : "Print"}
                </Button>
              </Tooltip>
              <Button
                variant="contained"
                color="info"
                onClick={handleOpenPaymentDetails}
              >
                Payment Details
              </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleOpenPayment}
                >
                  Pay
                </Button>
            </Box>
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>SL NO</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>ITEMS REMARKS</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>QUANTITY</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>UNIT PRICE</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>TOTAL PRICE</TableCell>
                  {invoiceDetail?.invoice_status?.toLowerCase() !== "closed" && (
                  <TableCell align="center" style={{ fontWeight: "bold" }}>ACTIONS</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item, index) => (
                    <TableRow key={item.invoice_item_id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{formatInvoiceItemRemarks(item)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                      <TableCell>{formatCurrency(item.total_price)}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          {invoiceDetail?.invoice_status?.toLowerCase() !== "closed" && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                disabled={deleteLoading}
                                onClick={() => handleDeleteItem(item.invoice_item_id)}
                              >
                                <FiTrash2 />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        </>
        )}
      </div>

      <AddInvoiceItemsModal
        open={openAddModal}
        onClose={handleCloseAdd}
        onAddItems={handleAddItems}
        invoiceId={invoiceId || ""}
      />

      <PaymentModal
        open={openPaymentModal}
        onClose={handleClosePayment}
        invoiceId={invoiceId || ""}
        totalAmount={invoiceDetail?.total_amount || 0}
        balanceAmount={invoiceDetail?.balance_amount}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <PaymentDetailsModal
        open={openPaymentDetailsModal}
        onClose={handleClosePaymentDetails}
        invoiceId={invoiceId || ""}
      />
    </div>
  );
};

export default InvoiceDetailPage;
