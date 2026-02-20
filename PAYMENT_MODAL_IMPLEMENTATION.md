# Payment Modal Implementation - Complete Guide

## Overview
Successfully implemented a comprehensive payment modal feature for invoice payments. When users click the "Pay" button on the invoice detail page, a modal opens with bank account selection, payment date, amount, and remarks fields.

## Files Created/Modified

### 1. **Type Definitions** (`src/type/invoice.ts`)

Added new payment-related interfaces:

```typescript
export interface BankAccount {
  bank_account_id: string;
  account_number?: string;
  account_holder_name?: string;
  bank_name?: string;
  branch_name?: string;
  ifsc_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MakePaymentPayload {
  invoice_id: string;
  bank_account_id: string;
  payment_date: string;
  amount_paid: number;
  remarks?: string;
}

export interface MakePaymentRequest {
  invoice_id: string;
  bank_account_id: string;
  payment_date: string;
  amount_paid: number;
  remarks?: string;
}

export interface MakePaymentResponse {
  success: boolean;
  message?: string;
  data?: any;
}
```

### 2. **Redux Slice** (`src/Pages/Sidebar/Invoice/InvoiceDetail/Payment/Payment.slice.ts`)

**State Interface:**
```typescript
interface PaymentState {
  bankAccounts: BankAccount[];
  loading: boolean;
  error: string | null;
  paymentLoading: boolean;
  paymentError: string | null;
}
```

**Actions:**
- `setLoading(boolean)` - Track bank account fetch loading
- `setBankAccounts(BankAccount[])` - Store fetched bank accounts
- `setError(string)` - Set error message
- `setPaymentLoading(boolean)` - Track payment submission loading
- `setPaymentError(string)` - Set payment error message
- `clearPaymentError()` - Clear error state
- `clearPayment()` - Clear all payment state

### 3. **Payment Modal Component** (`src/Pages/Sidebar/Invoice/InvoiceDetail/Payment/PaymentModal.tsx`)

**Props:**
```typescript
interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  invoiceId: string;
  totalAmount: string | number;
  onPaymentSuccess?: () => void;
}
```

**Features:**
- ✅ Bank Account Autocomplete (searchable dropdown)
- ✅ Payment Date Field (current date prefilled, future dates disabled)
- ✅ Amount Paid Field (prefilled with total_amount, editable)
- ✅ Remarks Text Area (optional)
- ✅ Form Validation
- ✅ Loading States
- ✅ Error Handling
- ✅ Success Toast Notification

**Form Fields:**
1. **Bank Account** (Required)
   - Autocomplete with search
   - Displays: "BankName - AccountNumber"
   - Validates before submission

2. **Payment Date** (Required)
   - Date picker
   - Current date prefilled
   - Future dates disabled (max attribute set to today)
   - Validates before submission

3. **Amount Paid** (Required)
   - Text input with number formatting
   - Prefilled with `totalAmount`
   - Editable by user
   - Must be > 0

4. **Remarks** (Optional)
   - Multiline text area
   - For additional payment notes

### 4. **Service Layer** (`src/service/invoice.ts`)

**New Functions:**

```typescript
export const getBankAccountsApi = async (): Promise<{ 
  success: boolean; 
  data?: BankAccount[]; 
  message?: string 
}>
```
- Endpoint: `GET /bank-account`
- Returns list of available bank accounts

```typescript
export const makePaymentApi = async (
  payload: MakePaymentPayload
): Promise<MakePaymentResponse>
```
- Endpoint: `POST /invoice/payment`
- Payload includes: invoice_id, bank_account_id, payment_date, amount_paid, remarks

### 5. **Redux Store** (`src/store/store.ts`)

- Added payment reducer to store configuration
- Import: `import payment from "../Pages/Sidebar/Invoice/InvoiceDetail/Payment/Payment.slice.ts"`
- Reducer key: `payment`

### 6. **Invoice Detail Page** (`src/Pages/Sidebar/Invoice/InvoiceDetail/InvoiceDetail.tsx`)

