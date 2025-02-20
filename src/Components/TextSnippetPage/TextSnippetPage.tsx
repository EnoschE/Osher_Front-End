import React, { useEffect, useMemo, useState } from "react";
import { Box, Divider, Typography, TextField, Stack, Tooltip, IconButton, Tabs, Tab } from "@mui/material";
import CustomButton from "../Common/CustomButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { debounce } from "@mui/material/utils";
import { getAllTextSnippets, updateTextSnippets } from "../../Services/textSnippetsService";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CustomTextField from "../Common/CustomTextField";
import { SearchOutlined } from "@mui/icons-material";
import CustomPagination from "../Common/CustomPagination";
import TextSnippetUpdateDialog from "./TextSnippetUpdateDialog";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import { styled } from "@mui/system";
import { TextSnippet } from "../../Utils/types";
import { dashboards } from "../../Utils/enums";

const HoverEffectBox = styled(Box)(() => ({
	position: "relative",
	"&:hover": {
		"& .editIcon": {
			opacity: 1,
		},
	},
	"& .editIcon": {
		opacity: 0,
		transition: "opacity 0.3s",
	},
}));

const TextSnippetPage = () => {
	const navigate = useNavigate();

	// State for storing text snippets
	const [snippets, setSnippets] = useState<TextSnippet[]>([]);
	const [snippetsCopy, setSnippetsCopy] = useState<TextSnippet[]>([]);
	const [filteredSnippets, setFilteredSnippets] = useState<TextSnippet[]>([]);
	const [selectedDashboard, setSelectedDashboard] = useState<string>(dashboards.FRONTEND_CUSTOMER_APP);

	// State to hold the currently selected snippet for editing
	const [selectedSnippet, setSelectedSnippet] = useState<TextSnippet | null>(null);

	// State for managing form errors
	const [errors, setErrors] = useState<Record<string, string>>({});

	// State for tracking loading status
	const [loading, setLoading] = useState<boolean>(false);

	// State for handling search functionality
	const [searchQuery, setSearchQuery] = useState<string>("");

	// Pagination states
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [snippetsPerPage] = useState<number>(5);

	const [openUpdateDialogBox, setOpenUpdateDialogBox] = useState<boolean>(false);

	const isSnippetsChanged = useMemo(
		() => JSON.stringify(snippets) === JSON.stringify(snippetsCopy),
		[snippets, snippetsCopy],
	);

	function onUpdateDialogBoxClose() {
		setOpenUpdateDialogBox(false);
	}

	// Function to handle click on the edit icon
	const handleEditClick = (snippet: TextSnippet) => {
		setSelectedSnippet(snippet);
		setOpenUpdateDialogBox(true);
	};
	// Fetches text snippets on component mount
	useEffect(() => {
		getTextSnippets();
	}, [selectedDashboard]);

	// Updates filtered snippets based on the search query
	useEffect(() => {
		if (searchQuery) {
			const lowercasedQuery = searchQuery.toLowerCase();
			const searchedSnippets = snippets.filter(
				(snippet) =>
					snippet.key.toLowerCase().includes(lowercasedQuery) ||
					snippet.value.toLowerCase().includes(lowercasedQuery) ||
					snippet.name.toLowerCase().includes(lowercasedQuery),
			);
			setFilteredSnippets(searchedSnippets);
			setCurrentPage(1);
		} else {
			setFilteredSnippets(snippets);
		}
	}, [searchQuery, snippets]);

	// Pagination logic
	const indexOfLastSnippet = currentPage * snippetsPerPage;
	const indexOfFirstSnippet = indexOfLastSnippet - snippetsPerPage;
	const currentSnippets = filteredSnippets.slice(indexOfFirstSnippet, indexOfLastSnippet);
	const totalPages = Math.ceil(filteredSnippets.length / snippetsPerPage);

	// Fetches text snippets from the server
	const getTextSnippets = async () => {
		setLoading(true);
		try {
			const { data } = await getAllTextSnippets(selectedDashboard);
			setSnippets(data);
			setSnippetsCopy(data);
		} catch (error: any) {
			toast.error(error.message);
		}
		setLoading(false);
	};

	// Handles changes to snippet values
	const handleOnChange = (key: string, value: string) => {
		setSnippetsCopy((prev) =>
			prev.map((snippet) => {
				if (snippet.key === key) {
					return { ...snippet, value: value, changed: true };
				}
				return snippet;
			}),
		);
		setFilteredSnippets((prev) =>
			prev.map((snippet) => {
				if (snippet.key === key) {
					return { ...snippet, value: value, changed: true };
				}
				return snippet;
			}),
		);
	};
	const debouncedHandleOnChange = debounce(handleOnChange, 300);

	// Validates form data
	const validateData = () => {
		const validationErrors: Record<string, string> = {};
		snippetsCopy.forEach((snippet) => {
			if (!snippet.value || snippet.value.length === 0) {
				validationErrors[snippet.key] = "This field cannot be empty";
			}
		});
		setErrors(validationErrors);
		return Object.keys(validationErrors).length === 0;
	};

	// Handles snippet updates
	const handleUpdateSnippets = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (validateData()) {
			const changedSnippets = snippetsCopy
				.filter((snippet) => snippet.changed === true)
				.map((snippet) => {
					const { changed, ...rest } = snippet;
					return rest;
				});

			try {
				setLoading(true);
				await updateTextSnippets(changedSnippets, selectedDashboard);
				toast.success("Snippets Updated Successfully");
				setSnippets(snippetsCopy);
				setSearchQuery("");
			} catch (error: any) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		} else {
			toast.error("There are some errors in fields");
			setSearchQuery("");
			const erroredSnippetKey = Object.keys(errors)[0];
			const erroredSnippetIndex = snippets.findIndex((snippet: TextSnippet) => snippet.key === erroredSnippetKey) + 1;
			const page = Math.ceil(erroredSnippetIndex / snippetsPerPage);
			if (page >= 1) {
				setCurrentPage(page);
			}
		}
	};

	// Navigates to the previous page
	const handleCancel = () => {
		navigate(-1);
	};

	const getSnippetValue = (snippet: TextSnippet) =>
		snippetsCopy.find((snippetCopy) => snippetCopy.key === snippet.key)?.value;

	const getTabValue = (tabName: string) => (tabName === dashboards.FRONTEND_CUSTOMER_APP ? 0 : 1);

	// Component render logic
	return (
		<PageLayout loading={loading} hideBackButton>
			<Box
				display="flex"
				alignItems={{ xs: "stretch", md: "center" }}
				justifyContent="space-between"
				flexDirection={{ xs: "column", md: "row" }}
				gap={12}
				mb={32}
			>
				<Typography variant="h4" mb={8}>
					Text Snippets
				</Typography>
				<Box
					display="flex"
					alignItems={{ xs: "stretch", md: "center" }}
					justifyContent="flex-end"
					gap={12}
					flexDirection={{ xs: "column", md: "row" }}
				>
					<CustomTextField
						placeholder="Search Snippets"
						variant="outlined"
						value={searchQuery}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
						startIcon={<SearchOutlined sx={{ opacity: 0.7 }} />}
					/>
				</Box>
			</Box>
			{/* <Tabs
				sx={{ mt: 5 }}
				variant="fullWidth"
				value={getTabValue(selectedDashboard)}
				onChange={(e, value: number) => {
					value === 0
						? setSelectedDashboard(dashboards.FRONTEND_CUSTOMER_APP)
						: setSelectedDashboard(dashboards.INSTALLER_DASHBOARD);
				}}
				aria-label="basic tabs example"
			>
				<Tab label={"Customer App"} id={dashboards.FRONTEND_CUSTOMER_APP}></Tab>
				<Tab label={"Installer Portal"} id={dashboards.INSTALLER_DASHBOARD}></Tab>
			</Tabs> */}
			<Divider sx={{ mb: 24 }} />


			<form onSubmit={handleUpdateSnippets}>
				<Box>
					{currentSnippets.length === 0 && (
						<Typography variant="h6" mb={8} textAlign={"center"}>
							No Text Snippets Found
						</Typography>
					)}
					{currentSnippets.length > 0 &&
						currentSnippets.map((snippet: TextSnippet) => (
							<HoverEffectBox
								key={snippet._id}
								display="grid"
								gridTemplateColumns={{ xs: "1fr", md: "340px 1fr" }}
								my={{ xs: 10, md: 32 }}
								gap={{ xs: 10, md: 32 }}
							>
								<Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap alignItems={"center"} ml={-27}>
									<ModeEditOutlinedIcon
										className="editIcon"
										sx={{ fontSize: "15px", cursor: "pointer", mx: 5 }}
										onClick={() => handleEditClick(snippet)}
									/>

									<Typography variant="h6" fontSize={18}>
										{snippet.name}
									</Typography>
									<Tooltip title={snippet.description}>
										<IconButton>
											<InfoOutlinedIcon sx={{ fontSize: "13px" }} />
										</IconButton>
									</Tooltip>
								</Stack>

								<TextField
									type="text"
									name={snippet.key}
									defaultValue={getSnippetValue(snippet)}
									placeholder={snippet.description}
									error={!!errors[snippet.key]}
									helperText={errors[snippet.key]}
									onChange={(e) => debouncedHandleOnChange(snippet.key, e.target.value)}
									multiline={true}
									fullWidth
									onBlur={() => validateData()}
								/>
							</HoverEffectBox>
						))}
					<Box />
					<Box display={"flex"} justifyContent={"end"} mt={4}>
						<CustomPagination
							totalPages={totalPages}
							currentPage={currentPage}
							onPageChange={(page: number) => setCurrentPage(page)}
						/>
					</Box>
				</Box>
				<Box mt={20} display="flex" alignItems="center" justifyContent="flex-end" gap={20}>
					<CustomButton variant="outlined" color="secondary" onClick={handleCancel}>
						Cancel
					</CustomButton>
					<CustomButton type="submit" disabled={isSnippetsChanged}>
						Save Changes
					</CustomButton>
				</Box>
			</form>
			<TextSnippetUpdateDialog
				open={openUpdateDialogBox}
				snippet={selectedSnippet}
				onClose={onUpdateDialogBoxClose}
				updateTextSnippets={getTextSnippets}
				selectedDashboard={selectedDashboard}
			/>
		</PageLayout>
	);
};

export default TextSnippetPage;
