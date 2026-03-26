import {
  Button,
  TextField,
  IconButton,
  Paper,
  Typography,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setField, setItemField, addItem, removeItem, resetForm, type CreateStockState, type StockItem } from "./CreateStock.slice";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import SearchableSelect from "../../../../Components/SearchableSelect";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../Components/Breadcrumb";
import { getShopListApi } from "../../../../service/shops";
import { getCompanyListApi } from "../../../../service/company";
import { getModelListApi } from "../../../../service/model";
import { getSpareListApi } from "../../../../service/spare";
import { getStockTypeListApi } from "../../../../service/stockType";
import { createStockApi, getStockTransactionAvailabilityApi, getStockTransactionCompaniesApi, getStockTransactionModelsApi, getStockTransactionSparesApi } from "../../../../service/stock";

function CreateStock() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const formState = useAppSelector((state) => state.createStock);
  const [loading, setLoading] = useState(false);

  const [shops, setShops] = useState<{ value: string; label: string }[]>([]);
  const [companies, setCompanies] = useState<{ value: string; label: string }[]>([]);
  const [models, setModels] = useState<{ value: string; label: string }[]>([]);
  const [spares, setSpares] = useState<{ value: string; label: string }[]>([]);
  const [stockTypes, setStockTypes] = useState<{ value: string; label: string; code: string }[]>([]);
  const [itemModels, setItemModels] = useState<Record<number, { value: string; label: string }[]>>({});
  const [itemSpares, setItemSpares] = useState<Record<number, { value: string; label: string }[]>>({});
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [spareSearchTerm, setSpareSearchTerm] = useState("");
  const [companyLoading, setCompanyLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [spareLoading, setSpareLoading] = useState(false);

  const fetchAllCompanies = async (search: string = "") => {
    const allCompanies: { company_id: string; company_name: string }[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await getCompanyListApi({
        page,
        limit: 100,
        search: search || undefined,
      });
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch companies");
      }

      if (response.data) {
        allCompanies.push(
          ...response.data.map((company) => ({
            company_id: company.company_id,
            company_name: company.company_name,
          }))
        );
      }

      totalPages = Number(response.pagination?.totalPages) || 1;
      page += 1;
    } while (page <= totalPages);

    return allCompanies;
  };

  const fetchAllModels = async (search: string = "") => {
    const allModels: { model_id: string; model_name: string }[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await getModelListApi({
        page,
        limit: 100,
        search: search || undefined,
      });
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch models");
      }

      if (response.data) {
        allModels.push(
          ...response.data.map((model) => ({
            model_id: model.model_id,
            model_name: model.model_name,
          }))
        );
      }

      totalPages = Number(response.pagination?.totalPages) || 1;
      page += 1;
    } while (page <= totalPages);

    return allModels;
  };

  const fetchAllSpares = async (search: string = "") => {
    const allSpares: { spare_id: number; spare_name: string }[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await getSpareListApi({
        page,
        limit: 100,
        search: search || undefined,
      });
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch spares");
      }

      if (response.data) {
        allSpares.push(
          ...response.data.map((spare) => ({
            spare_id: spare.spare_id,
            spare_name: spare.spare_name,
          }))
        );
      }

      totalPages = Number(response.pagination?.totalPages) || 1;
      page += 1;
    } while (page <= totalPages);

    return allSpares;
  };

  useEffect(() => {
    // Fetch all dropdown data
    fetchDropdownData();
    if (!formState.orderDate) {
      const today = new Date().toISOString().split("T")[0];
      dispatch(setField({ field: "orderDate", value: today }));
    }
  }, [dispatch]);

  const fetchDropdownData = async () => {
    try {
      // Fetch shops
      const shopsResponse = await getShopListApi({ page: 1, limit: 100 });
      if (shopsResponse.success && shopsResponse.data) {
        setShops(shopsResponse.data.map(shop => ({
          value: shop.shop_id,
          label: shop.shop_name
        })));
      }

      const allCompanies = await fetchAllCompanies();
      setCompanies(allCompanies.map(company => ({
        value: company.company_id,
        label: company.company_name
      })));

      const allModels = await fetchAllModels();
      setModels(allModels.map(model => ({
        value: model.model_id,
        label: model.model_name
      })));

      const allSpares = await fetchAllSpares();
      setSpares(allSpares.map(spare => ({
        value: spare.spare_id.toString(),
        label: spare.spare_name
      })));

      // Fetch stock types
      const stockTypesResponse = await getStockTypeListApi();
      if (stockTypesResponse.success && stockTypesResponse.data) {
        const types = stockTypesResponse.data.map(type => ({
          value: type.stock_type_id,
          label: type.stock_type_name,
          code: type.stock_type_code
        }));
        setStockTypes(types);
        
        // Set default transaction type to PURCHASE after types are loaded
        const purchaseType = types.find(type => type.code === "PURCHASE");
        if (purchaseType) {
          dispatch(setField({ field: "transactionType", value: purchaseType.code }));
          dispatch(setField({ field: "transactionTypeId", value: purchaseType.value }));
        }
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      toast.error("Failed to load dropdown data");
    }
  };

  const fetchCompanyOptionsBySearch = async (search: string) => {
    setCompanyLoading(true);
    try {
      const allCompanies = await fetchAllCompanies(search);
      setCompanies(
        allCompanies.map((company) => ({
          value: company.company_id,
          label: company.company_name,
        }))
      );
    } catch (error) {
      console.error("Error searching companies:", error);
      toast.error("Failed to search companies");
    } finally {
      setCompanyLoading(false);
    }
  };

  const fetchModelOptionsBySearch = async (search: string) => {
    setModelLoading(true);
    try {
      const allModels = await fetchAllModels(search);
      setModels(
        allModels.map((model) => ({
          value: model.model_id,
          label: model.model_name,
        }))
      );
    } catch (error) {
      console.error("Error searching models:", error);
      toast.error("Failed to search models");
    } finally {
      setModelLoading(false);
    }
  };

  const fetchSpareOptionsBySearch = async (search: string) => {
    setSpareLoading(true);
    try {
      const allSpares = await fetchAllSpares(search);
      setSpares(
        allSpares.map((spare) => ({
          value: spare.spare_id.toString(),
          label: spare.spare_name,
        }))
      );
    } catch (error) {
      console.error("Error searching spares:", error);
      toast.error("Failed to search spares");
    } finally {
      setSpareLoading(false);
    }
  };

  // Fetch companies based on transaction type
  const fetchCompaniesByTransactionType = async (transactionType: string) => {
    try {
      if (transactionType === "RETURN") {
        // Use stock transaction companies API for RETURN
        const response = await getStockTransactionCompaniesApi();
        if (response.success && response.data) {
          setCompanies(response.data.map(company => ({
            value: company.company_id,
            label: company.company_name
          })));
        }
      } else {
        // Use regular company API for PURCHASE
        const companiesResponse = await fetchAllCompanies();
        setCompanies(companiesResponse.map(company => ({
          value: company.company_id,
          label: company.company_name
        })));
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to load companies");
    }
  };

  // Watch for transaction type changes and fetch appropriate companies
  useEffect(() => {
    if (formState.transactionType) {
      fetchCompaniesByTransactionType(formState.transactionType);
    }
  }, [formState.transactionType]);

  useEffect(() => {
    if (formState.transactionType === "RETURN") {
      return;
    }

    const timer = setTimeout(() => {
      fetchCompanyOptionsBySearch(companySearchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [companySearchTerm, formState.transactionType]);

  useEffect(() => {
    if (formState.transactionType === "RETURN") {
      return;
    }

    const timer = setTimeout(() => {
      fetchModelOptionsBySearch(modelSearchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [modelSearchTerm, formState.transactionType]);

  useEffect(() => {
    if (formState.transactionType === "RETURN") {
      return;
    }

    const timer = setTimeout(() => {
      fetchSpareOptionsBySearch(spareSearchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [spareSearchTerm, formState.transactionType]);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Stock", path: "/stock" },
    { label: "Create Stock" }
  ];

  // Handler for select dropdowns (SearchableSelect)
  const handleSelectChange = (field: keyof Omit<CreateStockState, 'items'>) => (value: string) => {
    dispatch(setField({ field, value }));
  };

  // Handler for text fields
  const handleTextFieldChange = (field: keyof Omit<CreateStockState, 'items'>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(setField({ field, value: e.target.value }));
  };

  // Handler for transaction type select with typeId
  const handleTransactionTypeChange = (e: any) => {
    const value = e.target.value;
    console.log("Transaction Type Selected:", value);
    dispatch(setField({ field: "transactionType", value }));
    
    // Find the selected stock type to get its ID
    const selectedType = stockTypes.find(type => type.code === value);
    if (selectedType) {
      console.log("Transaction Type ID:", selectedType.value);
      dispatch(setField({ field: "transactionTypeId", value: selectedType.value }));
    }
  };

  const applyAvailabilityBoughtPrice = async (
    index: number,
    companyId: string,
    modelId: string,
    spareId: string
  ) => {
    try {
      const response = await getStockTransactionAvailabilityApi({
        companyId,
        modelId,
        spareId,
      });

      if (response.success && response.data) {
        dispatch(
          setItemField({
            index,
            field: "unitPrice",
            value: String(response.data.boughtPrice ?? ""),
          })
        );
      }
    } catch (error) {
      toast.error("Failed to fetch stock availability");
    }
  };

  // Handler for item select dropdowns
  const handleItemSelectChange = (index: number, field: keyof StockItem) => async (value: string) => {
    const currentItem = formState.items[index];
    let selectedCompanyId = currentItem?.companyId || "";
    let selectedModelId = currentItem?.modelId || "";
    let selectedSpareId = currentItem?.itemId || "";

    if (field === "companyId") {
      selectedCompanyId = value;
      selectedModelId = "";
      selectedSpareId = "";
    }

    if (field === "modelId") {
      selectedModelId = value;
      selectedSpareId = "";
    }

    if (field === "itemId") {
      selectedSpareId = value;
    }

    dispatch(setItemField({ index, field, value }));

    if (formState.transactionType === "RETURN" && field === "companyId") {
      dispatch(setItemField({ index, field: "modelId", value: "" }));
      dispatch(setItemField({ index, field: "itemId", value: "" }));
      dispatch(setItemField({ index, field: "unitPrice", value: "" }));
      setItemSpares((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }

    if (formState.transactionType === "RETURN" && field === "modelId") {
      dispatch(setItemField({ index, field: "itemId", value: "" }));
      dispatch(setItemField({ index, field: "unitPrice", value: "" }));
    }

    if (formState.transactionType === "RETURN" && field === "itemId" && !value) {
      dispatch(setItemField({ index, field: "unitPrice", value: "" }));
    }
    
    // If company is selected and transaction type is RETURN, fetch models for that company
    if (field === "companyId" && value && formState.transactionType === "RETURN") {
      try {
        const response = await getStockTransactionModelsApi(value);
        if (response.success && response.data) {
          setItemModels(prev => ({
            ...prev,
            [index]: response.data.map(model => ({
              value: model.model_id,
              label: model.model_name
            }))
          }));
        }
      } catch (error) {
        console.error("Error fetching models for company:", error);
        toast.error("Failed to load models for selected company");
      }
    }
    
    // If model is selected and transaction type is RETURN, fetch spares for that model
    if (field === "modelId" && value && formState.transactionType === "RETURN") {
      try {
        const response = await getStockTransactionSparesApi(value);
        if (response.success && response.data) {
          setItemSpares(prev => ({
            ...prev,
            [index]: response.data.map(spare => ({
              value: spare.spare_id,
              label: spare.spare_name
            }))
          }));
        }
      } catch (error) {
        console.error("Error fetching spares for model:", error);
        toast.error("Failed to load spares for selected model");
      }
    }

    if (
      formState.transactionType === "RETURN" &&
      selectedCompanyId &&
      selectedModelId &&
      selectedSpareId
    ) {
      await applyAvailabilityBoughtPrice(index, selectedCompanyId, selectedModelId, selectedSpareId);
    }
  };

  // Handler for item text fields
  const handleItemTextFieldChange = (index: number, field: keyof StockItem) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setItemField({ index, field, value: e.target.value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formState.shopId) {
      toast.error("Please select a shop");
      return;
    }
    if (!formState.orderDate) {
      toast.error("Please select order date");
      return;
    }
    
    // Validate items
    for (let i = 0; i < formState.items.length; i++) {
      const item = formState.items[i];
      if (!item.companyId || !item.modelId || !item.itemId) {
        toast.error(`Please fill all fields for item ${i + 1}`);
        return;
      }
      if (!item.quantity || parseFloat(item.quantity) <= 0) {
        toast.error(`Please enter valid quantity for item ${i + 1}`);
        return;
      }
      if (!item.unitPrice || parseFloat(item.unitPrice) <= 0) {
        toast.error(`Please enter valid unit price for item ${i + 1}`);
        return;
      }
    }

    setLoading(true);
    try {
      // Prepare payload
      const payload = {
        shopId: formState.shopId,
        transactionTypeId: formState.transactionTypeId,
        bankAccountId: formState.bankAccountId,
        orderDate: formState.orderDate,
        description: formState.description,
        items: formState.items.map(item => ({
          companyId: item.companyId,
          modelId: item.modelId,
          itemId: item.itemId,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          lineTotal: parseFloat(item.lineTotal),
        })),
        totalAmount: parseFloat(formState.totalAmount),
      };

      console.log("Create Stock Payload:", payload);
      
      const response = await createStockApi(payload);
      
      if (response.success) {
        toast.success(response.message || "Stock Created Successfully");
      } else {
        toast.error(response.message || "Failed to create stock");
        return;
      }
      dispatch(resetForm());
      navigate("/stock");
    } catch (error: any) {
      console.error("Create stock error:", error);
      toast.error(error?.response?.data?.message || "Failed to create stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Section */}
      <div className="flex-shrink-0 px-4 py-3">
        <Typography variant="h5" component="h1" fontWeight="600">
          Create Stock
        </Typography>
      </div>

      {/* Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <Box>
          <Card>
            <CardContent>
              {/* Shop */}
              <div className="grid grid-cols-1 gap-4 mb-4">
                <SearchableSelect
                  label="Shop *"
                  options={shops}
                  value={formState.shopId}
                  onChange={handleSelectChange("shopId")}
                />
              </div>

              {/* Transaction Type and Order Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormControl fullWidth size="small">
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    value={formState.transactionType}
                    label="Transaction Type"
                    onChange={handleTransactionTypeChange}
                  >
                    {stockTypes.map((type) => (
                      <MenuItem key={type.value} value={type.code}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Order Date *"
                  value={formState.orderDate}
                  onChange={handleTextFieldChange("orderDate")}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    max: new Date().toISOString().split("T")[0],
                  }}
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <TextField
                  fullWidth
                  size="small"
                  label="Description"
                  value={formState.description}
                  onChange={handleTextFieldChange("description")}
                  multiline
                  rows={2}
                />
              </div>

              {/* Items Section */}
              <div>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" component="div">
                    Items
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FiPlus />}
                    onClick={() => dispatch(addItem())}
                  >
                    Add Item
                  </Button>
                </Box>

                {formState.items.map((item, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: "#f9fafb" }}>
                    {/* All item fields in single row with delete button at the end */}
                    <div className="flex gap-4 items-end">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 flex-1">
                        <SearchableSelect
                          label="Company *"
                          options={companies}
                          value={item.companyId}
                          onChange={handleItemSelectChange(index, "companyId")}
                          onInputChange={setCompanySearchTerm}
                          loading={companyLoading}
                        />
                        <SearchableSelect
                          label="Model *"
                          options={formState.transactionType === "RETURN" && itemModels[index] ? itemModels[index] : models}
                          value={item.modelId}
                          onChange={handleItemSelectChange(index, "modelId")}
                          onInputChange={setModelSearchTerm}
                          loading={formState.transactionType === "RETURN" ? false : modelLoading}
                        />
                        <SearchableSelect
                          label="Spare *"
                          options={formState.transactionType === "RETURN" && itemSpares[index] ? itemSpares[index] : spares}
                          value={item.itemId}
                          onChange={handleItemSelectChange(index, "itemId")}
                          onInputChange={setSpareSearchTerm}
                          loading={formState.transactionType === "RETURN" ? false : spareLoading}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Quantity *"
                          value={item.quantity}
                          onChange={handleItemTextFieldChange(index, "quantity")}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Unit Price *"
                          value={item.unitPrice}
                          onChange={handleItemTextFieldChange(index, "unitPrice")}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Line Total"
                          value={item.lineTotal}
                          InputProps={{ readOnly: true }}
                          sx={{ backgroundColor: "#e5e7eb" }}
                        />
                      </div>
                      {formState.items.length > 1 && (
                        <div className="w-auto">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => dispatch(removeItem(index))}
                          >
                            <FiTrash2 />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  </Paper>
                ))}
              </div>

              {/* Total Amount */}
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2, mb: 2 }}>
                <Typography variant="h6" component="div">
                  Total Amount:
                </Typography>
                <Typography variant="h5" component="div" color="primary" fontWeight="bold">
                  ₹{formState.totalAmount}
                </Typography>
              </Box>

              {/* Action Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Creating..." : "Create Stock"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </div>
    </div>
  );
}

export default CreateStock;
