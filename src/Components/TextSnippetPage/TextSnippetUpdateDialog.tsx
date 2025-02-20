import React, { useEffect, useState } from "react";
import CustomDialog from "../Common/CustomDialog";
import CustomTextField from "../Common/CustomTextField";
import CustomButton from "../Common/CustomButton";
import { Box } from "@mui/material";
import {  updateSingleTextSnippet } from "../../Services/textSnippetsService";
import { toast } from "react-toastify";
import { TextSnippet } from "../../Utils/types";


interface TextSnippetUpdateDialogProps {
	open: boolean;
	onClose?: () => void;

	snippet: TextSnippet | null;
    updateTextSnippets : () => void;
	selectedDashboard: string ;
}

const initialSnippetState = {
	_id: "",
	key: "",
	value: "",
	description: "",
	name: "",
	modifiedAt: new Date(),
	changed: false,
};

const TextSnippetUpdateDialog = ({ open, onClose, snippet , updateTextSnippets , selectedDashboard }: TextSnippetUpdateDialogProps) => {
	const [updatedSnippet, setUpdatedSnippet] = useState<TextSnippet>(snippet || initialSnippetState);
	const [errors, setErrors] = useState({ name: "", description: "" });
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (open) {
			setUpdatedSnippet(snippet || initialSnippetState);
			setErrors({ name: "", description: "" });
		}
	}, [open, snippet]);

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUpdatedSnippet((prevState) => ({ ...prevState, [name]: value }));
	};

	const validateData = () => {
		let isValid = true;
		const newErrors = { name: "", description: "" };

		if (!updatedSnippet.name) {
			newErrors.name = "Name cannot be empty";
			isValid = false;
		}

		if (!updatedSnippet.description) {
			newErrors.description = "Description cannot be empty";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = async () => {
		if (!validateData()) return;

		setLoading(true);
		try {
		    await updateSingleTextSnippet(updatedSnippet , selectedDashboard);
            updateTextSnippets();
			toast.success("Snippet updated successfully");

			if (onClose) {
				onClose();
			}
		} catch (error: any) {
			toast.error(error.message || "Failed to update snippet");
		} finally {
			setLoading(false);
		}
	};
	return (
		<CustomDialog open={open} onClose={onClose}>
			<Box my={14}>
				<CustomTextField
					autoFocus
					name="name"
					label="Name"
					onChange={handleOnChange}
					value={updatedSnippet.name}
					error={errors.name}
				/>
			</Box>
			<Box mt={14}>
				<CustomTextField
					name="description"
					label="Description"
					onChange={handleOnChange}
					value={updatedSnippet.description}
					error={errors.description}
				/>
			</Box>
			<Box mt={20}>
				<CustomButton fullWidth onClick={handleSubmit} disabled={loading}>
					Update Snippet
				</CustomButton>
			</Box>
		</CustomDialog>
	);
};

export default TextSnippetUpdateDialog;
