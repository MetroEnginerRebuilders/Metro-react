# Delete Invoice Item - Implementation Guide

## Overview
This implementation provides the complete setup for deleting invoice items by sending the `invoice_item_id` to the backend.

## Files Modified/Created

### 1. Service Layer (`src/service/invoice.ts`)

**New Function: `deleteInvoiceItemApi`**
```typescript
export const deleteInvoiceItemApi = async (
  invoiceId: string,
  invoiceItemId: string
): Promise<DeleteInvoiceItemResponse> => {
  const token = sessionStorage.getItem("token");
  const response = await axios.delete(
    `${BASE_URL}/invoice/${invoiceId}/items/${invoiceItemId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
```

**Endpoint:** `DELETE /invoice/{invoiceId}/items/{invoiceItemId}`

**Parameters:**
- `invoiceId`: string - The invoice ID
- `invoiceItemId`: string - The invoice item ID to delete

**Response:** `DeleteInvoiceItemResponse`

---

### 2. Type Definitions (`src/type/invoice.ts`)

**New Interface: `DeleteInvoiceItemResponse`**
```typescript
export interface DeleteInvoiceItemResponse {
  success: boolean;
  message?: string;
  data?: any;
}
```

---

### 3. Redux State Management (`src/Pages/Sidebar/Invoice/InvoiceDetail/AddInvoiceItems.slice.ts`)

**Updated State Interface:**
```typescript
interface AddInvoiceItemsState {
  itemTypes: InvoiceItemType[];
  companies: CompanyData[];
  loading: boolean;
  error: string | null;
  deleteLoading: boolean;        // NEW
  deleteError: string | null;    // NEW
}
```

**New Actions:**
- `setDeleteLoading(boolean)` - Sets delete operation loading state
- `setDeleteError(string)` - Sets delete operation error message
- `clearDeleteInvoiceItem()` - Clears delete operation state

---

## Usage in Components

### In InvoiceDetail Component

```typescript
import { setDeleteLoading, setDeleteError } from './AddInvoiceItems.slice';
import { deleteInvoiceItemApi } from '../../../../service/invoice';

const handleDeleteItem = async (invoiceItemId: string) => {
  dispatch(setDeleteLoading(true));
  try {
    const response = await deleteInvoiceItemApi(invoiceId, invoiceItemId);
    
    if (response.success) {
      toast.success("Item deleted successfully");
      // Refresh the invoice details to update the items list
      await fetchInvoiceDetail();
    } else {
      dispatch(setDeleteError(response.message || "Failed to delete item"));
      toast.error(response.message || "Failed to delete item");
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "Failed to delete item";
    dispatch(setDeleteError(errorMessage));
    toast.error(errorMessage);
  } finally {
    dispatch(setDeleteLoading(false));
  }
};
```

### In AddInvoiceItemsModal Component

If you want to implement delete functionality within the modal:

```typescript
const { deleteLoading } = useAppSelector((state) => state.addInvoiceItems);

const handleDeleteRow = async (tempId: string) => {
  // For temporary rows that haven't been saved yet
  if (tempId.includes('temp')) {
    setAddItemsRows(addItemsRows.filter((row) => row.tempId !== tempId));
    return;
  }

  // For saved items, call the delete API
  dispatch(setDeleteLoading(true));
  try {
    const response = await deleteInvoiceItemApi(invoiceId, tempId);
    
    if (response.success) {
      toast.success("Item deleted successfully");
      setAddItemsRows(addItemsRows.filter((row) => row.tempId !== tempId));
      // Optionally refresh parent
      onAddItems([]);
    } else {
      toast.error(response.message || "Failed to delete item");
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to delete item");
  } finally {
    dispatch(setDeleteLoading(false));
  }
};
```

---

## Backend API Contract

### Endpoint
```
DELETE /invoice/{invoiceId}/items/{invoiceItemId}
```

### Request
- **Method:** DELETE
- **Auth:** Bearer token in Authorization header
- **Path Parameters:**
  - `invoiceId`: string
  - `invoiceItemId`: string

### Response
```json
{
  "success": true,
  "message": "Item deleted successfully",
  "data": null
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Item not found or deletion failed"
}
```

---

## Implementation Notes

1. **Loading State Management:** Use `deleteLoading` and `deleteError` states to handle UI feedback
2. **Data Refresh:** After successful deletion, call `fetchInvoiceDetail()` to refresh the invoice data
3. **Temporary vs Saved Items:** Distinguish between temporary rows (not yet saved) and actual invoice items
4. **Error Handling:** Display appropriate error messages to the user
5. **Optimization:** The delete operation uses the stored `invoiceItemId` from the backend response

---

## Integration Points

1. **InvoiceDetail Page:** Main place to implement item deletion with data refresh
2. **AddInvoiceItemsModal:** Can implement delete for newly added items
3. **Redux Store:** State is managed through the addInvoiceItems slice
4. **Toast Notifications:** Use react-toastify for user feedback
