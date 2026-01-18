import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";

import type { AppDispatch, RootState } from "../../../../store/store";
import { setField, resetForm } from "./CreateSpare.slice";
import { createSpareApi } from "../../../../service/spare";

interface CreateSpareProps {
  open: boolean;
  onClose: () => void;
}

function CreateSpare({ open, onClose }: CreateSpareProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { spare_name } = useSelector((state: RootState) => state.createSpare);

  useEffect(() => {
    if (!open) {
      dispatch(resetForm());
    }
  }, [open, dispatch]);

  const handleChange = (field: string, value: string) => {
    dispatch(setField({ field: field as "spare_name", value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!spare_name.trim()) {
      toast.error("Spare name is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      const result = await createSpareApi({ spareName: spare_name });

      if (result.success) {
        toast.success(result.message || "Spare created successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(resetForm());
        onClose();
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Failed to create spare";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between">
          <span>Create New Spare</span>
          <IconButton onClick={onClose} size="small">
            <FiX />
          </IconButton>
        </div>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Spare Name"
              value={spare_name}
              onChange={(e) => handleChange("spare_name", e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
              required
              autoFocus
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateSpare;