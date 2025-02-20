import { Typography } from "@mui/material";
import CustomDialog from "../Common/CustomDialog";
import { HandshakeOutlined } from "@mui/icons-material";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import CustomTextField from "../Common/CustomTextField";
import CustomButton from "../Common/CustomButton";
import useLoginStyles from "../Login/loginStyles";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import { selectUser } from "../../Redux/Slices/userSlice";

interface AcceptProposalDialogProps {
  open: boolean;
  onClose?: () => void;
}

const AcceptProposalDialog = ({ open, onClose }: AcceptProposalDialogProps) => {
  const colors = useSelector(selectColors);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { IconSquareBox } = useLoginStyles();

  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setName("");
      setError("");
    }
  }, [open]);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setName(value.trimStart());
    if (error) setError("");
  };

  const validateName = (currentValue = "") => {
    const updatedError = currentValue.trim()
      ? currentValue !== user.name
        ? "Name didn't matched"
        : ""
      : "Name cannot be empty";

    setError(updatedError);
    return !!updatedError;
  };

  const handleSendLink = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateName(name)) return;

    setLoading(true);
    try {
      // TODO: call api here
      navigate(allRoutes.PROPOSAL_ACCEPTANCE);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  return (
    <CustomDialog open={open} onClose={onClose}>
      <IconSquareBox>
        <HandshakeOutlined />
      </IconSquareBox>

      <Typography variant='h2' my={16} textAlign='center'>
        Accept Proposal
      </Typography>
      <Typography
        fontSize={16}
        textAlign='center'
        mb={32}
        color='text.secondary'
      >
        Please enter your name to accept
        <br />
        the proposal & schedule a site survey
      </Typography>

      <form onSubmit={handleSendLink}>
        <CustomTextField
          autoFocus
          placeholder='Enter your name'
          bottom={24}
          value={name}
          onChange={handleChangeName}
          error={error}
        />

        <CustomButton
          type='submit'
          fullWidth
          disabled={loading}
          sx={{ mb: 10 }}
        >
          Accept Proposal
        </CustomButton>
      </form>
    </CustomDialog>
  );
};

export default AcceptProposalDialog;
