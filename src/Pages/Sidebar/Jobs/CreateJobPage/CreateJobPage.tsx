import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateJob from "../CreateJob/CreateJob";

const CreateJobPage = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    navigate("/jobs");
  };

  const handleSuccess = () => {
    handleClose();
  };

  return (
    <CreateJob 
      open={open} 
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  );
};

export default CreateJobPage;
