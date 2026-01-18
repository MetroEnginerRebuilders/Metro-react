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
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setField, setLoading, setSuccess, setError, resetEditShop, setSelectedShop, type EditShopFields } from "./EditShop.slice";
import { updateShopApi } from "../../../../service/shops";
import { toast } from "react-toastify";
import type { Shop } from "../../../../type/shops";

interface EditShopProps {
  open: boolean;
  onClose: () => void;
  shop: Shop | null;
}

function EditShop({ open, onClose, shop }: EditShopProps) {
  const dispatch = useAppDispatch();
  const { shopName, shopAddress, shopPhoneNumber, loading } = useAppSelector((state) => state.editShop);

  useEffect(() => {
    if (shop) {
      dispatch(setSelectedShop(shop));
    }
  }, [shop, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'shopPhoneNumber') {
      if (value && !/^\d*$/.test(value)) {
        return;
      }
      if (value.length > 10) {
        return;
      }
    }
    
    dispatch(setField({ field: name as EditShopFields, value }));
  };

  const handleClose = () => {
    dispatch(resetEditShop());
    onClose();
  };

  const handleUpdate = async () => {
    if (!shopName.trim()) {
      toast.warn("Please enter shop name", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!shopAddress.trim()) {
      toast.warn("Please enter address", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!shopPhoneNumber.trim()) {
      toast.warn("Please enter phone number", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (shopPhoneNumber.length !== 10) {
      toast.warn("Phone number must be exactly 10 digits", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!shop?.shop_id) {
      toast.error("Shop Id is missing", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    dispatch(setLoading(true));
    try {
      const result = await updateShopApi(shop.shop_id, { 
        shopName, 
        shopAddress, 
       shopPhoneNumber 
      });
      
      if (result.success) {
        dispatch(setSuccess(result.message || "Shop updated successfully"));
        toast.success(result.message || "Shop updated successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        handleClose();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to update shop";
      dispatch(setError(errorMessage));
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <span>Edit Shop</span>
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
            required
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
            required
            name="shopPhoneNumber"
            label="Phone"
            type="text"
            fullWidth
            variant="outlined"
            value={shopPhoneNumber}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleUpdate();
              }
            }}
            placeholder="Enter 10 digit phone number"
            helperText={shopPhoneNumber.length > 0 ? `${shopPhoneNumber.length}/10 digits` : ''}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleUpdate} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditShop;
