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
import { deleteModel, setModelList } from "./ModelList.slice";
import type { Model as ModelType } from "../../../../type/model";
import CreateModel from "../CreateModel/CreateModel";
import ConfirmationDialog from "../../../../Components/ConfirmationDialog";
import CommonPagination from "../../../../Components/CommonPagination";
import Breadcrumb from "../../../../Components/Breadcrumb";
import { getModelListApi, deleteModelApi } from "../../../../service/model";
import EditModel from "../EditModel/EditModel";
import { commonTableHeadSx } from "../../../../utils/tableHeaderStyle";

const Model = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { list, pagination } = useSelector(
    (state: RootState) => state.modellist
  );

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType | null>(null);
  const [modelToDelete, setModelToDelete] = useState<ModelType | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchModels = async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const response = await getModelListApi({
        page,
        limit: 10,
        search: search || undefined
      });
      if (response.success && response.data && response.pagination) {
        dispatch(setModelList({ data: response.data, pagination: response.pagination }));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch models", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchModels(currentPage, searchTerm);
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchTerm]);

  const handleDeleteClick = (model: ModelType) => {
    setModelToDelete(model);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!modelToDelete) return;

    setDeleteLoading(true);
    try {
      const result = await deleteModelApi(modelToDelete.model_id);

      if (result.success) {
        dispatch(deleteModel(modelToDelete.model_id));
        toast.success(result.message || "Model deleted successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        setOpenDeleteDialog(false);
        setModelToDelete(null);
        fetchModels(currentPage, searchTerm);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to delete model";
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
    setModelToDelete(null);
  };

  const handleEdit = (model: ModelType) => {
    setSelectedModel(model);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedModel(null);
    fetchModels(currentPage, searchTerm);
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
    fetchModels(currentPage, searchTerm);
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Masterdata", path: "/master" },
    { label: "Model" }
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Section */}
      <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
          MODEL
        </h1>

        <div className="max-w-full">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center sm:justify-between">
            <TextField
              size="small"
              placeholder="Search Model"
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
            <TableHead sx={commonTableHeadSx}>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>SL NO</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>MODEL NAME</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                list.map((row: ModelType, index: number) => {
                  const serialNumber = pagination
                    ? (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1
                    : index + 1;

                  return (
                    <TableRow
                      hover
                      key={row.model_id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{serialNumber}</TableCell>
                      <TableCell>{row.model_name}</TableCell>
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

      {/* Create Model Modal */}
      <CreateModel open={openModal} onClose={handleCloseModal} />

      {/* Edit Model Modal */}
      <EditModel
        open={openEditModal}
        onClose={handleCloseEditModal}
        model={selectedModel}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={openDeleteDialog}
        title=""
        message={`Are you sure you want to delete ${modelToDelete?.model_name}?`}
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
      />
    </div>
  )
}

export default Model