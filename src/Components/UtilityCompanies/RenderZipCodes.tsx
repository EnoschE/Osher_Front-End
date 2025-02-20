import { Box, Chip, ClickAwayListener, IconButton, Popper, TextField, Typography, debounce } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const RenderZipCodes = ({ values }: { values: Array<string> }) => {
	const colors = useSelector(selectColors);

	const [zipCodes, setZipCodes] = useState<string[]>([]);
	const [filteredZipCodes, setFilteredZipCodes] = useState<string[]>([]);
	const [filter, setFilter] = useState<string>("");
	const [isFilterActive, setIsFilterActive] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

	useEffect(() => {
		setZipCodes(values || []);
		setFilteredZipCodes(values || []);
	}, [values]);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(anchorEl ? null : event.currentTarget);
	};

	const handleClickAway = () => {
		setAnchorEl(null);
	};

	const debouncedFilterChange = useCallback(
		debounce((searchText: string) => {
			const filtered = zipCodes.filter((zip) => zip.toLowerCase().includes(searchText.toLowerCase()));
			setFilteredZipCodes(filtered);
			setIsFilterActive(searchText.length > 0);
		}, 300),
		[zipCodes],
	);

	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const searchText = event.target.value;
		setFilter(searchText);
		debouncedFilterChange(searchText.toLowerCase());
	};

	const open = Boolean(anchorEl);
	const popperId = open ? "zip-code-search-popper" : undefined;

	return (
		<>
			<Box display={"flex"} alignItems={"center"} gap={5}>
				<Typography variant="h6">Zip Codes</Typography>
				<Box display={"flex"} alignItems={"center"}>
					<Popper placement="right" id={popperId} open={open} anchorEl={anchorEl}>
						<ClickAwayListener onClickAway={handleClickAway}>
							<Box>
								<TextField type="text" placeholder="Search" onChange={handleFilterChange} value={filter} />
							</Box>
						</ClickAwayListener>
					</Popper>

					<IconButton
						color={isFilterActive ? "primary" : "default"}
						aria-describedby={popperId}
						onClick={handleClick}
						sx={{ p: 2 }}
					>
						<SearchOutlinedIcon sx={{ fontSize: "19px" }} />
					</IconButton>
				</Box>
			</Box>

			{values?.length ? (
				<Box display="grid" gridTemplateColumns={{ xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }} gap={10}>
					{filteredZipCodes.map((code: any, index: number) => (
						<Chip
							sx={{
								backgroundColor: colors.primaryExtraLight,
								color: colors.primary,
							}}
							key={index}
							label={code}
						/>
					))}
				</Box>
			) : (
				<Typography>Not present</Typography>
			)}
		</>
	);
};

export default RenderZipCodes;
