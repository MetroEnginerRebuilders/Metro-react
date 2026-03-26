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
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
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
} from "../../../../../service/invoice";
import { getStockTransactionAvailabilityApi } from "../../../../../service/stock";
import { getActiveBankAccountListApi } from "../../../../../service/bankAccount";
import { getWorkListApi } from "../../../../../service/works";
import type {
  InvoiceAddItem,
  ModelData,
  SpareData,
  AddInvoiceItemPayload,
  BankAccount,
} from "../../../../../type/invoice";
import type { Work } from "../../../../../type/works";
import { useState, useEffect, useRef } from "react";
import { commonTableHeadSx } from "../../../../../utils/tableHeaderStyle";

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

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [works, setWorks] = useState<Work[]>([]);

  const [addItemsRows, setAddItemsRows] = useState<InvoiceAddItem[]>([
    {
      tempId: Math.random().toString(),
      item_type_id: "",
      type_of_work: "",
      work_id: "",
      company_id: "",
      model_id: "",
      spare_id: "",
      remarks: "",
      quantity: "1",
      unit_price: "0",
      bank_account_id: "",
    },
  ]);
  const [modelsByIndex, setModelsByIndex] = useState<Record<string, ModelData[]>>({});
  const [sparesByIndex, setSparesByIndex] = useState<Record<string, SpareData[]>>({});
  const [companyLoadingByRow, setCompanyLoadingByRow] = useState<Record<string, boolean>>({});
  const [modelLoadingByRow, setModelLoadingByRow] = useState<Record<string, boolean>>({});
  const [spareLoadingByRow, setSpareLoadingByRow] = useState<Record<string, boolean>>({});
  const [workLoadingByRow, setWorkLoadingByRow] = useState<Record<string, boolean>>({});
  const companySearchTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const modelSearchTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const spareSearchTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const workSearchTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    return () => {
      Object.values(companySearchTimers.current).forEach((timer) => clearTimeout(timer));
      Object.values(modelSearchTimers.current).forEach((timer) => clearTimeout(timer));
      Object.values(spareSearchTimers.current).forEach((timer) => clearTimeout(timer));
      Object.values(workSearchTimers.current).forEach((timer) => clearTimeout(timer));
    };
  }, []);
  useEffect(() => {
    if (open) {
      fetchAddItemsDropdowns();
    }
  }, [open]);

  const fetchAddItemsDropdowns = async () => {
    dispatch(setLoading(true));
    try {
      const [typesRes, companiesRes, bankAccountsRes, worksRes] = await Promise.all([
        getInvoiceItemTypesApi(),
        getStockTransactionCompaniesApi(),
        getActiveBankAccountListApi(),
        getWorkListApi({ page: 1, limit: 200 }),
      ]);

      if (typesRes.success && typesRes.data) {
        dispatch(setItemTypes(typesRes.data));
      } else {
      }

      if (companiesRes.success && companiesRes.data) {
        dispatch(setCompanies(companiesRes.data));
      }

      if (bankAccountsRes.success && bankAccountsRes.data) {
        setBankAccounts(bankAccountsRes.data);
      }

      if (worksRes.success && worksRes.data) {
        setWorks(worksRes.data);
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
        work_id: "",
        company_id: "",
        model_id: "",
        spare_id: "",
        remarks: "",
        quantity: "1",
        unit_price: "0",
        bank_account_id: "",
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
              work_id: "",
              company_id: "",
              model_id: "",
              spare_id: "",
              bank_account_id: "",
              quantity: "1",
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

  const handleWorkChange = (tempId: string, workId: string) => {
    handleRowChange(tempId, "work_id", workId);
  };

  const handleWorkSearchInput = (tempId: string, searchText: string) => {
    if (workSearchTimers.current[tempId]) {
      clearTimeout(workSearchTimers.current[tempId]);
    }

    workSearchTimers.current[tempId] = setTimeout(async () => {
      setWorkLoadingByRow((prev) => ({ ...prev, [tempId]: true }));

      try {
        const response = await getWorkListApi({
          page: 1,
          limit: 200,
          search: searchText || undefined,
        });

        if (response.success && response.data) {
          setWorks(response.data);
        }
      } catch {
        toast.error("Failed to search works");
      } finally {
        setWorkLoadingByRow((prev) => ({ ...prev, [tempId]: false }));
      }
    }, 350);
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

  const applySpareBoughtPrice = async (
    tempId: string,
    companyId: string,
    modelId: string,
    spareId: string,
    itemTypeId: string
  ) => {
    const selectedItemType = itemTypes.find((type) => type.item_type_id === itemTypeId);
    if (selectedItemType?.item_type_code !== "SPARE") {
      return;
    }

    try {
      const response = await getStockTransactionAvailabilityApi({
        companyId,
        modelId,
        spareId,
      });

      if (response.success && response.data) {
        setAddItemsRows((prev) =>
          prev.map((row) =>
            row.tempId === tempId
              ? { ...row, unit_price: String(response.data.boughtPrice ?? "0") }
              : row
          )
        );
      }
    } catch (error) {
      toast.error("Failed to fetch stock availability");
    }
  };

  const handleBankAccountChange = (tempId: string, bankAccountId: string) => {
    handleRowChange(tempId, "bank_account_id", bankAccountId);
  };

  const handleSpareChange = (tempId: string, spareId: string) => {
    handleRowChange(tempId, "spare_id", spareId);

    const selectedRow = addItemsRows.find((row) => row.tempId === tempId);
    if (!selectedRow) return;

    if (!spareId) {
      handleRowChange(tempId, "unit_price", "0");
      return;
    }

    if (selectedRow.company_id && selectedRow.model_id) {
      applySpareBoughtPrice(
        tempId,
        selectedRow.company_id,
        selectedRow.model_id,
        spareId,
        selectedRow.item_type_id
      );
    }
  };

  const handleCompanySearchInput = (tempId: string, searchText: string) => {
    if (companySearchTimers.current[tempId]) {
      clearTimeout(companySearchTimers.current[tempId]);
    }

    companySearchTimers.current[tempId] = setTimeout(async () => {
      setCompanyLoadingByRow((prev) => ({ ...prev, [tempId]: true }));

      try {
        const response = await getStockTransactionCompaniesApi();
        if (response.success && response.data) {
          const keyword = searchText.trim().toLowerCase();
          const filteredCompanies = keyword
            ? response.data.filter((company: { company_name: string }) =>
                company.company_name.toLowerCase().includes(keyword)
              )
            : response.data;

          dispatch(setCompanies(filteredCompanies));
        }
      } catch {
        toast.error("Failed to search companies");
      } finally {
        setCompanyLoadingByRow((prev) => ({ ...prev, [tempId]: false }));
      }
    }, 350);
  };

  const handleModelSearchInput = (
    tempId: string,
    companyId: string,
    searchText: string
  ) => {
    if (!companyId) {
      return;
    }

    if (modelSearchTimers.current[tempId]) {
      clearTimeout(modelSearchTimers.current[tempId]);
    }

    modelSearchTimers.current[tempId] = setTimeout(async () => {
      setModelLoadingByRow((prev) => ({ ...prev, [tempId]: true }));

      try {
        const response = await getStockTransactionModelsApi(companyId);
        if (response.success && response.data) {
          const keyword = searchText.trim().toLowerCase();
          const filteredModels = keyword
            ? response.data.filter((model: { model_name: string }) =>
                model.model_name.toLowerCase().includes(keyword)
              )
            : response.data;

          setModelsByIndex((prev) => ({
            ...prev,
            [tempId]: filteredModels,
          }));
        }
      } catch {
        toast.error("Failed to search models");
      } finally {
        setModelLoadingByRow((prev) => ({ ...prev, [tempId]: false }));
      }
    }, 350);
  };

  const handleSpareSearchInput = (
    tempId: string,
    modelId: string,
    searchText: string
  ) => {
    if (!modelId) {
      return;
    }

    if (spareSearchTimers.current[tempId]) {
      clearTimeout(spareSearchTimers.current[tempId]);
    }

    spareSearchTimers.current[tempId] = setTimeout(async () => {
      setSpareLoadingByRow((prev) => ({ ...prev, [tempId]: true }));

      try {
        const response = await getStockTransactionSparesApi(modelId);
        if (response.success && response.data) {
          const keyword = searchText.trim().toLowerCase();
          const filteredSpares = keyword
            ? response.data.filter((spare: { spare_name: string }) =>
                spare.spare_name.toLowerCase().includes(keyword)
              )
            : response.data;

          setSparesByIndex((prev) => ({
            ...prev,
            [tempId]: filteredSpares,
          }));
        }
      } catch {
        toast.error("Failed to search spares");
      } finally {
        setSpareLoadingByRow((prev) => ({ ...prev, [tempId]: false }));
      }
    }, 350);
  };

  const handleCompanyChange = async (tempId: string, companyId: string) => {
    setAddItemsRows(
      addItemsRows.map((row) =>
        row.tempId === tempId
          ? { ...row, company_id: companyId, model_id: "", spare_id: "", unit_price: "0" }
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
        row.tempId === tempId ? { ...row, model_id: modelId, spare_id: "", unit_price: "0" } : row
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
      const selectedItemType = itemTypes.find(
        (type) => type.item_type_id === row.item_type_id
      );
      const itemTypeCode = selectedItemType?.item_type_code;
      const isWork = itemTypeCode === "WORK";
      const isSpare = itemTypeCode === "SPARE";
      const isDiscount = itemTypeCode === "DISCOUNT";
      const isCommission = itemTypeCode === "COMMISSION";

      if (!row.item_type_id) {
        toast.error(`Please select item type for row ${i + 1}`);
        return;
      }

      // DISCOUNT validation: unit_price is mandatory
      if (isDiscount) {
        if (!row.unit_price || parseFloat(row.unit_price) < 0) {
          toast.error(`Please enter valid unit price for row ${i + 1} (DISCOUNT)`);
          return;
        }
      }
      // WORK validation: work_id, quantity, unit_price are mandatory
      else if (isWork) {
        if (!row.work_id) {
          toast.error(`Please select work for row ${i + 1} (WORK)`);
          return;
        }
        if (!row.quantity || parseFloat(row.quantity) <= 0) {
          toast.error(`Please enter valid quantity for row ${i + 1} (WORK)`);
          return;
        }
        if (!row.unit_price || parseFloat(row.unit_price) < 0) {
          toast.error(`Please enter valid unit price for row ${i + 1} (WORK)`);
          return;
        }
      }
      // SPARE validation: company, model, spare, quantity, unit_price are mandatory
      else if (isSpare) {
        if (!row.company_id) {
          toast.error(`Please select company for row ${i + 1} (SPARE)`);
          return;
        }
        if (!row.model_id) {
          toast.error(`Please select model for row ${i + 1} (SPARE)`);
          return;
        }
        if (!row.spare_id) {
          toast.error(`Please select spare for row ${i + 1} (SPARE)`);
          return;
        }
        if (!row.quantity || parseFloat(row.quantity) <= 0) {
          toast.error(`Please enter valid quantity for row ${i + 1} (SPARE)`);
          return;
        }
        if (!row.unit_price || parseFloat(row.unit_price) < 0) {
          toast.error(`Please enter valid unit price for row ${i + 1} (SPARE)`);
          return;
        }
      }
      // COMMISSION validation: bank_account_id and unit_price are mandatory
      else if (isCommission) {
        if (!row.bank_account_id) {
          toast.error(`Please select bank account for row ${i + 1} (COMMISSION)`);
          return;
        }
        if (!row.unit_price || parseFloat(row.unit_price) < 0) {
          toast.error(`Please enter valid unit price for row ${i + 1} (COMMISSION)`);
          return;
        }
      }
    }

    // Transform data to API payload format
    const items: AddInvoiceItemPayload[] = addItemsRows.map((row) => {
      const selectedItemType = itemTypes.find(
        (type) => type.item_type_id === row.item_type_id
      );
      const itemTypeCode = selectedItemType?.item_type_code;
      const isWork = itemTypeCode === "WORK";
      const isSpare = itemTypeCode === "SPARE";
      const isDiscount = itemTypeCode === "DISCOUNT";
      const isCommission = itemTypeCode === "COMMISSION";

      return {
        item_type_id: row.item_type_id,
        work_id: isWork ? row.work_id || undefined : undefined,
        company_id: isSpare ? row.company_id || undefined : undefined,
        model_id: isSpare ? row.model_id || undefined : undefined,
        spare_id: isSpare ? row.spare_id || undefined : undefined,
        remarks: row.remarks || undefined,
        quantity:
          isDiscount || isCommission ? 1 : parseFloat(row.quantity || "1"),
        unit_price: parseFloat(row.unit_price),
        bank_account_id: isCommission ? row.bank_account_id || undefined : undefined,
      };
    });

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
        work_id: "",
        company_id: "",
        model_id: "",
        spare_id: "",
        remarks: "",
        quantity: "1",
        unit_price: "0",
        bank_account_id: "",
      },
    ]);
    setModelsByIndex({});
    setSparesByIndex({});
    onClose();
  };

  const showTypeOfWorkColumn = addItemsRows.some((row) => {
    const itemTypeCode = itemTypes.find(
      (type) => type.item_type_id === row.item_type_id
    )?.item_type_code;
    return !itemTypeCode || itemTypeCode === "WORK";
  });

  const showBankAccountColumn = addItemsRows.some((row) => {
    const itemTypeCode = itemTypes.find(
      (type) => type.item_type_id === row.item_type_id
    )?.item_type_code;
    return !itemTypeCode || itemTypeCode === "COMMISSION";
  });

  const showCompanyColumn = addItemsRows.some((row) => {
    const itemTypeCode = itemTypes.find(
      (type) => type.item_type_id === row.item_type_id
    )?.item_type_code;
    return !itemTypeCode || itemTypeCode === "SPARE";
  });

  const showModelColumn = showCompanyColumn;
  const showSpareColumn = showCompanyColumn;

  const showQuantityColumn = addItemsRows.some((row) => {
    const itemTypeCode = itemTypes.find(
      (type) => type.item_type_id === row.item_type_id
    )?.item_type_code;
    return !itemTypeCode || itemTypeCode === "WORK" || itemTypeCode === "SPARE";
  });

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
            <TableHead sx={commonTableHeadSx}>
              <TableRow>
                <TableCell style={{ fontWeight: "bold", flex: 1 }}>
                  Item Type <span style={{ color: "red" }}>*</span>
                </TableCell>
                {showTypeOfWorkColumn && (
                  <TableCell style={{ fontWeight: "bold", flex: 1 }}>Type of Work</TableCell>
                )}
                {showBankAccountColumn && (
                  <TableCell style={{ fontWeight: "bold", flex: 1 }}>Bank Account</TableCell>
                )}
                {showCompanyColumn && (
                  <TableCell style={{ fontWeight: "bold", flex: 1 }}>Company</TableCell>
                )}
                {showModelColumn && (
                  <TableCell style={{ fontWeight: "bold", flex: 1 }}>Model</TableCell>
                )}
                {showSpareColumn && (
                  <TableCell style={{ fontWeight: "bold", flex: 1 }}>Spare</TableCell>
                )}
                <TableCell style={{ fontWeight: "bold", flex: 1 }}>Remarks</TableCell>
                {showQuantityColumn && (
                  <TableCell style={{ fontWeight: "bold", width: "100px" }}>Quantity</TableCell>
                )}
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
                // const isDiscount = itemTypeCode === "DISCOUNT";
                const isCommission = itemTypeCode === "COMMISSION";
                const isTypeNotSelected = !itemTypeCode;

                const showTypeOfWork = isTypeNotSelected || isWork;
                const showBankAccount = isTypeNotSelected || isCommission;
                const showCompany = isTypeNotSelected || isSpare;
                const showModel = isTypeNotSelected || isSpare;
                const showSpare = isTypeNotSelected || isSpare;
                const showQuantity = isTypeNotSelected || isWork || isSpare;

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
                  {showTypeOfWorkColumn && (
                    <TableCell style={{ flex: 1, padding: "4px" }}>
                      {showTypeOfWork ? (
                        <Autocomplete
                          size="small"
                          options={works}
                          getOptionLabel={(option) =>
                            typeof option === "string" ? option : option.work_name
                          }
                          value={
                            works.find((work) => work.work_id === row.work_id) ||
                            null
                          }
                          onChange={(_, newValue) => {
                            handleWorkChange(row.tempId, newValue?.work_id || "");
                          }}
                          onInputChange={(_, inputValue, reason) => {
                            if (reason === "input") {
                              handleWorkSearchInput(row.tempId, inputValue);
                            }
                          }}
                          loading={!!workLoadingByRow[row.tempId]}
                          disabled={loading}
                          isOptionEqualToValue={(option, value) =>
                            option.work_id === value?.work_id
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={isWork ? "Select (Required)" : "Select"}
                              error={isWork && !row.work_id}
                            />
                          )}
                          noOptionsText="No works available"
                        />
                      ) : null}
                    </TableCell>
                  )}
                  {showBankAccountColumn && (
                    <TableCell style={{ flex: 1, padding: "4px" }}>
                      {showBankAccount ? (
                      <Autocomplete
                        size="small"
                        options={bankAccounts}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : (option.account_name || option.account_number || "")
                        }
                        value={
                          bankAccounts.find((acc) => acc.bank_account_id === row.bank_account_id) ||
                          null
                        }
                        onChange={(_, newValue) => {
                          handleBankAccountChange(row.tempId, newValue?.bank_account_id || "");
                        }}
                        disabled={loading}
                        isOptionEqualToValue={(option, value) =>
                          option.bank_account_id === value?.bank_account_id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={isCommission ? "Select (Required)" : "Select"}
                            error={isCommission && !row.bank_account_id}
                          />
                        )}
                        noOptionsText="No bank accounts available"
                      />
                      ) : null}
                    </TableCell>
                  )}
                  {showCompanyColumn && (
                    <TableCell style={{ flex: 1, padding: "4px" }}>
                      {showCompany ? (
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
                        onInputChange={(_, inputValue, reason) => {
                          if (reason === "input") {
                            handleCompanySearchInput(row.tempId, inputValue);
                          }
                        }}
                        loading={!!companyLoadingByRow[row.tempId]}
                        disabled={loading}
                        isOptionEqualToValue={(option, value) =>
                          option.company_id === value?.company_id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={isSpare ? "Select (Required)" : "Select"}
                            error={isSpare && !row.company_id}
                          />
                        )}
                        noOptionsText="No companies available"
                      />
                      ) : null}
                    </TableCell>
                  )}
                  {showModelColumn && (
                    <TableCell style={{ flex: 1, padding: "4px" }}>
                      {showModel ? (
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
                        onInputChange={(_, inputValue, reason) => {
                          if (reason === "input") {
                            handleModelSearchInput(row.tempId, row.company_id, inputValue);
                          }
                        }}
                        loading={!!modelLoadingByRow[row.tempId]}
                        disabled={!row.company_id || loading}
                        isOptionEqualToValue={(option, value) =>
                          option.model_id === value?.model_id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={isSpare ? "Select (Required)" : "Select"}
                            error={isSpare && !row.model_id}
                          />
                        )}
                        noOptionsText="No models available"
                      />
                      ) : null}
                    </TableCell>
                  )}
                  {showSpareColumn && (
                    <TableCell style={{ flex: 1, padding: "4px" }}>
                      {showSpare ? (
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
                        onInputChange={(_, inputValue, reason) => {
                          if (reason === "input") {
                            handleSpareSearchInput(row.tempId, row.model_id, inputValue);
                          }
                        }}
                        loading={!!spareLoadingByRow[row.tempId]}
                        disabled={!row.model_id || loading}
                        isOptionEqualToValue={(option, value) =>
                          option.spare_id === value?.spare_id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={isSpare ? "Select (Required)" : "Select"}
                            error={isSpare && !row.spare_id}
                          />
                        )}
                        noOptionsText="No spares available"
                      />
                      ) : null}
                    </TableCell>
                  )}
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
                  {showQuantityColumn && (
                    <TableCell style={{ width: "100px", padding: "4px" }}>
                      {showQuantity ? (
                      <TextField
                        size="small"
                        type="text"
                        value={row.quantity}
                        onChange={(e) => handleQuantityChange(row.tempId, e.target.value)}
                        placeholder={isWork || isSpare ? "Req'd" : "Qty"}
                        inputProps={{ min: 1, step: "1" }}
                        error={showQuantity && !row.quantity}
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
                      ) : null}
                    </TableCell>
                  )}
                  <TableCell style={{ width: "100px", padding: "4px" }}>
                    <TextField
                      size="small"
                      type="text"
                      value={row.unit_price}
                      onChange={(e) => handleUnitPriceChange(row.tempId, e.target.value)}
                      placeholder="Price (Required)"
                      inputProps={{ min: 0, step: "0.01" }}
                      error={!row.unit_price}
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
