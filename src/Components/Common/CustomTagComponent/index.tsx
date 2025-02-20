import React, { useState, useEffect } from "react";
import { debounce } from "@mui/material/utils";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Box, ClickAwayListener, IconButton, Popper, TextField } from "@mui/material";
import cc from "./classnames";
import Tag from "./tag";
import "./styles.css";
import { checkPostalCodeAvailability } from "../../../Services/utilityCompaniesService";
import { checkInstallerCompanyPostalCodeAvailability } from "../../../Services/dashboardService";

interface TagsInputProps {
	name?: string;
	placeHolder?: string;
	value?: string[];
	onChange?: (tags: string[]) => void;
	onBlur?: any;
	separators?: string[];
	disableBackspaceRemove?: boolean;
	onExisting?: (tag: string) => void;
	onRemoved?: (tag: string) => void;
	disabled?: boolean;
	isEditOnRemove?: boolean;
	beforeAddValidate?: (tag: string, existingTags: string[]) => boolean;
	onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	classNames?: {
		input?: string;
		tag?: string;
	};
	type: "text" | "number";
	errors: any;
	setErrors: (errors: Record<string | any, string | any>) => void;
	minLength?: number;
	maxLength?: number;
	forInstallerCompany?: boolean;
}

const defaultSeparators = ["Enter"];

export const TagsInput: React.FC<TagsInputProps> = ({
	name,
	placeHolder,
	value,
	onChange,
	onBlur,
	separators,
	disableBackspaceRemove,
	onExisting,
	onRemoved,
	disabled,
	isEditOnRemove,
	beforeAddValidate,
	onKeyUp,
	classNames,
	type,
	errors,
	setErrors,
	minLength,
	maxLength,
	forInstallerCompany,
}) => {
	const [tags, setTags] = useState<string[]>(value || []);
	const [filteredTags, setFilteredTags] = useState<string[]>(tags);
	console.log({ tags, filteredTags, value });
	const [filter, setFilter] = useState<string>("");
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [isFilterActive, setIsFilterActive] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const handleDebouncedFilter = debounce((searchText: string) => {
		const filtered = tags.filter((tag) => tag.toLowerCase().includes(searchText.toLowerCase()));
		setFilteredTags(filtered);
		setIsFilterActive(filtered.length !== tags.length);
	}, 500);

	useEffect(() => {
		onChange && onChange(tags);
	}, [tags, onChange]);

	useEffect(() => {
		setTags(value || []);
	}, [value]);

	useEffect(() => {
		handleDebouncedFilter(filter);
	}, [filter, tags]);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(anchorEl ? null : event.currentTarget);
	};

	const handleClickAway = () => {
		setAnchorEl(null);
	};

	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilter(event.target.value);
	};

	const onTagRemove = (tag: string) => {
		const newTags = tags.filter((t) => t !== tag);
		setTags(newTags);
		onRemoved && onRemoved(tag);
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popper" : undefined;
	const handleOnKeyUp = async (e: any) => {
		e.stopPropagation();

		const text = e.target.value;

		if (!text && !disableBackspaceRemove && tags.length && e.key === "Backspace") {
			e.target.value = isEditOnRemove ? `${tags.at(-1)} ` : "";
			setTags([...tags.slice(0, -1)]);
		}

		if (text && (separators || defaultSeparators).includes(e.key)) {
			e.preventDefault();
			// Initialize an error message string.
			let errorMessage = "";

			// Validate against minLength if it is provided.
			if (minLength !== undefined && text.length < minLength) {
				errorMessage = `ZipCode is shorter than the minimum length of ${minLength} characters.`;
			}

			// Validate against maxLength if it is provided.
			if (maxLength !== undefined && text.length > maxLength) {
				errorMessage = `ZipCode exceeds the maximum length of ${maxLength} characters.`;
			}
			if (tags.includes(text.trim())) {
				errorMessage = `This ZIP code has already been assigned to this company.`;
			}

			try {
				setLoading(true);
				const {
					data: { isAvailable },
				} = forInstallerCompany
					? await checkInstallerCompanyPostalCodeAvailability(text.trim())
					: await checkPostalCodeAvailability(text.trim());
				if (!isAvailable) {
					errorMessage = `Postal code is already assigned to a different ${
						forInstallerCompany ? "installer" : "utility"
					} company.`;
				}
			} catch (error) {
				errorMessage = "Something went wrong";
			} finally {
				setLoading(false);
			}

			// If there is an error message, update the state and prevent the tag from being added.
			if (errorMessage) {
				setErrors({
					...errors,
					[name as string]: errorMessage,
				});
				return;
			} else {
				const newErrors = { ...errors };
				delete newErrors[name as string];
				setErrors(newErrors);
			}

			if (beforeAddValidate && !beforeAddValidate(text, tags)) return;

			if (tags.includes(text)) {
				onExisting && onExisting(text);
				return;
			}
			setTags([...tags, text]);
			e.target.value = "";
		}
	};
	return (
		<div>
			<div
				aria-labelledby={name}
				className={cc("rti--container", errors[name as string] ? "error" : "", loading ? "disabled" : "")}
			>
				{filteredTags.map((tag: string) => (
					<Tag key={tag} className={classNames?.tag} text={tag} remove={() => onTagRemove(tag)} disabled={disabled} />
				))}

				<input
					className={cc("rti--input", classNames?.input)}
					type={type}
					name={name}
					placeholder={placeHolder}
					onKeyDown={handleOnKeyUp}
					onBlur={onBlur}
					disabled={disabled}
					onKeyUp={onKeyUp}
				/>

				<Popper placement="left" id={id} open={open} anchorEl={anchorEl}>
					<ClickAwayListener onClickAway={handleClickAway}>
						<Box>
							<TextField type="text" placeholder="Search" onChange={handleFilterChange} value={filter} />
						</Box>
					</ClickAwayListener>
				</Popper>

				<IconButton
					color={isFilterActive ? "primary" : "default"}
					aria-describedby={id}
					onClick={handleClick}
					sx={{ p: 2, position: "absolute", top: { xs: -38, md: -5 }, right: { xs: 0, md: -36 } }}
				>
					<SearchOutlinedIcon />
				</IconButton>
			</div>

			{errors[name as string] && errors[name as string].length > 0 && (
				<span className="error-message">{errors[name as string]}</span>
			)}
		</div>
	);
};
