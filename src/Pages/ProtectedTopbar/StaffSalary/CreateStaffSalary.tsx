import {
  Button,
  TextField,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import type { AppDispatch, RootState } from "../../../store/store";
import { setField, resetForm } from "./CreateStaffSalary.slice";
import type { CreateStaffSalaryState } from "../../../type/staffSalary";
import type { Staff } from "../../../type/staff";
import type { BankAccount } from "../../../type/bankAccount";
import type { SalaryType } from "../../../type/salaryType";
import {
  createStaffSalaryApi,
  getStaffSalaryMonthSummaryApi,
} from "../../../service/staffSalary";
import { getActiveStaffListApi } from "../../../service/staff";
import { getActiveBankAccountListApi } from "../../../service/bankAccount";
import { getSalaryTypeListApi } from "../../../service/salaryType";
import Breadcrumb from "../../../Components/Breadcrumb";
import SearchableSelect from "../../../Components/SearchableSelect";

function CreateStaffSalary() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { staff_id, bank_account_id, effective_date, amount, salary_type_id, remarks } = useSelector(
    (state: RootState) => state.createStaffSalary
  );

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [salaryTypes, setSalaryTypes] = useState<SalaryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    fetchDropdownData();
    if (!effective_date) {
      const today = new Date().toISOString().split("T")[0];
      dispatch(setField({ field: "effective_date", value: today }));
    }
  }, []);

  const fetchDropdownData = async () => {
    setLoadingDropdowns(true);
    try {
      const [staffResponse, bankResponse, salaryTypeResponse] = await Promise.all([
        getActiveStaffListApi({ limit: 100 }),
        getActiveBankAccountListApi(),
        getSalaryTypeListApi(),
      ]);

      if (staffResponse.success && staffResponse.data) {
        setStaffList(staffResponse.data);
      }
      if (bankResponse.success && bankResponse.data) {
        setBankAccounts(bankResponse.data);
      }
      if (salaryTypeResponse.success && salaryTypeResponse.data) {
        setSalaryTypes(salaryTypeResponse.data);
      }
    } catch (error: any) {
      toast.error("Failed to load dropdown data", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoadingDropdowns(false);
    }
  };

  const handleChange = (field: keyof CreateStaffSalaryState, value: string) => {
    dispatch(setField({ field, value }));
  };

  const fetchStaffSalarySummary = async (staffId: string) => {
    setLoadingSummary(true);
    try {
      const response = await getStaffSalaryMonthSummaryApi(staffId);
      if (response.success && response.data) {
        const balanceValue =
          response.data.balance_salary ??
          response.data.balance_amount ??
          0;
        dispatch(setField({ field: "amount", value: String(balanceValue) }));
      } else {
        dispatch(setField({ field: "amount", value: "" }));
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch staff salary summary",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    if (!staff_id) {
      dispatch(setField({ field: "amount", value: "" }));
      return;
    }

    fetchStaffSalarySummary(staff_id);
  }, [staff_id, dispatch]);

  // Prepare options for SearchableSelect
  const staffOptions = useMemo(() => 
    staffList.map((staff) => ({
      value: staff.staff_id,
      label: staff.staff_name,
    })),
    [staffList]
  );

  const bankAccountOptions = useMemo(() =>
    bankAccounts.map((account) => ({
      value: account.bank_account_id,
      label: (account.account_number || "").trim()
        ? `${account.account_name} - ${account.account_number}`
        : account.account_name,
    })),
    [bankAccounts]
  );

  const salaryTypeOptions = useMemo(() =>
    salaryTypes.map((type) => ({
      value: type.salary_type_id,
      label: type.salary_type,
    })),
    [salaryTypes]
  );

  const handleSubmit = async () => {
    // Validation
    if (!staff_id) {
      toast.error("Please select staff", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!bank_account_id) {
      toast.error("Please select bank account", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!effective_date) {
      toast.error("Effective date is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!amount?.trim()) {
      toast.error("Amount is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Amount must be a valid positive number", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!salary_type_id) {
      toast.error("Please select salary type", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        staffId: staff_id,
        bankAccountId: bank_account_id,
        effectiveDate: effective_date,
        amount: amountValue,
        salaryTypeId: salary_type_id,
        remarks: remarks,
      };

      const result = await createStaffSalaryApi(payload);
      
      if (result.success) {
        toast.success(result.message || "Staff salary created successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(resetForm());
        navigate("/staff/salary");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to create staff salary";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
            { label: "Masterdata", path: "/master" },
    { label: "Staff Salary", path: "/staff/salary" },
    { label: "Pay Salary" }
  ];

  return (
    <div className="flex flex-col">
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Header Section */}
      <div className="flex-shrink-0 px-3 py-2 bg-gray-100">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
          PAY SALARY
        </h1>
      </div>

      {/* Form Section */}
      <div className="flex-1 px-3 py-4">
        <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <SearchableSelect
              label="Staff"
              value={staff_id}
              onChange={(value) => handleChange("staff_id", value)}
              options={staffOptions}
              loading={loadingDropdowns}
              disabled={loadingDropdowns}
              required
              size="small"
            />

            <SearchableSelect
              label="Bank Account"
              value={bank_account_id}
              onChange={(value) => handleChange("bank_account_id", value)}
              options={bankAccountOptions}
              loading={loadingDropdowns}
              disabled={loadingDropdowns}
              required
              size="small"
            />

            <TextField
              label="Effective Date"
              value={effective_date}
              onChange={(e) => handleChange("effective_date", e.target.value)}
              fullWidth
              required
              size="small"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: new Date().toISOString().split("T")[0],
              }}
            />

            <TextField
              label="Amount"
              value={amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              fullWidth
              required
              size="small"
              type="text"
              disabled={loadingSummary}
              inputProps={{ step: "0.01", min: "0" }}
            />

            <SearchableSelect
              label="Salary Type"
              value={salary_type_id}
              onChange={(value) => handleChange("salary_type_id", value)}
              options={salaryTypeOptions}
              loading={loadingDropdowns}
              disabled={loadingDropdowns}
              required
              size="small"
            />

            <TextField
              label="Remarks"
              value={remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={3}
            />

            <Button 
              variant="contained" 
              onClick={handleSubmit} 
              disabled={loading || loadingDropdowns}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Pay Salary"}
            </Button>
          </div>
        </Paper>
      </div>
    </div>
  );
}

export default CreateStaffSalary;
