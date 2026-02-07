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
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Breadcrumb from "../../../Components/Breadcrumb";
import CommonPagination from "../../../Components/CommonPagination";

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

function Stock() {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

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
    // TODO: Open create modal based on current tab
    console.log("Create clicked for tab:", currentTab);
  };

  const handleEdit = (id: string) => {
    // TODO: Open edit modal
    console.log("Edit clicked for id:", id);
  };

  const handleDelete = (id: string) => {
    // TODO: Open delete confirmation
    console.log("Delete clicked for id:", id);
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Stock" }
  ];

  // Mock data for demonstration
  const mockData = [
    { id: "1", spare_name: "Engine Oil", quantity: "50", unit_price: "250.00", total_price: "12500.00", date: "2026-02-01" },
    { id: "2", spare_name: "Brake Pad", quantity: "30", unit_price: "450.00", total_price: "13500.00", date: "2026-02-01" },
  ];

  const mockPagination = {
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const renderTableContent = (tableType: string) => {
    return (
      <>
        {/* Header Section */}
        <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
          <div className="max-w-full">
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center sm:justify-between">
              <TextField
                size="small"
                placeholder={`Search ${tableType}`}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                sx={{ width: { xs: '100%', sm: '250px' } }}
              />
              <Button variant="contained" onClick={handleCreateClick}>
                Create New
              </Button>
            </div>
          </div>
        </div>

        {/* Table Section - Scrollable */}
        <div className="flex-1 px-3 overflow-auto">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>SL NO</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>SPARE NAME</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>QUANTITY</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>UNIT PRICE</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>TOTAL PRICE</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>DATE</TableCell>
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
                ) : mockData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  mockData.map((row, index) => (
                    <TableRow
                      hover
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.spare_name}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>₹{row.unit_price}</TableCell>
                      <TableCell>₹{row.total_price}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(row.id)}
                            >
                              <FiEdit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(row.id)}
                            >
                              <FiTrash2 />
                            </IconButton>
                          </Tooltip>
                        </Stack>
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
            currentPage={mockPagination.currentPage}
            totalPages={mockPagination.totalPages}
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

      {/* Tabs Section */}
      <div className="flex-shrink-0 px-3">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '0.875rem',
              },
            }}
          >
            <Tab label="Purchased Stock" id="stock-tab-0" />
            <Tab label="Returned Stock" id="stock-tab-1" />
            <Tab label="Current Stock" id="stock-tab-2" />
          </Tabs>
        </Box>
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
    </div>
  );
}

export default Stock;