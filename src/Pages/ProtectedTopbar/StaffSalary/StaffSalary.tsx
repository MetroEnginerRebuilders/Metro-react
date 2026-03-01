import {
  Button,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import type { AppDispatch, RootState } from "../../../store/store";
import { deleteStaffSalary, setStaffSalaryList } from "./StaffSalaryList.slice";
import type { StaffSalary as StaffSalaryType } from "../../../type/staffSalary";
import type { Staff } from "../../../type/staff";
import type { BankAccount } from "../../../type/bankAccount";
import type { SalaryType } from "../../../type/salaryType";
import ConfirmationDialog from "../../../Components/ConfirmationDialog";
import Breadcrumb from "../../../Components/Breadcrumb";
import { getStaffSalaryListApi, deleteStaffSalaryApi } from "../../../service/staffSalary";
import { getActiveStaffListApi } from "../../../service/staff";
import { getBankAccountListApi } from "../../../service/bankAccount";
import { getSalaryTypeListApi } from "../../../service/salaryType";
import CommonPagination from "../../../Components/CommonPagination";
import EditStaffSalary from "./EditStaffSalary";
import { commonTableHeadSx } from "../../../utils/tableHeaderStyle";
import { formatDate, formatCurrency } from "../../../utils/formatters";

function StaffSalary() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { list, pagination } = useSelector(
    (state: RootState) => state.staffSalaryList
  );

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<StaffSalaryType | null>(null);
  const [salaryToDelete, setSalaryToDelete] = useState<StaffSalaryType | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Dropdowns for Edit Modal
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [salaryTypes, setSalaryTypes] = useState<SalaryType[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchStaffSalary(currentPage, searchTerm);
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchTerm]);

  const fetchDropdownData = async () => {
    setLoadingDropdowns(true);
    try {
      const [staffResponse, bankResponse, salaryTypeResponse] = await Promise.all([
        getActiveStaffListApi({ limit: 100 }),
        getBankAccountListApi({ limit: 100 }),
        getSalaryTypeListApi(),
      ]);

      if (staffResponse.success && staffResponse.data) {
        setStaffList(staffResponse.data);
      }
      if (bankResponse.success && bankResponse.data) {
        setBankAccounts(bankResponse.data);
      }
      if (salaryTypeResponse.success && salaryTypeResponse.data) {
        setSalaryTypes(salaryTypeResponse.data);
      }
    } catch (error: any) {
      toast.error("Failed to load dropdown data", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoadingDropdowns(false);
    }
  };

  const fetchStaffSalary = async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const response = await getStaffSalaryListApi({
        page,
        limit: 10,
        search: search || undefined
      });
      if (response.success && response.data && response.pagination) {
        dispatch(setStaffSalaryList({ data: response.data, pagination: response.pagination }));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch staff salary records", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (salary: StaffSalaryType) => {
    setSalaryToDelete(salary);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!salaryToDelete) return;

    setDeleteLoading(true);
    try {
      const result = await deleteStaffSalaryApi(salaryToDelete.staff_salary_id);

      if (result.success) {
        dispatch(deleteStaffSalary(salaryToDelete.staff_salary_id));
        toast.success(result.message || "Staff salary deleted successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        setOpenDeleteDialog(false);
        setSalaryToDelete(null);
        fetchStaffSalary(currentPage, searchTerm);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to delete staff salary";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditClick = (salary: StaffSalaryType) => {
    setSelectedSalary(salary);
    setOpenEditModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEditSuccess = () => {
    fetchStaffSalary(currentPage, searchTerm);
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Masterdata", path: "/master" },
    { label: "Staff Salary" }
  ];

  return (
    <div className="flex flex-col h-screen">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Section */}
      <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
          STAFF SALARY
        </h1>

        <div className="max-w-full">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center sm:justify-between">
            <TextField
              size="small"
              placeholder="Search by staff name"
              value={searchTerm}
              onChange={handleSearch}
              sx={{ width: { xs: '100%', sm: '300px' } }}
            />
            <Button variant="contained" onClick={() => navigate("/staff-salary/create")}>
              Pay Salary
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section - Scrollable */}
      <div className="flex-1 px-3 overflow-auto">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="staff salary table">
            <TableHead sx={commonTableHeadSx}>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>SL NO</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>STAFF NAME</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>BANK ACCOUNT</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>EFFECTIVE DATE</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>AMOUNT</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>SALARY TYPE</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>REMARKS</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                list.map((salary, index) => {
                  const serialNumber = pagination
                    ? (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1
                    : index + 1;

                  return (
                    <TableRow
                      hover
                      key={salary.staff_salary_id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{serialNumber}</TableCell>
                      <TableCell>{salary.staff_name}</TableCell>
                      <TableCell>{salary.account_name}</TableCell>
                      <TableCell>{formatDate(salary.effective_date)}</TableCell>
                      <TableCell>₹{formatCurrency(salary.amount)}</TableCell>
                      <TableCell>{salary.salary_type}</TableCell>
                      <TableCell>{salary.remarks || '-'}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditClick(salary)}
                            >
                              <FiEdit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(salary)}
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
      <div className="fixed bottom-0 left-0 w-full">
        {pagination && (
          <div className="flex-shrink-0 px-3 pb-3">
            <CommonPagination
              mode="server"
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditStaffSalary
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        salary={selectedSalary}
        staffList={staffList}
        bankAccounts={bankAccounts}
        salaryTypes={salaryTypes}
        loadingDropdowns={loadingDropdowns}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={openDeleteDialog}
        title="Delete Staff Salary"
        message={`Are you sure you want to delete this salary payment?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenDeleteDialog(false)}
        loading={deleteLoading}
      />
    </div>
  );
}

export default StaffSalary;