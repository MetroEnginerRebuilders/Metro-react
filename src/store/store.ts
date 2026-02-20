import { configureStore } from "@reduxjs/toolkit";
import login  from "../Pages/Login/Login.slice.ts";
import ChangePassword from "../Pages/ChangePassword/ChangePassword.slice.ts";
import worklist from "../Pages/ProtectedTopbar/Works/WorkList/Works.slice.ts";
import createWork from "../Pages/ProtectedTopbar/Works/CreateWork/CreateWork.slice.ts";
import editWork from "../Pages/ProtectedTopbar/Works/EditWork/EditWork.slice.ts";
import shoplist from "../Pages/ProtectedTopbar/Shops/ShopList/ShopList.slice.ts";
import createShop from "../Pages/ProtectedTopbar/Shops/CreateShop/CreateShop.slice.ts";
import editShop from "../Pages/ProtectedTopbar/Shops/EditShop/EditShop.slice.ts";
import sparelist from "../Pages/ProtectedTopbar/Spare/SpareList/SpareList.slice.ts";
import createSpare from "../Pages/ProtectedTopbar/Spare/CreateSpare/CreateSpare.slice.ts";
import editSpare from "../Pages/ProtectedTopbar/Spare/EditSpare/EditSpare.slice.ts";
import customerlist from "../Pages/ProtectedTopbar/Customer/CustomerList/CustomerList.slice.ts";
import createCustomer from "../Pages/ProtectedTopbar/Customer/CreateCustomer/CreateCustomer.slice.ts";
import editCustomer from "../Pages/ProtectedTopbar/Customer/EditCustomer/EditCustomer.slice.ts";
import modellist from "../Pages/ProtectedTopbar/Model/ModelList/ModelList.slice.ts";
import createModel from "../Pages/ProtectedTopbar/Model/CreateModel/CreateModel.slice.ts";
import editModel from "../Pages/ProtectedTopbar/Model/EditModel/EditModel.slice.ts";
import bankAccountList from "../Pages/ProtectedTopbar/BankAccount/BankAccountList/BankAccountList.slice.ts";
import createBankAccount from "../Pages/ProtectedTopbar/BankAccount/CreateBankAccount/CreateBankAccount.slice.ts";
import editBankAccount from "../Pages/ProtectedTopbar/BankAccount/EditBankAccount/EditBankAccount.slice.ts";
import companyList from "../Pages/ProtectedTopbar/Company/CompanyList/CompanyList.slice.ts";
import createCompany from "../Pages/ProtectedTopbar/Company/CreateCompany/CreateCompany.slice.ts";
import editCompany from "../Pages/ProtectedTopbar/Company/EditCompany/EditCompany.slice.ts";
import accountTransfer from "../Pages/ProtectedTopbar/AccountTransfer/AccountTransfer.slice.ts";
import staffList from "../Pages/ProtectedTopbar/StaffDetails/StaffList/StaffList.slice.ts";
import createStaff from "../Pages/ProtectedTopbar/StaffDetails/CreateStaff/CreateStaff.slice.ts";
import editStaff from "../Pages/ProtectedTopbar/StaffDetails/EditStaff/EditStaff.slice.ts";
import staffSalaryList from "../Pages/ProtectedTopbar/StaffSalary/StaffSalaryList.slice.ts";
import createStaffSalary from "../Pages/ProtectedTopbar/StaffSalary/CreateStaffSalary.slice.ts";
import editStaffSalary from "../Pages/ProtectedTopbar/StaffSalary/EditStaffSalary.slice.ts";
import incomeList from "../Pages/Sidebar/Income/IncomeList/IncomeList.slice.ts";
import createIncome from "../Pages/Sidebar/Income/CreateIncome/CreateIncome.slice.ts";
import editIncome from "../Pages/Sidebar/Income/EditIncome/EditIncome.slice.ts";
import expenseList from "../Pages/Sidebar/Expense/ExpenseList/ExpenseList.slice.ts";
import createExpense from "../Pages/Sidebar/Expense/CreateExpense/CreateExpense.slice.ts";
import editExpense from "../Pages/Sidebar/Expense/EditExpense/EditExpense.slice.ts";
import createStock from "../Pages/Sidebar/Stock/CreateStock/CreateStock.slice.ts";
import createJob from "../Pages/Sidebar/Jobs/CreateJob/CreateJob.slice.ts";
import invoiceList from "../Pages/Sidebar/Invoice/Invoice.slice.ts";
import invoiceDetail from "../Pages/Sidebar/Invoice/InvoiceDetail/InvoiceDetail.slice.ts";
import addInvoiceItems from "../Pages/Sidebar/Invoice/InvoiceDetail/AddInvoiceItems/AddInvoiceItems.slice.ts";
import payment from "../Pages/Sidebar/Invoice/InvoiceDetail/Payment/Payment.slice.ts";
import paymentDetails from "../Pages/Sidebar/Invoice/InvoiceDetail/PaymentDetails/PaymentDetails.slice.ts";

export const store = configureStore({
  reducer: {
   login,
   ChangePassword,
   worklist,
   createWork,
   editWork,
   shoplist,
   createShop,
   editShop,
   sparelist,
   createSpare,
   editSpare,
   customerlist,
   createCustomer,
   editCustomer,
   modellist,
   createModel,
   editModel,
   bankAccountList,
   createBankAccount,
   editBankAccount,
   companyList,
   createCompany,
   editCompany,
   accountTransfer,
   staffList,
   createStaff,
   editStaff,
   staffSalaryList,
   createStaffSalary,
   editStaffSalary,
   incomeList,
   createIncome,
   editIncome,
   expenseList,
   createExpense,
   editExpense,
   createStock,
   createJob,
   invoiceList,
   invoiceDetail,
   addInvoiceItems,
   payment,
   paymentDetails,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;