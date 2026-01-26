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
    Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import type { AppDispatch, RootState } from "../../../../store/store";
import { deleteStaff, setStaffList } from "./StaffList.slice";
import type { Staff } from "../../../../type/staff";
import ConfirmationDialog from "../../../../Components/ConfirmationDialog";
import Breadcrumb from "../../../../Components/Breadcrumb";
import { getStaffListApi, deleteStaffApi } from "../../../../service/staff";
import CreateStaff from "../CreateStaff/CreateStaff";
import CommonPagination from "../../../../Components/CommonPagination";
import { formatDate, formatCurrency } from "../../../../utils/formatters";
import EditStaff from "../EditStaff/EditStaff";

const StaffDetails = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { list, pagination } = useSelector(
        (state: RootState) => state.staffList
    );

    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchStaff = async (page: number = 1, search?: string) => {
        setLoading(true);
        try {
            const response = await getStaffListApi({
                page,
                limit: 10,
                search: search || undefined
            });
            if (response.success && response.data && response.pagination) {
                dispatch(setStaffList({ data: response.data, pagination: response.pagination }));
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch staff", {
                position: "top-center",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchStaff(currentPage, searchTerm);
        }, searchTerm ? 500 : 0);

        return () => clearTimeout(debounceTimer);
    }, [currentPage, searchTerm]);

    const handleDeleteClick = (staff: Staff) => {
        setStaffToDelete(staff);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!staffToDelete) return;

        setDeleteLoading(true);
        try {
            const result = await deleteStaffApi(staffToDelete.staff_id);

            if (result.success) {
                dispatch(deleteStaff(staffToDelete.staff_id));
                toast.success(result.message || "Staff deleted successfully", {
                    position: "top-center",
                    autoClose: 3000,
                });
                setOpenDeleteDialog(false);
                setStaffToDelete(null);
                fetchStaff(currentPage, searchTerm);
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error.message || "Failed to delete staff";
            toast.error(errorMessage, {
                position: "top-center",
                autoClose: 3000,
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleEditClick = (staff: Staff) => {
        setSelectedStaff(staff);
        setOpenEditModal(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleCreateSuccess = () => {
        fetchStaff(currentPage, searchTerm);
    };

    const handleEditSuccess = () => {
        fetchStaff(currentPage, searchTerm);
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Masterdata", path: "/master" },
        { label: "Staff Details" }
    ];

    return (
        <div className="flex flex-col">
            <Breadcrumb items={breadcrumbItems} />

            {/* Header Section */}
            <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
                <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
                    STAFF DETAILS
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
                        <Button variant="contained" onClick={() => setOpenModal(true)}>
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
                                <TableCell style={{ fontWeight: 'bold' }}>STAFF NAME</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>SALARY</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>ACTIVE DATE</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>INACTIVE DATE</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <CircularProgress size={30} />
                                    </TableCell>
                                </TableRow>
                            ) : list.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No data found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                list.map((staff, index) => {
                                    // Calculate serial number based on current page
                                    const serialNumber = pagination
                                        ? (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1
                                        : index + 1;

                                    return (
                                        <TableRow
                                            hover
                                            key={staff.staff_id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{serialNumber}</TableCell>
                                            <TableCell>{staff.staff_name}</TableCell>
                                            <TableCell>₹{formatCurrency(staff.salary)}</TableCell>
                                            <TableCell>{formatDate(staff.active_date)}</TableCell>
                                            <TableCell>{formatDate(staff.inactive_date)}</TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Tooltip title="Edit">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleEditClick(staff)}
                                                        >
                                                            <FiEdit />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteClick(staff)}
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

            {/* Create Modal */}
            <CreateStaff
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={handleCreateSuccess}
            />

            {/* Edit Modal */}
            <EditStaff
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                staff={selectedStaff}
                onSuccess={handleEditSuccess}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDeleteDialog}
                title="Delete Staff"
                message={`Are you sure you want to delete ${staffToDelete?.staff_name}?`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setOpenDeleteDialog(false)}
                loading={deleteLoading}
            />
        </div>
    );
};

export default StaffDetails;