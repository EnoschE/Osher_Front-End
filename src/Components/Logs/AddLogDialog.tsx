import { Box, Typography } from "@mui/material";
import CustomDialog from "../Common/CustomDialog";
import { SmsOutlined } from "@mui/icons-material";
import CustomButton from "../Common/CustomButton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useLoginStyles from "../Login/loginStyles";
import { addLogComment } from "../../Services/dashboardService";
import CustomTextField from "../Common/CustomTextField";

interface ForgotPasswordDialogProps {
	open: boolean;
	onClose?: () => void;
	onSuccess?: () => void;
	customerId: string;
}

//   super admin
//   super admin

const AddLogDialog = ({ open, onClose, onSuccess, customerId }: ForgotPasswordDialogProps) => {
	const { IconSquareBox } = useLoginStyles();

	const [loading, setLoading] = useState<boolean>(false);
	const [log, setLog] = useState<string>("");

	useEffect(() => {
		if (open) {
			setLog("");
		}
	}, [open]);

	const handleAddComment = async () => {
		setLoading(true);
		try {
			const payload = {
				customerId,
				log: log?.trim(),
			};
			await addLogComment(payload);
			await onSuccess?.();

			onClose?.();
			toast.success(`Log added successfully!`);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLog(e.target.value);
	};

	return (
		<CustomDialog open={open} onClose={onClose}>
			<IconSquareBox>
				<SmsOutlined />
			</IconSquareBox>

			<Typography variant="h2" my={16} textAlign="center">
				Add Comment
			</Typography>

			<CustomTextField value={log} onChange={handleOnChange} placeholder="Enter comment here" />

			<Box display="grid" gridTemplateColumns="1fr 1fr" gap={10} mt={32}>
				<CustomButton variant="outlined" fullWidth disabled={loading} onClick={onClose}>
					Cancel
				</CustomButton>
				<CustomButton fullWidth disabled={loading || !log?.trim()} onClick={handleAddComment}>
					Add
				</CustomButton>
			</Box>
		</CustomDialog>
	);
};

export default AddLogDialog;
