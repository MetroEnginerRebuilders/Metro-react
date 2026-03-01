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
import { deleteShop, setShopList } from "./ShopList.slice";
import type { Shop } from "../../../../type/shops";
import CreateShop from "../CreateShop/CreateShop";
import EditShop from "../EditShop/EditShop";
import ConfirmationDialog from "../../../../Components/ConfirmationDialog";
import CommonPagination from "../../../../Components/CommonPagination";
import Breadcrumb from "../../../../Components/Breadcrumb";
import { getShopListApi, deleteShopApi } from "../../../../service/shops";
import { commonTableHeadSx } from "../../../../utils/tableHeaderStyle";

function ShopList() {
  const dispatch = useDispatch<AppDispatch>();

  const { list, pagination } = useSelector(
    (state: RootState) => state.shoplist
  );

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [shopToDelete, setShopToDelete] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchShops = async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const response = await getShopListApi({ 
        page, 
        limit: 10,
        search: search || undefined 
      });
      if (response.success && response.data) {
        dispatch(setShopList({ data: response.data, pagination: response.pagination }));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch shops", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchShops(currentPage, searchTerm);
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchTerm]);

  const handleDeleteClick = (shop: Shop) => {
    setShopToDelete(shop);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!shopToDelete) return;

    setDeleteLoading(true);
    try {
      const result = await deleteShopApi(shopToDelete.shop_id);
      
      if (result.success) {
        dispatch(deleteShop(shopToDelete.shop_id));
        toast.success(result.message || "Shop deleted successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        setOpenDeleteDialog(false);
        setShopToDelete(null);
        // Refresh the list
        fetchShops(currentPage, searchTerm);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to delete shop";
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
    setShopToDelete(null);
  };

  const handleEdit = (shop: Shop) => {
    setSelectedShop(shop);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedShop(null);
    // Refresh the list after editing
    fetchShops(currentPage, searchTerm);
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
    // Refresh the list after creating
    fetchShops(currentPage, searchTerm);
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Masterdata", path: "/master" },
    { label: "Shops" }
  ];

  return (
    <div className="flex flex-col">
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Header Section */}
      <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
          SHOPS
        </h1>

        <div className="max-w-full">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center sm:justify-between">
            <TextField
              size="small"
              placeholder="Search Shop"
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
                <TableCell style={{ fontWeight: 'bold' }}>SHOP NAME</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>ADDRESS</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>PHONE</TableCell>
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
                list.map((row: Shop, index: number) => {
                  // Calculate serial number based on current page
                  const serialNumber = pagination
                    ? (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1
                    : index + 1;

                  return (
                    <TableRow
                      hover
                      key={row.shop_id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{serialNumber}</TableCell>
                      <TableCell>{row.shop_name}</TableCell>
                      <TableCell>{row.shop_address}</TableCell>
                      <TableCell>{row.shop_phone_number}</TableCell>
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

      {/* Create Shop Modal */}
      <CreateShop open={openModal} onClose={handleCloseModal} />

      {/* Edit Shop Modal */}
      <EditShop
        open={openEditModal}
        onClose={handleCloseEditModal}
        shop={selectedShop}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={openDeleteDialog}
        title=""
        message={`Are you sure you want to delete ${shopToDelete?.shop_name}?`}
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
      />
    </div>
  );
}

export default ShopList;
