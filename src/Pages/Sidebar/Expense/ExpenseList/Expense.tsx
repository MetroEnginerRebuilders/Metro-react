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
import { deleteExpense, setExpenseList } from "./ExpenseList.slice";
import type { Expense as ExpenseType } from "../../../../type/expense";
import CreateExpense from "../CreateExpense/CreateExpense";
import ConfirmationDialog from "../../../../Components/ConfirmationDialog";
import CommonPagination from "../../../../Components/CommonPagination";
import Breadcrumb from "../../../../Components/Breadcrumb";
import { getExpenseListApi, deleteExpenseApi } from "../../../../service/expense";
import { getExpenseCategoryListApi } from "../../../../service/expenseCategory";
import EditExpense from "../EditExpense/EditExpense";
import { commonTableHeadSx } from "../../../../utils/tableHeaderStyle";
import { formatCurrency, formatDate } from "../../../../utils/formatters";
import type { ExpenseCategory } from "../../../../type/expenseCategory";
import SearchableSelect from "../../../../Components/SearchableSelect";

const Expense = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { list, pagination } = useSelector(
    (state: RootState) => state.expenseList
  );

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseType | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseType | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const fetchExpenses = async (page: number = 1, search?: string, financeCategoryName?: string) => {
    setLoading(true);
    try {
      const response = await getExpenseListApi({
        page,
        limit: 10,
        search: search || undefined,
        financeCategoryName: financeCategoryName || undefined,
        financeTypeCode: "EXPENSE"
      });
      if (response.success && response.data && response.pagination) {
        // Map backend pagination fields to frontend expected fields
        const mappedPagination = {
          currentPage: Number(response.pagination.currentPage) || page,
          totalPages: Number(response.pagination.totalPages) || 1,
          totalItems: response.pagination.totalItems || 0,
          itemsPerPage: Number(response.pagination.itemsPerPage) || 10,
          hasNextPage: response.pagination.hasNextPage,
          hasPreviousPage: response.pagination.hasPreviousPage
        };
        dispatch(setExpenseList({ data: response.data, pagination: mappedPagination }));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch expense records", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenseCategories = async () => {
    try {
      const response = await getExpenseCategoryListApi();
      if (response.success && response.data) {
        setExpenseCategories(response.data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch expense categories", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchExpenseCategories();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchExpenses(currentPage, searchTerm, selectedCategoryName);
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchTerm, selectedCategoryName]);

  const handleDeleteClick = (expense: ExpenseType) => {
    setExpenseToDelete(expense);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;

    setDeleteLoading(true);
    try {
      const result = await deleteExpenseApi(expenseToDelete.finance_id, "EXPENSE");

      if (result.success) {
        dispatch(deleteExpense(expenseToDelete.finance_id));
        toast.success(result.message || "Expense deleted successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        setOpenDeleteDialog(false);
        setExpenseToDelete(null);
        fetchExpenses(currentPage, searchTerm, selectedCategoryName);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to delete expense";
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
    setExpenseToDelete(null);
  };

  const handleEdit = (expense: ExpenseType) => {
    setSelectedExpense(expense);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedExpense(null);
    fetchExpenses(currentPage, searchTerm, selectedCategoryName);
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
    fetchExpenses(currentPage, searchTerm, selectedCategoryName);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryName(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const expenseCategoryOptions = [
    { value: "", label: "All Categories" },
    ...expenseCategories.map((category) => ({
      value: category.finance_category_name,
      label: category.finance_category_name,
    })),
  ];

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Expense" }
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Section */}
      <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
          EXPENSE
        </h1>

        <div className="max-w-full">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div style={{ width: "250px", maxWidth: "100%" }}>
                <SearchableSelect
                  label="Expense Category"
                  value={selectedCategoryName}
                  onChange={handleCategoryChange}
                  options={expenseCategoryOptions}
                  size="small"
                />
              </div>
              <TextField
                size="small"
                placeholder="Search Expense"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                sx={{ width: { xs: '100%', sm: '250px' } }}
              />
            </div>
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
            <TableHead sx={commonTableHeadSx}>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>SL NO</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>EXPENSE CATEGORY</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>TRANSACTION DATE</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>TOTAL PRICE</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>DESCRIPTION</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>ACCOUNT NAME</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>AMOUNT PAID</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>REMARKS</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold' }}>ACTIONS</TableCell>
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
                list.map((row: ExpenseType, index: number) => {
                  const pageNumber = Number(pagination?.currentPage) || 1;
                  const pageSize = Number(pagination?.itemsPerPage) || 10;
                  const serialNumber = pagination
                    ? (pageNumber - 1) * pageSize + index + 1
                    : index + 1;

                  return (
                    <TableRow
                      hover
                      key={row.finance_id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{serialNumber}</TableCell>
                      <TableCell>{row.finance_category_name || '-'}</TableCell>
                      <TableCell>{formatDate(row.transaction_date)}</TableCell>
                      <TableCell>{formatCurrency(row.amount)}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.account_name || '-'}</TableCell>
                      <TableCell>{formatCurrency(row.amount)}</TableCell>
                      <TableCell>{row.remarks || '-'}</TableCell>
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

      {/* Create Expense Modal */}
      <CreateExpense open={openModal} onClose={handleCloseModal} />

      {/* Edit Expense Modal */}
      <EditExpense
        open={openEditModal}
        onClose={handleCloseEditModal}
        expense={selectedExpense}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={openDeleteDialog}
        title=""
        message={`Are you sure you want to delete this expense record?`}
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
      />
    </div>
  )
}

export default Expense
