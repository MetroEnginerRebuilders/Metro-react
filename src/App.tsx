import { Route, Routes } from 'react-router-dom'
import './App.css'
import { ToastContainer } from 'react-toastify'
import Login from './Pages/Login/Login'
import Navbar from './Components/Navbar'
import ChangePassword from './Pages/ChangePassword/ChangePassword'
import Dashboard from './Pages/Sidebar/Dashboard/Dashboard'
import ProtectedRoute from './Components/ProtectedRoute'
import Search from './Pages/Sidebar/Search/Search'
import MonthlyReports from './Pages/Sidebar/MonthlyReports/MonthlyReports'
import Jobs from './Pages/Sidebar/Jobs/Jobs'
import TransactionLogs from './Pages/Sidebar/TransactionLogs/TransactionLogs'
import Income from './Pages/Sidebar/Income/IncomeList/Income'
import Expense from './Pages/Sidebar/Expense/ExpenseList/Expense'
import Invoice from './Pages/Sidebar/Invoice/Invoice'
import Payment from './Pages/Sidebar/Payment/Payment'
import Statement from './Pages/Sidebar/Statement/Statement'
import AccountTransfer from './Pages/ProtectedTopbar/AccountTransfer/AccountTransfer'
import Model from './Pages/ProtectedTopbar/Model/ModelList/Model'
import Works from './Pages/ProtectedTopbar/Works/WorkList/Works'
import StaffDetails from './Pages/ProtectedTopbar/StaffDetails/StaffList/StaffDetails'
import StaffSalary from './Pages/ProtectedTopbar/StaffSalary/StaffSalary'
import ShopList from './Pages/ProtectedTopbar/Shops/ShopList/ShopList'
import SpareList from './Pages/ProtectedTopbar/Spare/SpareList/SpareList'
import MasterData from './Pages/Sidebar/MasterData/MasterData'
import Customer from './Pages/ProtectedTopbar/Customer/CustomerList/Customer'
import BankAccount from './Pages/ProtectedTopbar/BankAccount/BankAccountList/BankAccount'
import Company from './Pages/ProtectedTopbar/Company/CompanyList/Company'
import CreateStaffSalary from './Pages/ProtectedTopbar/StaffSalary/CreateStaffSalary'
import StockList from './Pages/Sidebar/Stock/StockList/StockList'
import CreateStock from './Pages/Sidebar/Stock/CreateStock/CreateStock'

function App() {

  return (
    <div>
      <Navbar></Navbar>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route element={<ProtectedRoute />}>
          {/* Sidebar routes  */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/master" element={<MasterData/>} />
          <Route path="/monthly-reports" element={<MonthlyReports />} />
          <Route path="/stock" element={<StockList />} />
          <Route path="/stock/create" element={<CreateStock />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/transaction-logs" element={<TransactionLogs />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenditure" element={<Expense />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/statement" element={<Statement />} />
          {/* Protected topbar  */}
          <Route path="/admin/account" element={<BankAccount />} />
          <Route path="/admin/transfer" element={<AccountTransfer />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/model" element={<Model />} />
          <Route path="/company" element={<Company />} />
          <Route path="/spare" element={<SpareList />} />
          <Route path="/shops" element={<ShopList />} />
          <Route path="/works" element={<Works />} />
          <Route path="/staff/details" element={<StaffDetails />} />
          <Route path="/staff/salary" element={<StaffSalary />} />
          <Route path="/staff-salary/create" element={<CreateStaffSalary />} />
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
