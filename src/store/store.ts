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
   editSpare
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;