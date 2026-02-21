import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
  Link,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "../../../store/store";
import { setInvoiceList } from "./Invoice.slice";
import type { Invoice as InvoiceType } from "../../../type/invoice";
import Breadcrumb from "../../../Components/Breadcrumb";
import CommonPagination from "../../../Components/CommonPagination";
import { getInvoiceListApi } from "../../../service/invoice";
import { formatCurrency, formatDate } from "../../../utils/formatters";

const Invoice = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { list, pagination } = useSelector(
    (state: RootState) => state.invoiceList
  );

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInvoices = async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const response = await getInvoiceListApi({
        page,
        limit: 10,
        search: search || undefined,
      });
      if (response.success && response.data && response.pagination) {
        dispatch(setInvoiceList({ data: response.data, pagination: response.pagination }));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch invoices", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchInvoices(currentPage, searchTerm);
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Invoice" },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Section */}
      <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
          INVOICE
        </h1>

        <div className="max-w-full">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center sm:justify-between">
            <TextField
              size="small"
              placeholder="Search Invoice"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              sx={{ width: { xs: "100%", sm: "250px" } }}
            />
          </div>
        </div>
      </div>

      {/* Table Section - Scrollable */}
      <div className="flex-1 px-3 overflow-auto">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="invoice list">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>SL NO</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>INVOICE NO</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>JOB NO</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>CUSTOMER NAME</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>INVOICE DATE</TableCell>
                <TableCell style={{ fontWeight: "bold" }}> AMOUNT</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>STATUS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                list.map((row: InvoiceType, index: number) => {
                  const serialNumber = pagination
                    ? (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1
                    : index + 1;

                  return (
                    <TableRow
                      hover
                      key={row.invoice_id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{serialNumber}</TableCell>
                      <TableCell>
                        <Link
                          component="button"
                          onClick={() => navigate(`/invoice/${row.invoice_id}`)}
                          sx={{ color: "primary.main", fontWeight: 500 }}
                        >
                          {row.invoice_number || row.invoice_id}
                        </Link>
                      </TableCell>
                      <TableCell>{row.job_number}</TableCell>
                      <TableCell>{row.customer_name}</TableCell>
                      <TableCell>{formatDate(row.invoice_date)}</TableCell>
                      <TableCell>{formatCurrency(row.total_amount)}</TableCell>
                      <TableCell>{row.invoice_status || "-"}</TableCell>
                     
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Pagination - Fixed at bottom */}
      {pagination && (
        <div className="flex-shrink-0 px-3 pb-3">
          <CommonPagination
            mode="server"
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Invoice;
