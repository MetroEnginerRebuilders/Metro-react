import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  Box,
} from "@mui/material";
import { FiX } from "react-icons/fi";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { AppDispatch, RootState } from "../../../../store/store";
import { setField, resetForm } from "./CreateModel.slice";
import { createModelApi } from "../../../../service/model";
import type { CreateModelState } from "../../../../type/model";

interface CreateModelProps {
  open: boolean;
  onClose: () => void;
}

const CreateModel = ({ open, onClose }: CreateModelProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { model_name } = useSelector(
    (state: RootState) => state.createModel
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CreateModelState, value: string) => {
    dispatch(setField({ field, value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!model_name?.trim()) {
      toast.error("Model name is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        modelName: model_name,
      };

      const result = await createModelApi(payload);
      
      if (result.success) {
        toast.success(result.message || "Model created successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(resetForm());
        onClose();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to create model";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(resetForm());
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <span>Create Model</span>
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
        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
            label="Model Name"
            value={model_name}
            onChange={(e) => handleChange("model_name", e.target.value)}
            fullWidth
            required
            size="small"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateModel;