**Updates:**
- Imported PaymentModal component
- Added `openPaymentModal` state
- Added handlers:
  - `handleOpenPayment()` - Opens modal
  - `handleClosePayment()` - Closes modal
  - `handlePaymentSuccess()` - Refreshes invoice data after payment
- Updated Pay button to call `handleOpenPayment()`
- Added PaymentModal component with proper props

## Data Flow

```
User clicks "Pay" Button
    ↓
handleOpenPayment() triggered
    ↓
PaymentModal opens
    ↓
useEffect runs:
  - Sets payment date to today
  - Prefills amount with totalAmount
  - Fetches bank accounts via getBankAccountsApi()
    ↓
User fills form:
  - Selects bank account
  - Verifies/edits payment date
  - Verifies/edits amount
  - Optional: Adds remarks
    ↓
User clicks "Make Payment" button
    ↓
Validation checks:
  - Bank account selected?
  - Payment date provided?
  - Amount > 0?
    ↓
If valid: makePaymentApi() called with payload:
{
  "invoice_id": "current_invoice_id",
  "bank_account_id": "selected_account_id",
  "payment_date": "2026-02-19",
  "amount_paid": 5000.00,
  "remarks": "optional notes"
}
    ↓
Backend processes payment
    ↓
On success:
  - Toast: "Payment made successfully"
  - Modal closes
  - handlePaymentSuccess() called
  - Invoice details refreshed
```

## Usage Example

```tsx
// In InvoiceDetail component
<PaymentModal
  open={openPaymentModal}
  onClose={handleClosePayment}
  invoiceId={invoiceId || ""}
  totalAmount={invoiceDetail?.total_amount || 0}
  onPaymentSuccess={handlePaymentSuccess}
/>
```

## API Endpoints

### 1. Get Bank Accounts
```
GET /bank-account
Headers: Authorization: Bearer {token}
Response: { success: true, data: BankAccount[] }
```

### 2. Make Payment
```
POST /invoice/payment
Headers: Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "invoice_id": "INV-001",
  "bank_account_id": "BA-123",
  "payment_date": "2026-02-19",
  "amount_paid": 5000,
  "remarks": "Payment for services"
}

Response:
{
  "success": true,
  "message": "Payment made successfully",
  "data": { ... }
}
```

## Validation Rules

| Field | Required | Validation |
|-------|----------|-----------|
| Bank Account | Yes | Must select one from dropdown |
| Payment Date | Yes | Must be today or earlier (no future dates) |
| Amount Paid | Yes | Must be > 0 |
| Remarks | No | Free text, optional |

## Error Handling

- **Bank Account Not Selected** → "Please select a bank account"
- **Payment Date Missing** → "Please select a payment date"
- **Invalid Amount** → "Please enter a valid amount"
- **API Errors** → Shows backend error message in toast
- **Network Errors** → Shows generic error message

## UI/UX Features

1. **Auto-population**
   - Payment date auto-set to today
   - Amount auto-set to invoice total

2. **Field Disabling**
   - Bank account dropdown disabled while loading
   - Make Payment button disabled while submitting

3. **Visual Feedback**
   - Loading spinner in button while processing
   - Error borders on invalid fields
   - Success/error toast notifications
   - Helper text for validation errors

4. **Date Restriction**
   - HTML5 date input with max="today"
   - Prevents selection of future dates
   - Ensures payment date is valid

## State Management

All payment state managed in Redux:
- Bank accounts cached in store
- Loading states tracked separately for UX
- Error messages accessible for display

## Testing Checklist

- [ ] Click Pay button opens modal
- [ ] Bank accounts list loads
- [ ] Payment date defaults to today
- [ ] Amount prefilled with total_amount
- [ ] Can edit amount
- [ ] Cannot select future dates
- [ ] Form validation works
- [ ] Successfully submit payment
- [ ] Invoice refreshes after payment
- [ ] Error messages display correctly
- [ ] Modal closes on success
- [ ] Modal can be closed with X button

## Dependencies

- Material-UI (Dialog, TextField, Autocomplete, Button, etc.)
- Redux Toolkit
- React Hooks (useState, useEffect)
- React Icons (FiX)
- React Toastify (notifications)
- Custom service layer (axios)
