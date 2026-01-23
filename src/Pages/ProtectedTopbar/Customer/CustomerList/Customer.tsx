import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import type { AppDispatch, RootState } from "../../../../store/store";
import { deleteCustomer, setCustomerList } from "./CustomerList.slice";
import type { Customer as CustomerType } from "../../../../type/customer";
import CreateCustomer from "../CreateCustomer/CreateCustomer";
import ConfirmationDialog from "../../../../Components/ConfirmationDialog";
import CommonPagination from "../../../../Components/CommonPagination";
import Breadcrumb from "../../../../Components/Breadcrumb";
import { getCustomerListApi, deleteCustomerApi } from "../../../../service/customer";
import EditCustomer from "../EditCustomer/EditCustomer";

const Customer = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { list, pagination } = useSelector(
    (state: RootState) => state.customerlist
  );

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerType | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCustomers = async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const response = await getCustomerListApi({
        page,
        limit: 10,
        search: search || undefined
      });
      if (response.success && response.data && response.pagination) {
        dispatch(setCustomerList({ data: response.data, pagination: response.pagination }));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch customers", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCustomers(currentPage, searchTerm);
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchTerm]);

  const handleDeleteClick = (customer: CustomerType) => {
    setCustomerToDelete(customer);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;

    setDeleteLoading(true);
    try {
      const result = await deleteCustomerApi(customerToDelete.customer_id);

      if (result.success) {
        dispatch(deleteCustomer(customerToDelete.customer_id));
        toast.success(result.message || "Customer deleted successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        setOpenDeleteDialog(false);
        setCustomerToDelete(null);
        fetchCustomers(currentPage, searchTerm);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to delete customer";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setCustomerToDelete(null);
  };

  const handleEdit = (customer: CustomerType) => {
    setSelectedCustomer(customer);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedCustomer(null);
    fetchCustomers(currentPage, searchTerm);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    fetchCustomers(currentPage, searchTerm);
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Masterdata", path: "/master" },
    { label: "Customer" }
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Section */}
      <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
          CUSTOMER
        </h1>

        <div className="max-w-full">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center sm:justify-between">
            <TextField
              size="small"
              placeholder="Search Customer"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              sx={{ width: { xs: '100%', sm: '250px' } }}
            />
            <Button variant="contained" onClick={handleOpenModal}>
              Create New
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section - Scrollable */}
      <div className="flex-1 px-3 overflow-auto">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>SL NO</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>CUSTOMER NAME</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>CUSTOMER ID</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>CUSTOMER TYPE</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>ADDRESS</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>PHONE</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                list.map((row: CustomerType, index: number) => {
                  const serialNumber = pagination
                    ? (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1
                    : index + 1;

                  const address = row.customer_address2
                    ? `${row.customer_address1}, ${row.customer_address2}`
                    : row.customer_address1;

                  return (
                    <TableRow
                      hover
                      key={row.customer_id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{serialNumber}</TableCell>
                      <TableCell>{row.customer_name}</TableCell>
                      <TableCell>{row.customer_number || '-'}</TableCell>
                      <TableCell>{row.customer_type_name || '-'}</TableCell>
                      <TableCell>{address}</TableCell>
                      <TableCell>{row.customer_phone_number}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(row)}
                            >
                              <FiEdit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(row)}
                            >
                              <FiTrash2 />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
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

      {/* Create Customer Modal */}
      <CreateCustomer open={openModal} onClose={handleCloseModal} />

      {/* Edit Customer Modal */}
      <EditCustomer
        open={openEditModal}
        onClose={handleCloseEditModal}
        customer={selectedCustomer}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={openDeleteDialog}
        title=""
        message={`Are you sure you want to delete ${customerToDelete?.customer_name}?`}
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
      />
    </div>
  )
}

export default Customer
