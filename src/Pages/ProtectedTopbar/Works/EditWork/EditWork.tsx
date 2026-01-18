import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import { FiX } from "react-icons/fi";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setWorkName, setLoading, setSuccess, setError, resetEditWork, setSelectedWork } from "./EditWork.slice";
import { updateWorkApi } from "../../../../service/works";
import { toast } from "react-toastify";
import type { Work } from "../../../../type/works";

interface EditWorkProps {
  open: boolean;
  onClose: () => void;
  work: Work | null;
}

function EditWork({ open, onClose, work }: EditWorkProps) {
  const dispatch = useAppDispatch();
  const { workName, loading } = useAppSelector((state) => state.editWork);

  useEffect(() => {
    if (work) {
      dispatch(setSelectedWork(work));
    }
  }, [work, dispatch]);

  const handleWorkNameChange = (value: string) => {
    dispatch(setWorkName(value));
  };

  const handleClose = () => {
    dispatch(resetEditWork());
    onClose();
  };

  const handleUpdate = async () => {
    if (!workName.trim()) {
      toast.warn("Please enter work name", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!work?.work_id) {
      toast.error("Work ID is missing", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    dispatch(setLoading(true));
    try {
      const result = await updateWorkApi(work.work_id, { workName });
      
      if (result.success) {
        dispatch(setSuccess(result.message || "Work updated successfully"));
        toast.success(result.message || "Work updated successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        handleClose();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to update work";
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
          <span>Edit Work</span>
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
        <TextField
          autoFocus
          margin="dense"
          label="Work Name"
          type="text"
          fullWidth
          variant="outlined"
          value={workName}
          onChange={(e) => handleWorkNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) {
              handleUpdate();
            }
          }}
          placeholder="Enter work name"
          sx={{ mt: 2 }}
        />
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

export default EditWork;
