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
import { setField, setSpareData, resetForm } from "./EditSpare.slice";
import type { Spare } from "../../../../type/spare";
import { updateSpareApi } from "../../../../service/spare";

interface EditSpareProps {
  open: boolean;
  onClose: () => void;
  spare: Spare | null;
}

function EditSpare({ open, onClose, spare }: EditSpareProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { spare_name } = useSelector((state: RootState) => state.editSpare);

  useEffect(() => {
    if (open && spare) {
      dispatch(
        setSpareData({
          spare_name: spare.spare_name,
        })
      );
    } else if (!open) {
      dispatch(resetForm());
    }
  }, [open, spare, dispatch]);

  const handleChange = (field: string, value: string) => {
    dispatch(setField({ field: field as "spare_name", value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!spare) return;

    if (!spare_name.trim()) {
      toast.error("Spare name is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      const result = await updateSpareApi(spare.spare_id, { spareName: spare_name });

      if (result.success) {
        toast.success(result.message || "Spare updated successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(resetForm());
        onClose();
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Failed to update spare";
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
          <span>Edit Spare</span>
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
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditSpare;