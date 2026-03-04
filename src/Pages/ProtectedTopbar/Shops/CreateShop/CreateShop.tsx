import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Stack,
} from "@mui/material";
import { FiX } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setField, setLoading, setSuccess, setError, resetCreateShop, type CreateShopFields } from "./CreateShop.slice";
import { addShop } from "../ShopList/ShopList.slice";
import { createShopApi } from "../../../../service/shops";
import { toast } from "react-toastify";

interface CreateShopProps {
  open: boolean;
  onClose: () => void;
}

function CreateShop({ open, onClose }: CreateShopProps) {
  const dispatch = useAppDispatch();
  const { shopName, shopAddress, shopPhoneNumber, loading } = useAppSelector((state) => state.createShop);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validate phone number: only digits and max 10 characters
    if (name === 'shopPhoneNumber') {
      if (value && !/^\d*$/.test(value)) {
        return; // Ignore non-numeric input
      }
      if (value.length > 10) {
        return; // Ignore if more than 10 digits
      }
    }
    
    dispatch(setField({ field: name as CreateShopFields, value }));
  };

  const handleClose = () => {
    dispatch(resetCreateShop());
    onClose();
  };

  const handleCreate = async () => {
    if (!shopName.trim()) {
      toast.warn("Please enter shop name", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (shopPhoneNumber.trim() && shopPhoneNumber.length !== 10) {
      toast.warn("Phone number must be exactly 10 digits", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    dispatch(setLoading(true));
    try {
      const result = await createShopApi({ 
        shopName, 
         shopAddress, 
        shopPhoneNumber 
      });
      
      if (result.success && result.data) {
        dispatch(addShop(result.data));
        dispatch(setSuccess(result.message || "Shop created successfully"));
        toast.success(result.message || "Shop created successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        handleClose();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to create shop";
      dispatch(setError(errorMessage));
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <span>Create New Shop</span>
          <IconButton
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <FiX />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            required
            name="shopName"
            label="Shop Name"
            type="text"
            fullWidth
            variant="outlined"
            value={shopName}
            onChange={handleChange}
            placeholder="Enter shop name"
          />
          <TextField
            name="shopAddress"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={shopAddress}
            onChange={handleChange}
            placeholder="Enter address"
            multiline
            rows={2}
          />
          <TextField
            name="shopPhoneNumber"
            label="Phone"
            type="text"
            fullWidth
            variant="outlined"
            value={shopPhoneNumber}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleCreate();
              }
            }}
            placeholder="Enter 10 digit phone number"
            helperText={shopPhoneNumber.length > 0 ? `${shopPhoneNumber.length}/10 digits` : ''}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleCreate} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateShop;
