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
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setWorkName, setLoading, setSuccess, setError, resetCreateWork } from "./CreateWork.slice";
import { addWork } from "../WorkList/Works.slice";
import { createWorkApi } from "../../../../service/works";
import { toast } from "react-toastify";

interface CreateWorkProps {
  open: boolean;
  onClose: () => void;
}

function CreateWork({ open, onClose }: CreateWorkProps) {
  const dispatch = useAppDispatch();
  const { workName, loading } = useAppSelector((state) => state.createWork);

  const handleWorkNameChange = (value: string) => {
    dispatch(setWorkName(value));
  };

  const handleClose = () => {
    dispatch(resetCreateWork());
    onClose();
  };

  const handleCreate = async () => {
    if (!workName.trim()) {
      toast.warn("Please enter work name", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    dispatch(setLoading(true));
    try {
      const result = await createWorkApi({ workName });
      
      if (result.success && result.data) {
        dispatch(addWork(result.data));
        dispatch(setSuccess(result.message || "Work created successfully"));
        toast.success(result.message || "Work created successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        handleClose();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to create work";
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
          <span>Create New Work</span>
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
              handleCreate();
            }
          }}
          placeholder="Enter work name"
          sx={{ mt: 2 }}
        />
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

export default CreateWork;
