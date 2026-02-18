import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  setLoading,
  setItemTypes,
  setCompanies,
  setError,
} from "./AddInvoiceItems.slice";
import {
  getInvoiceItemTypesApi,
  getStockTransactionCompaniesApi,
  getStockTransactionModelsApi,
  getStockTransactionSparesApi,
  addInvoiceItemsApi,
} from "../../../../service/invoice";
import type {
  InvoiceAddItem,
  ModelData,
  SpareData,
  AddInvoiceItemPayload,
} from "../../../../type/invoice";
import { useState, useEffect } from "react";

interface AddInvoiceItemsModalProps {
  open: boolean;
  onClose: () => void;
  onAddItems: (items: InvoiceAddItem[]) => void;
  invoiceId: string;
}

const AddInvoiceItemsModal = ({ open, onClose, onAddItems, invoiceId }: AddInvoiceItemsModalProps) => {
  const dispatch = useAppDispatch();
  const { itemTypes, companies, loading } = useAppSelector(
    (state) => state.addInvoiceItems
  );


  const [addItemsRows, setAddItemsRows] = useState<InvoiceAddItem[]>([
    {
      tempId: Math.random().toString(),
      item_type_id: "",
      type_of_work: "",
      company_id: "",
      model_id: "",
      spare_id: "",
      remarks: "",
      quantity: "1",
      unit_price: "0",
    },
  ]);
  const [modelsByIndex, setModelsByIndex] = useState<Record<string, ModelData[]>>({});
  const [sparesByIndex, setSparesByIndex] = useState<Record<string, SpareData[]>>({});
  useEffect(() => {
    if (open) {
      fetchAddItemsDropdowns();
    }
  }, [open]);

  const fetchAddItemsDropdowns = async () => {
    dispatch(setLoading(true));
    try {
      const [typesRes, companiesRes] = await Promise.all([
        getInvoiceItemTypesApi(),
        getStockTransactionCompaniesApi(),
      ]);


      if (typesRes.success && typesRes.data) {
        dispatch(setItemTypes(typesRes.data));
      } else {
      }

      if (companiesRes.success && companiesRes.data) {
        dispatch(setCompanies(companiesRes.data));
      }
    } catch (error: any) {
      dispatch(setError("Failed to fetch dropdown data"));
      toast.error("Failed to fetch dropdown data", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAddRow = () => {
    setAddItemsRows([
      ...addItemsRows,
      {
        tempId: Math.random().toString(),
        item_type_id: "",
        type_of_work: "",
        company_id: "",
        model_id: "",
        spare_id: "",
        remarks: "",
        quantity: "1",
        unit_price: "0",
      },
    ]);
  };

  const handleDeleteRow = (tempId: string) => {
    setAddItemsRows(addItemsRows.filter((row) => row.tempId !== tempId));
  };

  const handleRowChange = (tempId: string, field: keyof InvoiceAddItem, value: string) => {
    setAddItemsRows(
      addItemsRows.map((row) =>
        row.tempId === tempId ? { ...row, [field]: value } : row
      )
    );
  };

  const handleItemTypeChange = (tempId: string, itemTypeId: string) => {
    setAddItemsRows(
      addItemsRows.map((r) =>
        r.tempId === tempId
          ? {
              ...r,
              item_type_id: itemTypeId,
              type_of_work: "",
              company_id: "",
              model_id: "",
              spare_id: "",
            }
          : r
      )
    );
    // Clear models and spares for this row
    setModelsByIndex((prev) => {
      const newIndex = { ...prev };
      delete newIndex[tempId];
      return newIndex;
    });
    setSparesByIndex((prev) => {
      const newIndex = { ...prev };
      delete newIndex[tempId];
      return newIndex;
    });
  };

  const handleTypeOfWorkChange = (tempId: string, value: string) => {
    handleRowChange(tempId, "type_of_work", value);
  };

  const handleRemarksChange = (tempId: string, value: string) => {
    handleRowChange(tempId, "remarks", value);
  };

  const handleQuantityChange = (tempId: string, value: string) => {
    handleRowChange(tempId, "quantity", value);
  };

  const handleUnitPriceChange = (tempId: string, value: string) => {
    handleRowChange(tempId, "unit_price", value);
  };

  const handleSpareChange = (tempId: string, spareId: string) => {
    handleRowChange(tempId, "spare_id", spareId);
  };

  const handleCompanyChange = async (tempId: string, companyId: string) => {
    setAddItemsRows(
      addItemsRows.map((row) =>
        row.tempId === tempId
          ? { ...row, company_id: companyId, model_id: "", spare_id: "" }
          : row
      )
    );

    if (companyId) {
      try {
        const response = await getStockTransactionModelsApi(companyId);
        if (response.success && response.data) {
          setModelsByIndex((prev) => ({
            ...prev,
            [tempId]: response.data,
          }));
        }
      } catch (error) {
        toast.error("Failed to fetch models");
      }
    } else {
      setModelsByIndex((prev) => {
        const newIndex = { ...prev };
        delete newIndex[tempId];
        return newIndex;
      });
    }
  };

  const handleModelChange = async (tempId: string, modelId: string) => {
    setAddItemsRows(
      addItemsRows.map((row) =>
        row.tempId === tempId ? { ...row, model_id: modelId, spare_id: "" } : row
      )
    );

    if (modelId) {
      try {
        const response = await getStockTransactionSparesApi(modelId);
        if (response.success && response.data) {
          setSparesByIndex((prev) => ({
            ...prev,
            [tempId]: response.data,
          }));
        }
      } catch (error) {
        toast.error("Failed to fetch spares");
      }
    } else {
      setSparesByIndex((prev) => {
        const newIndex = { ...prev };
        delete newIndex[tempId];
        return newIndex;
      });
    }
  };

  const handleAddItems = async () => {
    // Validate
    for (let i = 0; i < addItemsRows.length; i++) {
      const row = addItemsRows[i];
      if (!row.item_type_id) {
        toast.error(`Please select item type for row ${i + 1}`);
        return;
      }
      if (!row.quantity || parseFloat(row.quantity) <= 0) {
        toast.error(`Please enter valid quantity for row ${i + 1}`);
        return;
      }
      if (!row.unit_price || parseFloat(row.unit_price) < 0) {
        toast.error(`Please enter valid unit price for row ${i + 1}`);
        return;
      }
    }

    // Transform data to API payload format
    const items: AddInvoiceItemPayload[] = addItemsRows.map((row) => ({
      item_type_id: row.item_type_id,
      type_of_work: row.type_of_work || undefined,
      company_id: row.company_id || undefined,
      model_id: row.model_id || undefined,
      spare_id: row.spare_id || undefined,
      remarks: row.remarks || undefined,
      quantity: parseFloat(row.quantity),
      unit_price: parseFloat(row.unit_price),
    }));

    try {
      const response = await addInvoiceItemsApi(invoiceId, { items });
      
      if (response.success) {
        toast.success("Items added successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        // Call parent callback with items
        onAddItems(addItemsRows);
        handleClose();
      } else {
        toast.error(response.message || "Failed to add items", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to add items";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleClose = () => {
    setAddItemsRows([
      {
        tempId: Math.random().toString(),
        item_type_id: "",
        type_of_work: "",
        company_id: "",
        model_id: "",
        spare_id: "",
        remarks: "",
        quantity: "1",
        unit_price: "0",
      },
    ]);
    setModelsByIndex({});
    setSparesByIndex({});
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <span>Add Invoice Items</span>
          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
            <IconButton onClick={handleClose} size="small" sx={{ color: "text.secondary" }}>
              <FiX />
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<FiPlus />}
              onClick={handleAddRow}
              size="small"
            >
              Add Row
            </Button>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell style={{ fontWeight: "bold", flex: 1 }}>Item Type</TableCell>
                <TableCell style={{ fontWeight: "bold", flex: 1 }}>Type of Work</TableCell>
                <TableCell style={{ fontWeight: "bold", flex: 1 }}>Company</TableCell>
                <TableCell style={{ fontWeight: "bold", flex: 1 }}>Model</TableCell>
                <TableCell style={{ fontWeight: "bold", flex: 1 }}>Spare</TableCell>
                <TableCell style={{ fontWeight: "bold", flex: 1 }}>Remarks</TableCell>
                <TableCell style={{ fontWeight: "bold", width: "100px" }}>Quantity</TableCell>
                <TableCell style={{ fontWeight: "bold", width: "100px" }}>Unit Price</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", width: "80px" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {addItemsRows.map((row) => {
                const selectedItemType = itemTypes.find(
                  (type) => type.item_type_id === row.item_type_id
                );
                const itemTypeCode = selectedItemType?.item_type_code;
                const isWork = itemTypeCode === "WORK";
                const isSpare = itemTypeCode === "SPARE";
                const isDiscount = itemTypeCode === "DISCOUNT";

                return (
                <TableRow key={row.tempId} sx={{ height: "40px", borderBottom: "none" }}>
                  <TableCell style={{ flex: 1, padding: "4px" }}>
                    <Autocomplete
                      size="small"
                      options={itemTypes}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.item_type_name || ""
                      }
                      value={
                        itemTypes.find((type) => type.item_type_id === row.item_type_id) ||
                        null
                      }
                      onChange={(_, newValue) => {
                        handleItemTypeChange(row.tempId, newValue?.item_type_id || "");
                      }}
                      disabled={loading}
                      isOptionEqualToValue={(option, value) =>
                        option.item_type_id === value?.item_type_id
                      }
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Select" />
                      )}
                      noOptionsText="No types available"
                    />
                  </TableCell>
                  <TableCell style={{ flex: 1, padding: "4px" }}>
                    <TextField
                      size="small"
                      value={row.type_of_work}
                      onChange={(e) => handleTypeOfWorkChange(row.tempId, e.target.value)}
                      placeholder="Type"
                      fullWidth
                      variant="outlined"
                      disabled={isSpare || isDiscount}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                        },
                        "& .MuiOutlinedInput-input": {
                          padding: "8px 12px",
                          height: "24px",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell style={{ flex: 1, padding: "4px" }}>
                    <Autocomplete
                      size="small"
                      options={companies}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.company_name
                      }
                      value={
                        companies.find((company) => company.company_id === row.company_id) ||
                        null
                      }
                      onChange={(_, newValue) => {
                        handleCompanyChange(
                          row.tempId,
                          newValue?.company_id || ""
                        );
                      }}
                      disabled={loading || isWork || isDiscount}
                      isOptionEqualToValue={(option, value) =>
                        option.company_id === value?.company_id
                      }
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Select" />
                      )}
                      noOptionsText="No companies available"
                    />
                  </TableCell>
                  <TableCell style={{ flex: 1, padding: "4px" }}>
                    <Autocomplete
                      size="small"
                      options={modelsByIndex[row.tempId] || []}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.model_name
                      }
                      value={
                        (modelsByIndex[row.tempId] || []).find(
                          (model) => model.model_id === row.model_id
                        ) || null
                      }
                      onChange={(_, newValue) => {
                        handleModelChange(row.tempId, newValue?.model_id || "");
                      }}
                      disabled={!row.company_id || loading || isWork || isDiscount}
                      isOptionEqualToValue={(option, value) =>
                        option.model_id === value?.model_id
                      }
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Select" />
                      )}
                      noOptionsText="No models available"
                    />
                  </TableCell>
                  <TableCell style={{ flex: 1, padding: "4px" }}>
                    <Autocomplete
                      size="small"
                      options={sparesByIndex[row.tempId] || []}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.spare_name
                      }
                      value={
                        (sparesByIndex[row.tempId] || []).find(
                          (spare) => spare.spare_id === row.spare_id
                        ) || null
                      }
                      onChange={(_, newValue) => {
                        handleSpareChange(row.tempId, newValue?.spare_id || "");
                      }}
                      disabled={!row.model_id || loading || isWork || isDiscount}
                      isOptionEqualToValue={(option, value) =>
                        option.spare_id === value?.spare_id
                      }
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Select" />
                      )}
                      noOptionsText="No spares available"
                    />
                  </TableCell>
                  <TableCell style={{ flex: 1, padding: "4px" }}>
                    <TextField
                      size="small"
                      value={row.remarks}
                      onChange={(e) => handleRemarksChange(row.tempId, e.target.value)}
                      placeholder="Remarks"
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                        },
                        "& .MuiOutlinedInput-input": {
                          padding: "8px 12px",
                          height: "24px",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell style={{ width: "100px", padding: "4px" }}>
                    <TextField
                      size="small"
                      type="text"
                      value={row.quantity}
                      onChange={(e) => handleQuantityChange(row.tempId, e.target.value)}
                      inputProps={{ min: 1, step: "1" }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                        },
                        "& .MuiOutlinedInput-input": {
                          padding: "8px 12px",
                          height: "24px",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell style={{ width: "100px", padding: "4px" }}>
                    <TextField
                      size="small"
                      type="text"
                      value={row.unit_price}
                      onChange={(e) => handleUnitPriceChange(row.tempId, e.target.value)}
                      inputProps={{ min: 0, step: "0.01" }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                        },
                        "& .MuiOutlinedInput-input": {
                          padding: "8px 12px",
                          height: "24px",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" style={{ width: "80px", padding: "4px" }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteRow(row.tempId)}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddItems} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddInvoiceItemsModal;
