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
	CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setField, setItemField, setFormData, addItem, removeItem, resetForm, type EditStockState, type EditStockItem } from "./EditStock.slice";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import SearchableSelect from "../../../../Components/SearchableSelect";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../Components/Breadcrumb";
import { getShopListApi } from "../../../../service/shops";
import { getCompanyListApi } from "../../../../service/company";
import { getModelListApi } from "../../../../service/model";
import { getSpareListApi } from "../../../../service/spare";
import { getStockTypeListApi } from "../../../../service/stockType";
import {
	getStockTransactionAvailabilityApi,
	getStockTransactionByIdApi,
	getStockTransactionCompaniesApi,
	getStockTransactionModelsApi,
	getStockTransactionSparesApi,
	updateStockApi,
} from "../../../../service/stock";

function EditStock() {
	const navigate = useNavigate();
	const { stockTransactionId } = useParams<{ stockTransactionId: string }>();
	const dispatch = useAppDispatch();
	const formState = useAppSelector((state) => state.editStock);
	const [loading, setLoading] = useState(false);
	const [loadingInitialData, setLoadingInitialData] = useState(false);

	const [shops, setShops] = useState<{ value: string; label: string }[]>([]);
	const [companies, setCompanies] = useState<{ value: string; label: string }[]>([]);
	const [models, setModels] = useState<{ value: string; label: string }[]>([]);
	const [spares, setSpares] = useState<{ value: string; label: string }[]>([]);
	const [stockTypes, setStockTypes] = useState<{ value: string; label: string; code: string }[]>([]);
	const [itemModels, setItemModels] = useState<Record<number, { value: string; label: string }[]>>({});
	const [itemSpares, setItemSpares] = useState<Record<number, { value: string; label: string }[]>>({});

	useEffect(() => {
		const loadInitialData = async () => {
			if (!stockTransactionId) {
				toast.error("Stock transaction ID is missing");
				return;
			}

			setLoadingInitialData(true);
			try {
				const [shopsResponse, companiesResponse, modelsResponse, sparesResponse, stockTypesResponse, detailsResponse] = await Promise.all([
					getShopListApi({ page: 1, limit: 100 }),
					getCompanyListApi({ page: 1, limit: 100 }),
					getModelListApi({ page: 1, limit: 100 }),
					getSpareListApi({ page: 1, limit: 100 }),
					getStockTypeListApi(),
					getStockTransactionByIdApi(stockTransactionId),
				]);

				if (shopsResponse.success && shopsResponse.data) {
					setShops(shopsResponse.data.map((shop) => ({ value: shop.shop_id, label: shop.shop_name })));
				}

				if (companiesResponse.success && companiesResponse.data) {
					setCompanies(companiesResponse.data.map((company) => ({ value: company.company_id, label: company.company_name })));
				}

				if (modelsResponse.success && modelsResponse.data) {
					setModels(modelsResponse.data.map((model) => ({ value: model.model_id, label: model.model_name })));
				}

				if (sparesResponse.success && sparesResponse.data) {
					setSpares(sparesResponse.data.map((spare) => ({ value: spare.spare_id.toString(), label: spare.spare_name })));
				}

				if (stockTypesResponse.success && stockTypesResponse.data) {
					const types = stockTypesResponse.data.map((type) => ({
						value: type.stock_type_id,
						label: type.stock_type_name,
						code: type.stock_type_code,
					}));
					setStockTypes(types);
				}

				if (detailsResponse.success && detailsResponse.data) {
					const transaction = detailsResponse.data;
					const items = detailsResponse.data.items || [];

					const mappedItems: EditStockItem[] = items.length
						? items.map((item) => ({
								companyId: item.company_id || "",
								modelId: item.model_id || "",
								itemId: item.spare_id || "",
								quantity: String(item.quantity ?? ""),
								unitPrice: String(item.price ?? ""),
								lineTotal: String(item.line_total ?? "0"),
							}))
						: [{ companyId: "", modelId: "", itemId: "", quantity: "", unitPrice: "", lineTotal: "0" }];

					const totalAmount = mappedItems
						.reduce((sum, item) => sum + (parseFloat(item.lineTotal) || 0), 0)
						.toFixed(2);

					dispatch(
						setFormData({
							shopId: transaction.shop_id || "",
							transactionType: transaction.stock_type_code || "PURCHASE",
							transactionTypeId: transaction.stock_type_id || "",
							bankAccountId: transaction.bank_account_id || "",
							orderDate: transaction.order_date ? new Date(transaction.order_date).toISOString().split("T")[0] : "",
							description: transaction.description || "",
							items: mappedItems,
							totalAmount,
						})
					);
				} else {
					toast.error(detailsResponse.message || "Failed to fetch stock details");
				}
			} catch (error: any) {
				toast.error(error?.response?.data?.message || "Failed to load edit stock data");
			} finally {
				setLoadingInitialData(false);
			}
		};

		loadInitialData();

		return () => {
			dispatch(resetForm());
		};
	}, [dispatch, stockTransactionId]);

	const fetchCompaniesByTransactionType = async (transactionType: string) => {
		try {
			if (transactionType === "RETURN") {
				const response = await getStockTransactionCompaniesApi();
				if (response.success && response.data) {
					setCompanies(response.data.map((company) => ({ value: company.company_id, label: company.company_name })));
				}
			} else {
				const response = await getCompanyListApi({ page: 1, limit: 100 });
				if (response.success && response.data) {
					setCompanies(response.data.map((company) => ({ value: company.company_id, label: company.company_name })));
				}
			}
		} catch {
			toast.error("Failed to load companies");
		}
	};

	useEffect(() => {
		if (formState.transactionType) {
			fetchCompaniesByTransactionType(formState.transactionType);
		}
	}, [formState.transactionType]);

	const breadcrumbItems = [
		{ label: "Home", path: "/" },
		{ label: "Stock", path: "/stock" },
		{ label: "Edit Stock" },
	];

	const handleSelectChange = (field: keyof Omit<EditStockState, "items">) => (value: string) => {
		dispatch(setField({ field, value }));
	};

	const handleTextFieldChange =
		(field: keyof Omit<EditStockState, "items">) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			dispatch(setField({ field, value: e.target.value }));
		};

	const handleTransactionTypeChange = (e: any) => {
		const value = e.target.value;
		dispatch(setField({ field: "transactionType", value }));
		const selectedType = stockTypes.find((type) => type.code === value);
		if (selectedType) {
			dispatch(setField({ field: "transactionTypeId", value: selectedType.value }));
		}
	};

	const applyAvailabilityBoughtPrice = async (index: number, companyId: string, modelId: string, spareId: string) => {
		try {
			const response = await getStockTransactionAvailabilityApi({ companyId, modelId, spareId });
			if (response.success && response.data) {
				dispatch(setItemField({ index, field: "unitPrice", value: String(response.data.boughtPrice ?? "") }));
			}
		} catch {
			toast.error("Failed to fetch stock availability");
		}
	};

	const handleItemSelectChange =
		(index: number, field: keyof EditStockItem) =>
		async (value: string) => {
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

			if (formState.transactionType === "RETURN" && field === "companyId" && value) {
				const response = await getStockTransactionModelsApi(value);
				if (response.success && response.data) {
					setItemModels((prev) => ({
						...prev,
						[index]: response.data.map((model) => ({ value: model.model_id, label: model.model_name })),
					}));
				}
			}

			if (formState.transactionType === "RETURN" && field === "modelId" && value) {
				const response = await getStockTransactionSparesApi(value);
				if (response.success && response.data) {
					setItemSpares((prev) => ({
						...prev,
						[index]: response.data.map((spare) => ({ value: spare.spare_id, label: spare.spare_name })),
					}));
				}
			}

			if (formState.transactionType === "RETURN" && selectedCompanyId && selectedModelId && selectedSpareId) {
				await applyAvailabilityBoughtPrice(index, selectedCompanyId, selectedModelId, selectedSpareId);
			}
		};

	const handleItemTextFieldChange = (index: number, field: keyof EditStockItem) => (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(setItemField({ index, field, value: e.target.value }));
	};

	const handleSubmit = async () => {
		if (!stockTransactionId) {
			toast.error("Stock transaction ID is missing");
			return;
		}

		if (!formState.shopId) {
			toast.error("Please select a shop");
			return;
		}
		if (!formState.orderDate) {
			toast.error("Please select order date");
			return;
		}

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
			const payload = {
				shopId: formState.shopId,
				transactionTypeId: formState.transactionTypeId,
				bankAccountId: formState.bankAccountId,
				orderDate: formState.orderDate,
				description: formState.description,
				items: formState.items.map((item) => ({
					companyId: item.companyId,
					modelId: item.modelId,
					itemId: item.itemId,
					quantity: parseFloat(item.quantity),
					unitPrice: parseFloat(item.unitPrice),
					lineTotal: parseFloat(item.lineTotal),
				})),
				totalAmount: parseFloat(formState.totalAmount),
			};

			const response = await updateStockApi(stockTransactionId, payload);
			if (response.success) {
				toast.success(response.message || "Stock updated successfully");
				navigate("/stock");
			} else {
				toast.error(response.message || "Failed to update stock");
			}
		} catch (error: any) {
			toast.error(error?.response?.data?.message || "Failed to update stock");
		} finally {
			setLoading(false);
		}
	};

	if (loadingInitialData) {
		return (
			<div className="flex h-screen items-center justify-center">
				<CircularProgress />
			</div>
		);
	}

	return (
		<div className="flex flex-col h-screen">
			<Breadcrumb items={breadcrumbItems} />

			<div className="flex-shrink-0 px-4 py-3">
				<Typography variant="h5" component="h1" fontWeight="600">
					Edit Stock
				</Typography>
			</div>

			<div className="flex-1 overflow-y-auto px-4 pb-4">
				<Box>
					<Card>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
								<SearchableSelect
									label="Shop *"
									options={shops}
									value={formState.shopId}
									onChange={handleSelectChange("shopId")}
								/>
							</div>

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
									inputProps={{ max: new Date().toISOString().split("T")[0] }}
								/>
							</div>

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

							<div>
								<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
									<Typography variant="h6" component="div">
										Items
									</Typography>
									<Button variant="outlined" size="small" startIcon={<FiPlus />} onClick={() => dispatch(addItem())}>
										Add Item
									</Button>
								</Box>

								{formState.items.map((item, index) => (
									<Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: "#f9fafb" }}>
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
													<IconButton size="small" color="error" onClick={() => dispatch(removeItem(index))}>
														<FiTrash2 />
													</IconButton>
												</div>
											)}
										</div>
									</Paper>
								))}
							</div>

							<Divider sx={{ my: 3 }} />
							<Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2, mb: 2 }}>
								<Typography variant="h6" component="div">
									Total Amount:
								</Typography>
								<Typography variant="h5" component="div" color="primary" fontWeight="bold">
									₹{formState.totalAmount}
								</Typography>
							</Box>

							<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
								<Button variant="outlined" onClick={() => navigate("/stock")}>Cancel</Button>
								<Button variant="contained" onClick={handleSubmit} disabled={loading}>
									{loading ? "Updating..." : "Update Stock"}
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Box>
			</div>
		</div>
	);
}

export default EditStock;
