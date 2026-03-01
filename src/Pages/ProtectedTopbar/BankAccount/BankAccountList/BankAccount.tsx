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
import { deleteBankAccount, setBankAccountList } from "./BankAccountList.slice";
import type { BankAccount as BankAccountType } from "../../../../type/bankAccount";
import ConfirmationDialog from "../../../../Components/ConfirmationDialog";
import Breadcrumb from "../../../../Components/Breadcrumb";
import { getBankAccountListApi, deleteBankAccountApi } from "../../../../service/bankAccount";
import CreateBankAccount from "../CreateBankAccount/CreateBankAccount";
import CommonPagination from "../../../../Components/CommonPagination";
import EditBankAccount from "../EditBankAccount/EditBankAccount";
import { commonTableHeadSx } from "../../../../utils/tableHeaderStyle";
import { formatDate, formatCurrency } from "../../../../utils/formatters";

const BankAccount = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { list, pagination } = useSelector(
        (state: RootState) => state.bankAccountList
    );

    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<BankAccountType | null>(null);
    const [accountToDelete, setAccountToDelete] = useState<BankAccountType | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchBankAccounts = async (page: number = 1, search?: string) => {
        setLoading(true);
        try {
            const response = await getBankAccountListApi({
                page,
                limit: 10,
                search: search || undefined
            });
            if (response.success && response.data && response.pagination) {
                dispatch(setBankAccountList({ data: response.data, pagination: response.pagination }));
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch bank accounts", {
                position: "top-center",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchBankAccounts(currentPage, searchTerm);
        }, searchTerm ? 500 : 0);

        return () => clearTimeout(debounceTimer);
    }, [currentPage, searchTerm]);

    const handleDeleteClick = (account: BankAccountType) => {
        setAccountToDelete(account);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!accountToDelete) return;

        setDeleteLoading(true);
        try {
            const result = await deleteBankAccountApi(accountToDelete.bank_account_id);

            if (result.success) {
                dispatch(deleteBankAccount(accountToDelete.bank_account_id));
                toast.success(result.message || "Bank account deleted successfully", {
                    position: "top-center",
                    autoClose: 3000,
                });
                setOpenDeleteDialog(false);
                setAccountToDelete(null);
                fetchBankAccounts(currentPage, searchTerm);
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error.message || "Failed to delete bank account";
            toast.error(errorMessage, {
                position: "top-center",
                autoClose: 3000,
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleEditClick = (account: BankAccountType) => {
        setSelectedAccount(account);
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
        fetchBankAccounts(currentPage, searchTerm);
    };

    const handleEditSuccess = () => {
        fetchBankAccounts(currentPage, searchTerm);
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Masterdata", path: "/master" },
        { label: "Bank Accounts" }
    ];

    return (
        <div className="flex flex-col">
            <Breadcrumb items={breadcrumbItems} />

            {/* Header Section */}
            <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
                <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
                    BANK ACCOUNTS
                </h1>

                <div className="max-w-full">
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center sm:justify-between">
                        <TextField
                            size="small"
                            placeholder="Search by account name or number"
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
                        <TableHead sx={commonTableHeadSx}>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>SL NO</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>ACCOUNT NAME</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>ACCOUNT NUMBER</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold' }}>OPENING BALANCE</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>ACTIVATE DATE</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>LAST TRANSACTION</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold' }}>CURRENT BALANCE</TableCell>
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
                                list.map((account, index) => {
                                    // Calculate serial number based on current page
                                    const serialNumber = pagination
                                        ? (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1
                                        : index + 1;

                                    return (
                                        <TableRow
                                            hover
                                            key={account.bank_account_id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{serialNumber}</TableCell>
                                            <TableCell align="center">{account.account_name}</TableCell>
                                            <TableCell align="center">{account.account_number}</TableCell>
                                            <TableCell align="center">₹{formatCurrency(account.opening_balance)}</TableCell>
                                            <TableCell align="center">{formatDate(account.activate_date)}</TableCell>
                                            <TableCell align="center">{formatDate(account.last_transaction)}</TableCell>
                                            <TableCell align="center">₹{formatCurrency(account.current_balance)}</TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Tooltip title="Edit">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleEditClick(account)}
                                                        >
                                                            <FiEdit />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteClick(account)}
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
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            <CreateBankAccount
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={handleCreateSuccess}
            />

            <EditBankAccount
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                account={selectedAccount}
                onSuccess={handleEditSuccess}
            />

            <ConfirmationDialog
                open={openDeleteDialog}
                title=""
                message={`Are you sure you want to delete ${accountToDelete?.account_name}?`}
                confirmText="Delete"
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setOpenDeleteDialog(false);
                    setAccountToDelete(null);
                }}
                loading={deleteLoading}
            />
        </div>
    );
};

export default BankAccount;
