import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { AppDispatch, RootState } from "../../../../store/store";
import { setField, setFormData, resetForm } from "./EditModel.slice";
import { updateModelApi } from "../../../../service/model";
import type { Model, EditModelState } from "../../../../type/model";

interface EditModelProps {
  open: boolean;
  onClose: () => void;
  model: Model | null;
}

const EditModel = ({ open, onClose, model }: EditModelProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { model_name } = useSelector(
    (state: RootState) => state.editModel
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && model) {
      dispatch(setFormData({ model_name: model.model_name }));
    }
  }, [open, model, dispatch]);

  const handleChange = (field: keyof EditModelState, value: string) => {
    dispatch(setField({ field, value }));
  };

  const handleSubmit = async () => {
    if (!model) return;

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

      const result = await updateModelApi(model.model_id, payload);
      
      if (result.success) {
        toast.success(result.message || "Model updated successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(resetForm());
        onClose();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to update model";
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
      <DialogTitle>Edit Model</DialogTitle>
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
          {loading ? <CircularProgress size={24} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModel;
