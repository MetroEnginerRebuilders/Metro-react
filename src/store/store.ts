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
   editCompany
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;