
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Stack,
    IconButton,
    Tooltip,
    CircularProgress,
    Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import Breadcrumb from "../../../../Components/Breadcrumb";
import CommonPagination from "../../../../Components/CommonPagination";
import { deleteJobApi, getJobListApi } from "../../../../service/job";
import type { Job } from "../../../../type/job";
import { formatCurrency, formatDate } from "../../../../utils/formatters";
import CreateJob from "../CreateJob/CreateJob";
import EditJob from "../EditJob/EditJob";

const JobList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [list, setList] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
    const [pagination, setPagination] = useState<{
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    } | null>(null);

    const fetchJobs = async (page: number = 1, search?: string) => {
        setLoading(true);
        try {
            const response = await getJobListApi({
                page,
                limit: 10,
                search: search || undefined,
            });

            if (response.success && response.data) {
                setList(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            } else {
                setList([]);
                setPagination(null);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch jobs", {
                position: "top-center",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchJobs(currentPage, searchTerm);
        }, searchTerm ? 500 : 0);

        return () => clearTimeout(debounceTimer);
    }, [currentPage, searchTerm]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleCreate = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        fetchJobs(currentPage, searchTerm);
    };

    const handleOpenEditModal = (job: Job) => {
        setSelectedJob(job);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedJob(null);
    };

    const handleEditSuccess = () => {
        handleCloseEditModal();
        fetchJobs(currentPage, searchTerm);
    };

    const handleEdit = (job: Job) => {
        handleOpenEditModal(job);
    };
    const handleDelete = async (job: Job) => {
        if (!job.job_id) return;
        setDeletingJobId(job.job_id);
        try {
            const response = await deleteJobApi(job.job_id);
            if (response.success) {
                toast.success("Job deleted successfully", {
                    position: "top-center",
                    autoClose: 3000,
                });
                fetchJobs(currentPage, searchTerm);
            } else {
                toast.error(response.message || "Failed to delete job", {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to delete job", {
                position: "top-center",
                autoClose: 3000,
            });
        } finally {
            setDeletingJobId(null);
        }
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Jobs" },
    ];

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Breadcrumb items={breadcrumbItems} />

            {/* Header Section */}
            <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
                <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
                    JOBS
                </h1>

                <div className="max-w-full">
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center sm:justify-between">
                        <TextField
                            size="small"
                            placeholder="Search Job"
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            sx={{ width: { xs: "100%", sm: "250px" } }}
                        />
                        <Button variant="contained" onClick={handleCreate}>
                            Create Job
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section - Scrollable */}
            <div className="flex-1 px-3 overflow-auto">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="job list">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>SL NO</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>JOB ID</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>CUSTOMER NAME</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>START DATE</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>DESCRIPTION</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>RECEIVED ITEMS</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>ADVANCE PAID</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>STATUS</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold" }}>ACTIONS</TableCell>
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
                                list.map((row: Job, index: number) => {
                                    const serialNumber = pagination
                                        ? (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1
                                        : index + 1;
                                    const isCompleted = row.status?.toLowerCase() === "completed";

                                    return (
                                        <TableRow
                                            hover
                                            key={row.job_id || `${row.job_code}-${index}`}
                                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                        >
                                            <TableCell>{serialNumber}</TableCell>
                                            <TableCell>{row.job_number}</TableCell>
                                            <TableCell>{row.customer_name}</TableCell>
                                            <TableCell>{formatDate(row.start_date)}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell>{row.received_items}</TableCell>
                                            <TableCell>{formatCurrency(row.advance_amount)}</TableCell>
                                            <TableCell>{row.status}</TableCell>
                                            <TableCell align="center">
                                                {!isCompleted && (
                                                    <Stack direction="row" spacing={1} justifyContent="center">
                                                        <Tooltip title="Edit">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleEdit(row)}
                                                                disabled={deletingJobId === row.job_id}
                                                            >
                                                                <FiEdit />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDelete(row)}
                                                                disabled={deletingJobId === row.job_id}
                                                            >
                                                                <FiTrash2 />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                )}
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

            <CreateJob open={openModal} onClose={handleCloseModal} onSuccess={handleCloseModal} />
            <EditJob open={openEditModal} onClose={handleCloseEditModal} onSuccess={handleEditSuccess} job={selectedJob} />
        </div>
    );
};

export default JobList;
