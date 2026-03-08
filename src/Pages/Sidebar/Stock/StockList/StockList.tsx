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
  IconButton,
  Tooltip,
  CircularProgress,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import CommonPagination from "../../../../Components/CommonPagination";
import Breadcrumb from "../../../../Components/Breadcrumb";
import ConfirmationDialog from "../../../../Components/ConfirmationDialog";
import { getStockListApi, getPurchasedStockListApi, deleteStockItemApi } from "../../../../service/stock";
import type { StockTransactionItem, CurrentStockItem, PurchasedStockListItem } from "../../../../type/stock";
import { toast } from "react-toastify";
import { commonTableHeadSx } from "../../../../utils/tableHeaderStyle";


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`stock-tabpanel-${index}`}
      aria-labelledby={`stock-tab-${index}`}
      {...other}
      style={{ height: '100%' }}
    >
      {value === index && <Box sx={{ height: '100%' }}>{children}</Box>}
    </div>
  );
}

const formatDateDDMMYYYY = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

function StockList() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState<StockTransactionItem[] | CurrentStockItem[] | PurchasedStockListItem[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Fetch stock data based on current tab
  const fetchStockData = useCallback(async () => {
    setLoading(true);
    try {
      if (currentTab === 0) {
        const response = await getPurchasedStockListApi({
          page: currentPage,
          limit: 10,
          search: searchTerm || undefined,
        });

        if (response.success) {
          setStockData(response.data || []);
          if (response.pagination) {
            setPagination({
              currentPage: response.pagination.currentPage,
              totalPages: response.pagination.totalPages,
              hasNextPage: response.pagination.currentPage < response.pagination.totalPages,
              hasPreviousPage: response.pagination.currentPage > 1,
            });
          }
        } else {
          toast.error(response.message || "Failed to fetch purchased stock list");
        }
      } else {
        const stockTypeCode = currentTab === 1 ? "RETURN" : undefined;

        const response = await getStockListApi({
          stockTypeCode,
          page: currentPage,
          limit: 10,
          search: searchTerm || undefined,
        });

        if (response.success) {
          setStockData(response.data || []);
          if (response.pagination) {
            setPagination({
              currentPage: response.pagination.currentPage,
              totalPages: response.pagination.totalPages,
              hasNextPage: response.pagination.hasNextPage,
              hasPreviousPage: response.pagination.hasPreviousPage,
            });
          }
        } else {
          toast.error(response.message || "Failed to fetch stock data");
        }
      }
    } catch (error: any) {
      console.error("Error fetching stock data:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch stock data");
    } finally {
      setLoading(false);
    }
  }, [currentTab, currentPage, searchTerm]);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateClick = () => {
    navigate("/stock/create");
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setTimeout(() => {
      setDeleteDialogOpen(true);
    }, 0);
  };

  const handleViewPurchasedStock = (id: string) => {
    navigate(`/stock/view/${id}`);
  };

  const handleEditPurchasedStock = (id: string) => {
    navigate(`/stock/edit/${id}`);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await deleteStockItemApi(itemToDelete);
      if (response.success) {
        toast.success(response.message || "Stock item deleted successfully");
        fetchStockData(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete stock item");
      }
    } catch (error: any) {
      console.error("Error deleting stock item:", error);
      toast.error(error?.response?.data?.message || "Failed to delete stock item");
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Stock" }
  ];

  const renderTableContent = (tableType: string) => {
    return (
      <>
        {/* Search Section */}
        <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
          <div className="max-w-full">
            <TextField
              size="small"
              placeholder={`Search ${tableType}`}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              sx={{ width: { xs: '100%', sm: '250px' } }}
            />
          </div>
        </div>

        {/* Table Section - Scrollable */}
        <div className="flex-1 px-3 overflow-auto">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead sx={commonTableHeadSx}>
                <TableRow>
                  {currentTab === 0 ? (
                    <>
                      <TableCell style={{ fontWeight: 'bold' }}>SL NO</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>SHOP NAME</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>NO OF ITEMS</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>TOTAL PRICE</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>PURCHASE DATE</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>PAYMENT STATUS</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>ACTIONS</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell style={{ fontWeight: 'bold' }}>SL NO</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>COMPANY</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>MODEL</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>SPARE NAME</TableCell>
                      {currentTab !== 2 && <TableCell style={{ fontWeight: 'bold' }}>SHOP</TableCell>}
                      <TableCell style={{ fontWeight: 'bold' }}>QUANTITY</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>{currentTab === 2 ? 'AVG PRICE' : 'UNIT PRICE'}</TableCell>
                      {currentTab !== 2 && <TableCell style={{ fontWeight: 'bold' }}>TOTAL PRICE</TableCell>}
                      {currentTab !== 2 && <TableCell style={{ fontWeight: 'bold' }}>DATE</TableCell>}
                      {currentTab === 1 && <TableCell align="center" style={{ fontWeight: 'bold' }}>ACTIONS</TableCell>}
                    </>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={currentTab === 0 ? 7 : currentTab === 2 ? 6 : 10} align="center">
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : stockData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={currentTab === 0 ? 7 : currentTab === 2 ? 6 : 10} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : currentTab === 0 ? (
                  (stockData as PurchasedStockListItem[]).map((row, index) => (
                    <TableRow
                      hover
                      key={row.stock_transaction_id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                      <TableCell>{row.shop_name || '-'}</TableCell>
                      <TableCell>{row.no_of_items}</TableCell>
                      <TableCell>₹{Number(row.total_price).toFixed(2)}</TableCell>
                      <TableCell>{formatDateDDMMYYYY(row.purchase_date)}</TableCell>
                      <TableCell>{row.payment_status || '-'}</TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewPurchasedStock(row.stock_transaction_id)}
                            >
                              <FiEye />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => handleEditPurchasedStock(row.stock_transaction_id)}
                            >
                              <FiEdit />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : currentTab === 2 ? (
                  // Current Stock rendering
                  (stockData as CurrentStockItem[]).map((row, index) => (
                    <TableRow
                      hover
                      key={`${row.company_name}-${row.model_name}-${row.spare_name}-${index}`}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                      <TableCell>{row.company_name}</TableCell>
                      <TableCell>{row.model_name}</TableCell>
                      <TableCell>{row.spare_name}</TableCell>
                      <TableCell>{row.current_quantity}</TableCell>
                      <TableCell>₹{Number(row.average_price).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  // Transaction Stock (Purchased/Returned) rendering
                  (stockData as StockTransactionItem[]).map((row, index) => (
                    <TableRow
                      hover
                      key={row.stock_transaction_item_id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                      <TableCell>{row.company_name}</TableCell>
                      <TableCell>{row.model_name}</TableCell>
                      <TableCell>{row.spare_name}</TableCell>
                      <TableCell>{row.shop_name}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>₹{Number(row.price).toFixed(2)}</TableCell>
                      <TableCell>₹{Number(row.total_price).toFixed(2)}</TableCell>
                      <TableCell>{new Date(row.order_date).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(row.stock_transaction_item_id)}
                          >
                            <FiTrash2 />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Pagination - Fixed at bottom */}
        <div className="flex-shrink-0 px-3 pb-3">
          <CommonPagination
            mode="server"
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Section */}
      <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
          STOCK MANAGEMENT
        </h1>
      </div>

      {/* Tabs and Create Button Section */}
      <div className="flex-shrink-0 px-3 pt-1">
        <div className="flex items-center justify-between gap-2">
          <Box sx={{ flex: 1 }}>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              className="stock-tabs"
            >
              <Tab label="Purchased Stock" id="stock-tab-0" />
              <Tab label="Returned Stock" id="stock-tab-1" />
              <Tab label="Current Stock" id="stock-tab-2" />
            </Tabs>
          </Box>
          <Button variant="contained" onClick={handleCreateClick} sx={{ minWidth: '120px' }}>
            Create New
          </Button>
        </div>
      </div>

      {/* Tab Panels - Takes remaining space */}
      <div className="flex-1 overflow-hidden">
        <TabPanel value={currentTab} index={0}>
          <div className="flex flex-col h-full">
            {renderTableContent("Purchased Stock")}
          </div>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <div className="flex flex-col h-full">
            {renderTableContent("Returned Stock")}
          </div>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <div className="flex flex-col h-full">
            {renderTableContent("Current Stock")}
          </div>
        </TabPanel>
      </div>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Stock Item"
        message="Are you sure you want to delete this stock item? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
}

export default StockList;