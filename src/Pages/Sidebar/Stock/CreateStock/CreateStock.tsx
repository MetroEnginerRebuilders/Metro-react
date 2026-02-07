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
import { getBankAccountListApi } from "../../../../service/bankAccount";
import { getCompanyListApi } from "../../../../service/company";
import { getModelListApi } from "../../../../service/model";
import { getSpareListApi } from "../../../../service/spare";
import { getStockTypeListApi } from "../../../../service/stockType";
import { createStockApi, getStockTransactionCompaniesApi, getStockTransactionModelsApi, getStockTransactionSparesApi } from "../../../../service/stock";

function CreateStock() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const formState = useAppSelector((state) => state.createStock);
  const [loading, setLoading] = useState(false);

  const [shops, setShops] = useState<{ value: string; label: string }[]>([]);
  const [bankAccounts, setBankAccounts] = useState<{ value: string; label: string }[]>([]);
  const [companies, setCompanies] = useState<{ value: string; label: string }[]>([]);
  const [models, setModels] = useState<{ value: string; label: string }[]>([]);
  const [spares, setSpares] = useState<{ value: string; label: string }[]>([]);
  const [stockTypes, setStockTypes] = useState<{ value: string; label: string; code: string }[]>([]);
  const [itemModels, setItemModels] = useState<Record<number, { value: string; label: string }[]>>({});
  const [itemSpares, setItemSpares] = useState<Record<number, { value: string; label: string }[]>>({});

  useEffect(() => {
    // Fetch all dropdown data
    fetchDropdownData();
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

      // Fetch bank accounts
      const bankAccountsResponse = await getBankAccountListApi({ page: 1, limit: 100 });
      if (bankAccountsResponse.success && bankAccountsResponse.data) {
        setBankAccounts(bankAccountsResponse.data.map(account => ({
          value: account.bank_account_id,
          label: `${account.account_name} - ${account.account_number}`
        })));
      }

      // Fetch companies
      const companiesResponse = await getCompanyListApi({ page: 1, limit: 100 });
      if (companiesResponse.success && companiesResponse.data) {
        setCompanies(companiesResponse.data.map(company => ({
          value: company.company_id,
          label: company.company_name
        })));
      }

      // Fetch models
      const modelsResponse = await getModelListApi({ page: 1, limit: 100 });
      if (modelsResponse.success && modelsResponse.data) {
        setModels(modelsResponse.data.map(model => ({
          value: model.model_id,
          label: model.model_name
        })));
      }

      // Fetch spares
      const sparesResponse = await getSpareListApi({ page: 1, limit: 100 });
      if (sparesResponse.success && sparesResponse.data) {
        setSpares(sparesResponse.data.map(spare => ({
          value: spare.spare_id.toString(),
          label: spare.spare_name
        })));
      }

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
        const response = await getCompanyListApi({ page: 1, limit: 100 });
        if (response.success && response.data) {
          setCompanies(response.data.map(company => ({
            value: company.company_id,
            label: company.company_name
          })));
        }
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

  // Handler for item select dropdowns
  const handleItemSelectChange = (index: number, field: keyof StockItem) => async (value: string) => {
    dispatch(setItemField({ index, field, value }));
    
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
    if (!formState.bankAccountId) {
      toast.error("Please select a bank account");
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
              {/* Shop and Bank Account */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <SearchableSelect
                  label="Shop *"
                  options={shops}
                  value={formState.shopId}
                  onChange={handleSelectChange("shopId")}
                />
                <SearchableSelect
                  label="Bank Account *"
                  options={bankAccounts}
                  value={formState.bankAccountId}
                  onChange={handleSelectChange("bankAccountId")}
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
                        />
                        <SearchableSelect
                          label="Model *"
                          options={formState.transactionType === "RETURN" && itemModels[index] ? itemModels[index] : models}
                          value={item.modelId}
                          onChange={handleItemSelectChange(index, "modelId")}
                        />
                        <SearchableSelect
                          label="Spare *"
                          options={formState.transactionType === "RETURN" && itemSpares[index] ? itemSpares[index] : spares}
                          value={item.itemId}
                          onChange={handleItemSelectChange(index, "itemId")}
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
