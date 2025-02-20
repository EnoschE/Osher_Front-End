import { Box, Typography } from "@mui/material";
import CustomDialog from "../Common/CustomDialog";
import { PersonRemoveOutlined } from "@mui/icons-material";
import CustomButton from "../Common/CustomButton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useLoginStyles from "../Login/loginStyles";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

import CustomDropdown from "../Common/CustomDropdown";
import {
  assignRepresentative,
  changeManager,
  changeOfficeManager,
  getAllManagersByCompanyId,
  getAllOfficeManagersByCompanyId,
  getAllRepresentativesByCompanyId,
} from "../../Services/dashboardService";

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose?: () => void;
  activeUser: { text: string; id: string; mongoId?: string } | null;
  currentSelection?: {
    _id: string;
    name: string;
    companyId: string;
    mongoId: string;
  } | null;
  onSuccess?: () => void;
  type?: "Office Manager" | "Manager";
  companyId?: string;
}

const AssignRepresentativeDialog = ({
  open,
  onClose,
  activeUser,
  currentSelection,
  onSuccess,
  type,
  companyId,
}: ForgotPasswordDialogProps) => {
  const colors = useSelector(selectColors);
  const { IconSquareBox } = useLoginStyles();

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | undefined>("");
  const [allTechnicians, setAllTechnicians] = useState<Array<any>>([]);
  console.log("CU", currentSelection, activeUser);

  useEffect(() => {
    if (open) {
      getAllUsers();
    }
  }, [open]);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      let { data }: any =
        type === "Office Manager"
          ? await getAllOfficeManagersByCompanyId(
              currentSelection?.companyId || companyId || ""
            )
          : type === "Manager"
          ? await getAllManagersByCompanyId(
              currentSelection?.companyId || companyId || ""
            )
          : await getAllRepresentativesByCompanyId(
              currentSelection?.companyId || companyId || ""
            );
      // data = data.map((item: any) => ({ ...item, value: item.mongoId, text: item.name }));
      data = data.map((item: any) => ({
        ...item,
        value: item._id,
        text: item.name,
      }));
      setAllTechnicians(data);

      if (currentSelection) {
        // setSelectedId(currentSelection?.mongoId);
        setSelectedId(currentSelection?._id);
      } else {
        setSelectedId("");
      }
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const handleAssign = async () => {
    setLoading(true);
    try {
      if (type === "Office Manager") {
        const payload = {
          userId: activeUser?.id,
          // userId: activeUser?.mongoId,
          officeManagerId: selectedId,
        };
        await changeOfficeManager(activeUser?.id ?? "", payload);
        // await changeOfficeManager(activeUser?.mongoId ?? "", payload);
      } else if (type === "Manager") {
        const payload = {
          userId: activeUser?.id,
          // userId: activeUser?.mongoId,
          managerId: selectedId,
        };
        await changeManager(activeUser?.id || "", payload);
        // await changeManager(activeUser?.mongoId || "", payload);
      } else {
        const payload = {
          userId: activeUser?.id,
          installerId: selectedId,
        };
        await assignRepresentative(activeUser?.id || "", payload);
      }
      await onSuccess?.();

      onClose?.();
      toast.success(`${type || "Representative"} assigned successfully!`);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const handleDropdown = (value: string) => {
    setSelectedId(value);
  };

  return (
    <CustomDialog open={open} onClose={onClose}>
      <IconSquareBox>
        <PersonRemoveOutlined />
      </IconSquareBox>

      <Typography variant='h2' my={16} textAlign='center'>
        Assign {type || "Representative"}
      </Typography>
      <Typography
        fontSize={16}
        mb={16}
        textAlign='center'
        color='text.secondary'
      >
        Please select a{type === "Office Manager" ? "n" : ""}{" "}
        {type?.toLowerCase() || "representative"} to assign to{" "}
        {activeUser?.text}?
      </Typography>

      <CustomDropdown
        label='Select option'
        options={allTechnicians}
        value={selectedId}
        onChange={handleDropdown}
        minWidth='100%'
      />

      <Box display='grid' gridTemplateColumns='1fr 1fr' gap={10} mt={32}>
        <CustomButton
          variant='outlined'
          fullWidth
          disabled={loading}
          onClick={onClose}
        >
          Cancel
        </CustomButton>
        <CustomButton
          fullWidth
          disabled={!selectedId || loading}
          // disabled={currentSelection === current?._id || loading}
          onClick={handleAssign}
        >
          Assign
        </CustomButton>
      </Box>
    </CustomDialog>
  );
};

export default AssignRepresentativeDialog;
