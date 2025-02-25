import React, { FormEvent, useEffect, useState } from "react";
import CustomButton from "../Common/CustomButton";
import CustomTextField, { Asterisk } from "../Common/CustomTextField";
import { Box, Divider, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { getParameters, updateParameters } from "../../Services/parameterServices";
import ImageUploader from "../Common/ImageUploader";
import { useDispatch } from "../../Redux/reduxHooks";
import { fetchLogo } from "../../Redux/Slices/generalSlice";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

import { borderRadius } from "../../Utils/spacings";

interface AccountSettingsData {
	utilityRate?: string;
	discountFactor?: string;
	utilityDiscountFactor?: string;
	panelDimensions?: string;
	annualIncreaseRate?: string;
	annualIncreaseRateLoan?: string;
	annualIncreaseLeaseRate?: string;
	panelPower?: string;
	federalIncentivesPercentage?: string;
	stateIncentive?: string;
	costPerKW?: string;
	years?: string;
	monthlyDistribution: {
		january?: string;
		february?: string;
		march?: string;
		april?: string;
		may?: string;
		june?: string;
		july?: string;
		august?: string;
		september?: string;
		october?: string;
		november?: string;
		december?: string;
	};
	centRate: {
		750?: string;
		775?: string;
		800?: string;
		825?: string;
		850?: string;
		875?: string;
		900?: string;
		925?: string;
		950?: string;
		975?: string;
		1000?: string;
		1025?: string;
		1050?: string;
		1075?: string;
		1100?: string;
	};

	applicationLogo: string | File;
}

const defaultData: AccountSettingsData = {
	utilityRate: "",
	discountFactor: "",
	utilityDiscountFactor: "",
	panelDimensions: "",
	annualIncreaseRate: "",
	annualIncreaseRateLoan: "",
	annualIncreaseLeaseRate: "",
	panelPower: "",
	federalIncentivesPercentage: "",
	stateIncentive: "",
	costPerKW: "",
	years: "",
	monthlyDistribution: {
		january: "",
		february: "",
		march: "",
		april: "",
		may: "",
		june: "",
		july: "",
		august: "",
		september: "",
		october: "",
		november: "",
		december: "",
	},
	centRate: {
		750: "",
		775: "",
		800: "",
		825: "",
		850: "",
		875: "",
		900: "",
		925: "",
		950: "",
		975: "",
		1000: "",
		1025: "",
		1050: "",
		1075: "",
		1100: "",
	},
	applicationLogo: "",
};

const UtilityRatesPage = () => {
	const colors = useSelector(selectColors);
	const navigate = useNavigate();

	const [data, setData] = useState<AccountSettingsData>(defaultData);
	const [errors, setErrors] = useState<AccountSettingsData>(defaultData);
	const [loading, setLoading] = useState<boolean>(false);
	const [applicationLogo, setApplicationLogo] = useState<any>(data.applicationLogo ?? "");
	const dispatch = useDispatch();

	const handleSelectImage = (image: any) => {
		setApplicationLogo(image);
	};

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		setLoading(true);
		try {
			const { data: details } = await getParameters();
			const currentParameter = {
				monthlyDistribution: {
					january: details?.monthlyDistribution?.January || "",
					february: details?.monthlyDistribution?.February || "",
					march: details?.monthlyDistribution?.March || "",
					april: details?.monthlyDistribution?.April || "",
					may: details?.monthlyDistribution?.May || "",
					june: details?.monthlyDistribution?.June || "",
					july: details?.monthlyDistribution?.July || "",
					august: details?.monthlyDistribution?.August || "",
					september: details?.monthlyDistribution?.September || "",
					october: details?.monthlyDistribution?.October || "",
					november: details?.monthlyDistribution?.November || "",
					december: details?.monthlyDistribution?.December || "",
				},

				centRate: {
					750: details?.centRate?.["750"] ? (details?.centRate?.["750"] * 1).toString() : "",
					775: details?.centRate?.["775"] ? (details?.centRate?.["775"] * 1).toString() : "",
					800: details?.centRate?.["800"] ? (details?.centRate?.["800"] * 1).toString() : "",
					825: details?.centRate?.["825"] ? (details?.centRate?.["825"] * 1).toString() : "",
					850: details?.centRate?.["850"] ? (details?.centRate?.["850"] * 1).toString() : "",
					875: details?.centRate?.["875"] ? (details?.centRate?.["875"] * 1).toString() : "",
					900: details?.centRate?.["900"] ? (details?.centRate?.["900"] * 1).toString() : "",
					925: details?.centRate?.["925"] ? (details?.centRate?.["925"] * 1).toString() : "",
					950: details?.centRate?.["950"] ? (details?.centRate?.["950"] * 1).toString() : "",
					975: details?.centRate?.["975"] ? (details?.centRate?.["975"] * 1).toString() : "",
					1000: details?.centRate?.["1000"] ? (details?.centRate?.["1000"] * 1).toString() : "",
					1025: details?.centRate?.["1025"] ? (details?.centRate?.["1025"] * 1).toString() : "",
					1050: details?.centRate?.["1050"] ? (details?.centRate?.["1050"] * 1).toString() : "",
					1075: details?.centRate?.["1075"] ? (details?.centRate?.["1075"] * 1).toString() : "",
					1100: details?.centRate?.["1100"] ? (details?.centRate?.["1100"] * 1).toString() : "",
				},

				utilityRate: details?.utilityRate || "",
				discountFactor: details?.discountFactor || "",
				utilityDiscountFactor: details?.utilityDiscountFactor || "",
				panelDimensions: details?.PanelDimentions || "",
				annualIncreaseRate: (details?.annualIncreaseRate * 100).toString() || "",
				annualIncreaseRateLoan: details?.annualIncreaseRateLoan || "",
				annualIncreaseLeaseRate: details?.annualIncreaseLeaseRate || "",
				panelPower: details?.PanelPower || "",
				federalIncentivesPercentage: (details?.FederalIncentivesPercentage * 100).toString() || "",
				stateIncentive: details?.StateIncentive || "",
				costPerKW: details?.CostPerKW || "",
				years: details?.years || "",
				applicationLogo: details?.applicationLogo || "",
			};

			setData(currentParameter);
			setApplicationLogo(currentParameter.applicationLogo);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleOnChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		isSubValue: boolean,
		parentKey: "monthlyDistribution" | "centRate",
	) => {
		const { name, value } = e.target;
		if (isSubValue) {
			setData((state) => ({ ...state, [parentKey]: { ...state[parentKey], [name]: value } }));
			setErrors((state) => ({ ...state, [parentKey]: { ...state[parentKey], [name]: "" } }));
		} else {
			setData((state) => ({ ...state, [name]: value }));
			setErrors((state) => ({ ...state, [name]: "" }));
		}
	};

	const validateData = () => {
		const updatedErrors = { ...errors };

		updatedErrors.utilityRate = data.utilityRate ? "" : "This field cannot be empty";
		updatedErrors.discountFactor = data.discountFactor ? "" : "This field cannot be empty";
		updatedErrors.utilityDiscountFactor = data.utilityDiscountFactor ? "" : "This field cannot be empty";
		updatedErrors.panelDimensions = data.panelDimensions ? "" : "This field cannot be empty";
		updatedErrors.annualIncreaseRate = data.annualIncreaseRate ? "" : "This field cannot be empty";
		updatedErrors.annualIncreaseRateLoan = data.annualIncreaseRateLoan ? "" : "This field cannot be empty";
		updatedErrors.annualIncreaseLeaseRate = data.annualIncreaseLeaseRate ? "" : "This field cannot be empty";
		updatedErrors.panelPower = data.panelPower ? "" : "This field cannot be empty";
		updatedErrors.federalIncentivesPercentage = data.federalIncentivesPercentage ? "" : "This field cannot be empty";
		updatedErrors.stateIncentive = data.stateIncentive ? "" : "This field cannot be empty";
		updatedErrors.costPerKW = data.costPerKW ? "" : "This field cannot be empty";
		updatedErrors.years = data.years ? "" : "This field cannot be empty";

		updatedErrors.monthlyDistribution.january = data.monthlyDistribution.january ? "" : "This field cannot be empty";
		updatedErrors.monthlyDistribution.february = data.monthlyDistribution.february ? "" : "This field cannot be empty";
		updatedErrors.monthlyDistribution.march = data.monthlyDistribution.march ? "" : "This field cannot be empty";
		updatedErrors.monthlyDistribution.april = data.monthlyDistribution.april ? "" : "This field cannot be empty";
		updatedErrors.monthlyDistribution.may = data.monthlyDistribution.may ? "" : "This field cannot be empty";
		updatedErrors.monthlyDistribution.june = data.monthlyDistribution.june ? "" : "This field cannot be empty";
		updatedErrors.monthlyDistribution.july = data.monthlyDistribution.july ? "" : "This field cannot be empty";
		updatedErrors.monthlyDistribution.august = data.monthlyDistribution.august ? "" : "This field cannot be empty";
		updatedErrors.monthlyDistribution.september = data.monthlyDistribution.september
			? ""
			: "This field cannot be empty";
		updatedErrors.monthlyDistribution.october = data.monthlyDistribution.october ? "" : "This field cannot be empty";
		updatedErrors.monthlyDistribution.november = data.monthlyDistribution.november ? "" : "This field cannot be empty";
		updatedErrors.monthlyDistribution.december = data.monthlyDistribution.december ? "" : "This field cannot be empty";

		updatedErrors.centRate["750"] = data.centRate["750"] ? "" : "This field cannot be empty";
		updatedErrors.centRate["775"] = data.centRate["775"] ? "" : "This field cannot be empty";
		updatedErrors.centRate["800"] = data.centRate["800"] ? "" : "This field cannot be empty";
		updatedErrors.centRate["825"] = data.centRate["825"] ? "" : "This field cannot be empty";
		updatedErrors.centRate["850"] = data.centRate["850"] ? "" : "This field cannot be empty";
		updatedErrors.centRate["875"] = data.centRate["875"] ? "" : "This field cannot be empty";
		updatedErrors.centRate["900"] = data.centRate["900"] ? "" : "This field cannot be empty";
		updatedErrors.centRate["925"] = data.centRate["925"] ? "" : "This field cannot be empty";
		updatedErrors.centRate["950"] = data.centRate["950"] ? "" : "This field cannot be empty";
		updatedErrors.centRate["975"] = data.centRate["975"] ? "" : "This field cannot be empty";
		updatedErrors.centRate["1000"] = data.centRate["1000"] ? "" : "This field cannot be empty";
		updatedErrors.centRate["1025"] = data.centRate["1025"] ? "" : "This field cannot be empty";
		updatedErrors.centRate["1050"] = data.centRate["1050"] ? "" : "This field cannot be empty";
		updatedErrors.centRate["1075"] = data.centRate["1075"] ? "" : "This field cannot be empty";
		updatedErrors.centRate["1100"] = data.centRate["1100"] ? "" : "This field cannot be empty";

		setErrors(updatedErrors);

		let foundError = Object.values(updatedErrors).find(Boolean);
		if (typeof foundError === "object") {
			foundError = Object.values(updatedErrors.monthlyDistribution).find(Boolean);
			if (!foundError) foundError = Object.values(updatedErrors.centRate).find(Boolean);
		}
		return !foundError;
	};

	const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validateData()) return;

		setLoading(true);
		try {
			const formData = new FormData();

			const payload = {
				monthlyDistribution: {
					January: parseFloat(data.monthlyDistribution.january || "0"),
					February: parseFloat(data.monthlyDistribution.february || "0"),
					March: parseFloat(data.monthlyDistribution.march || "0"),
					April: parseFloat(data.monthlyDistribution.april || "0"),
					May: parseFloat(data.monthlyDistribution.may || "0"),
					June: parseFloat(data.monthlyDistribution.june || "0"),
					July: parseFloat(data.monthlyDistribution.july || "0"),
					August: parseFloat(data.monthlyDistribution.august || "0"),
					September: parseFloat(data.monthlyDistribution.september || "0"),
					October: parseFloat(data.monthlyDistribution.october || "0"),
					November: parseFloat(data.monthlyDistribution.november || "0"),
					December: parseFloat(data.monthlyDistribution.december || "0"),
				},

				centRate: {
					750: parseFloat(data.centRate["750"] || "0"),
					// 750: parseFloat(data.centRate["750"] || "0") / 100,
					775: parseFloat(data.centRate["775"] || "0"),
					// 775: parseFloat(data.centRate["775"] || "0") / 100,
					800: parseFloat(data.centRate["800"] || "0"),
					// 800: parseFloat(data.centRate["800"] || "0") / 100,
					825: parseFloat(data.centRate["825"] || "0"),
					// 825: parseFloat(data.centRate["825"] || "0") / 100,
					850: parseFloat(data.centRate["850"] || "0"),
					// 850: parseFloat(data.centRate["850"] || "0") / 100,
					875: parseFloat(data.centRate["875"] || "0"),
					// 875: parseFloat(data.centRate["875"] || "0") / 100,
					900: parseFloat(data.centRate["900"] || "0"),
					// 900: parseFloat(data.centRate["900"] || "0") / 100,
					925: parseFloat(data.centRate["925"] || "0"),
					// 925: parseFloat(data.centRate["925"] || "0") / 100,
					950: parseFloat(data.centRate["950"] || "0"),
					// 950: parseFloat(data.centRate["950"] || "0") / 100,
					975: parseFloat(data.centRate["975"] || "0"),
					// 975: parseFloat(data.centRate["975"] || "0") / 100,
					1000: parseFloat(data.centRate["1000"] || "0"),
					// 1000: parseFloat(data.centRate["1000"] || "0") / 100,
					1025: parseFloat(data.centRate["1025"] || "0"),
					// 1025: parseFloat(data.centRate["1025"] || "0") / 100,
					1050: parseFloat(data.centRate["1050"] || "0"),
					// 1050: parseFloat(data.centRate["1050"] || "0") / 100,
					1075: parseFloat(data.centRate["1075"] || "0"),
					// 1075: parseFloat(data.centRate["1075"] || "0") / 100,
					1100: parseFloat(data.centRate["1100"] || "0"),
					// 1100: parseFloat(data.centRate["1100"] || "0") / 100,
				},

				utilityRate: parseFloat(data.utilityRate || "0"),
				discountFactor: parseFloat(data.discountFactor || "1") || 0,
				utilityDiscountFactor: parseFloat(data.utilityDiscountFactor || "1") || 0,
				PanelDimentions: parseFloat(data.panelDimensions || "0"),
				annualIncreaseRate: parseFloat(data.annualIncreaseRate || "1") / 100 || 0,
				annualIncreaseRateLoan: parseFloat(data.annualIncreaseRateLoan || "0"),
				annualIncreaseLeaseRate: parseFloat(data.annualIncreaseLeaseRate || "0"),
				PanelPower: parseFloat(data.panelPower || "0"),
				FederalIncentivesPercentage: parseFloat(data.federalIncentivesPercentage || "1") / 100 || 0,
				StateIncentive: parseFloat(data.stateIncentive || "0"),
				CostPerKW: parseFloat(data.costPerKW || "0"),
				years: parseFloat(data.years || "0"),
			};

			formData.append("utilityRate", String(payload.utilityRate));
			formData.append("discountFactor", String(payload.discountFactor));
			formData.append("utilityDiscountFactor", String(payload.utilityDiscountFactor));
			formData.append("PanelDimentions", String(payload.PanelDimentions));
			formData.append("annualIncreaseRate", String(payload.annualIncreaseRate));
			formData.append("annualIncreaseRateLoan", String(payload.annualIncreaseRateLoan));
			formData.append("annualIncreaseLeaseRate", String(payload.annualIncreaseLeaseRate));
			formData.append("PanelPower", String(payload.PanelPower));
			formData.append("FederalIncentivesPercentage", String(payload.FederalIncentivesPercentage));
			formData.append("StateIncentive", String(payload.StateIncentive));
			formData.append("CostPerKW", String(payload.CostPerKW));
			formData.append("years", String(payload.years));
			formData.append("monthlyDistribution", JSON.stringify(payload.monthlyDistribution));
			formData.append("centRate", JSON.stringify(payload.centRate));

			if (typeof applicationLogo !== "string") formData.append("applicationLogo", applicationLogo);

			const output = await updateParameters(formData);
			console.log("Parameters Updated: ", output);
			toast.success("Parameters updated successfully!");
			// dispatch(fetchLogo());
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleCancel = () => {
		navigate(-1);
	};

	const fields = [
		{
			label: "Utility Rate",
			value: data["utilityRate"],
			name: "utilityRate",
			error: errors["utilityRate"],
			unit: "$/kwh",
		},
		{
			label: "Utility Discount Factor",
			value: data["utilityDiscountFactor"],
			name: "utilityDiscountFactor",
			error: errors["utilityDiscountFactor"],
		},
		{
			label: "Discount Factor",
			value: data["discountFactor"],
			name: "discountFactor",
			error: errors["discountFactor"],
		},
		{
			label: "Panel Dimensions",
			value: data["panelDimensions"],
			name: "panelDimensions",
			error: errors["panelDimensions"],
			unit: "inch",
		},
		{
			label: "Annual Increase Rate",
			value: data["annualIncreaseRate"],
			name: "annualIncreaseRate",
			error: errors["annualIncreaseRate"],
			isPercentage: true,
		},
		{
			label: "Annual Increase Rate Loan",
			value: data["annualIncreaseRateLoan"],
			name: "annualIncreaseRateLoan",
			error: errors["annualIncreaseRateLoan"],
			isPercentage: true,
		},
		{
			label: "Annual Increase Lease Rate",
			value: data["annualIncreaseLeaseRate"],
			name: "annualIncreaseLeaseRate",
			error: errors["annualIncreaseLeaseRate"],
			isPercentage: true,
		},
		{
			label: "Panel Power",
			value: data["panelPower"],
			name: "panelPower",
			error: errors["panelPower"],
			unit: "watt",
		},
		{
			label: "Federal Incentives Percentage",
			value: data["federalIncentivesPercentage"],
			name: "federalIncentivesPercentage",
			error: errors["federalIncentivesPercentage"],
			isPercentage: true,
		},
		{
			label: "State Incentive",
			value: data["stateIncentive"],
			name: "stateIncentive",
			error: errors["stateIncentive"],
			unit: "$",
		},
		{
			label: "Cost Per KW",
			value: data["costPerKW"],
			name: "costPerKW",
			error: errors["costPerKW"],
			unit: "$",
		},
		{
			label: "Years",
			value: data["years"],
			name: "years",
			error: errors["years"],
			unit: "year/s",
		},
		{
			label: "Monthly Distributions",
			parentKey: "monthlyDistribution",
			subValues: [
				{
					label: "January",
					value: data.monthlyDistribution["january"],
					name: "january",
					error: errors.monthlyDistribution["january"],
					isPercentage: true,
				},
				{
					label: "February",
					value: data.monthlyDistribution["february"],
					name: "february",
					error: errors.monthlyDistribution["february"],
					isPercentage: true,
				},
				{
					label: "March",
					value: data.monthlyDistribution["march"],
					name: "march",
					error: errors.monthlyDistribution["march"],
					isPercentage: true,
				},
				{
					label: "April",
					value: data.monthlyDistribution["april"],
					name: "april",
					error: errors.monthlyDistribution["april"],
					isPercentage: true,
				},
				{
					label: "May",
					value: data.monthlyDistribution["may"],
					name: "may",
					error: errors.monthlyDistribution["may"],
					isPercentage: true,
				},
				{
					label: "June",
					value: data.monthlyDistribution["june"],
					name: "june",
					error: errors.monthlyDistribution["june"],
					isPercentage: true,
				},
				{
					label: "July",
					value: data.monthlyDistribution["july"],
					name: "july",
					error: errors.monthlyDistribution["july"],
					isPercentage: true,
				},
				{
					label: "August",
					value: data.monthlyDistribution["august"],
					name: "august",
					error: errors.monthlyDistribution["august"],
					isPercentage: true,
				},
				{
					label: "September",
					value: data.monthlyDistribution["september"],
					name: "september",
					error: errors.monthlyDistribution["september"],
					isPercentage: true,
				},
				{
					label: "October",
					value: data.monthlyDistribution["october"],
					name: "october",
					error: errors.monthlyDistribution["october"],
					isPercentage: true,
				},
				{
					label: "November",
					value: data.monthlyDistribution["november"],
					name: "november",
					error: errors.monthlyDistribution["november"],
					isPercentage: true,
				},
				{
					label: "December",
					value: data.monthlyDistribution["december"],
					name: "december",
					error: errors.monthlyDistribution["december"],
					isPercentage: true,
				},
			],
		},
		{
			label: "Cent Rate",
			parentKey: "centRate",
			subValues: [
				{
					label: "750",
					value: data.centRate["750"],
					name: "750",
					error: errors.centRate["750"],
				},
				{
					label: "775",
					value: data.centRate["775"],
					name: "775",
					error: errors.centRate["775"],
				},
				{
					label: "800",
					value: data.centRate["800"],
					name: "800",
					error: errors.centRate["800"],
				},
				{
					label: "825",
					value: data.centRate["825"],
					name: "825",
					error: errors.centRate["825"],
				},
				{
					label: "850",
					value: data.centRate["850"],
					name: "850",
					error: errors.centRate["850"],
				},
				{
					label: "875",
					value: data.centRate["875"],
					name: "875",
					error: errors.centRate["875"],
				},
				{
					label: "900",
					value: data.centRate["900"],
					name: "900",
					error: errors.centRate["900"],
				},
				{
					label: "925",
					value: data.centRate["925"],
					name: "925",
					error: errors.centRate["925"],
				},
				{
					label: "950",
					value: data.centRate["950"],
					name: "950",
					error: errors.centRate["950"],
				},
				{
					label: "975",
					value: data.centRate["975"],
					name: "975",
					error: errors.centRate["975"],
				},
				{
					label: "1000",
					value: data.centRate["1000"],
					name: "1000",
					error: errors.centRate["1000"],
				},
				{
					label: "1025",
					value: data.centRate["1025"],
					name: "1025",
					error: errors.centRate["1025"],
				},
				{
					label: "1050",
					value: data.centRate["1050"],
					name: "1050",
					error: errors.centRate["1050"],
				},
				{
					label: "1075",
					value: data.centRate["1075"],
					name: "1075",
					error: errors.centRate["1075"],
				},
				{
					label: "1100",
					value: data.centRate["1100"],
					name: "1100",
					error: errors.centRate["1100"],
				},
			],
		},
	];

	return (
		<PageLayout loading={loading} hideBackButton>
			<Typography variant="h5">Utility Rates</Typography>

			<Divider sx={{ mt: 14, mb: 24 }} />

			<form onSubmit={handleUpdateProfile}>
				<Box
					display="grid"
					gridTemplateColumns={{ xs: "1fr", md: "340px 1fr" }}
					gap={{ xs: 10, md: 32 }}
					alignItems="center"
				>
					<Box alignSelf="flex-start">
						<Typography variant="h5">Application Logo</Typography>
						<Typography fontSize={15} mt={10}>
							This Logo will be displayed on all apps
						</Typography>
					</Box>
					<Box>
						<ImageUploader onUpdate={handleSelectImage} imageFile={applicationLogo} isLogo />
					</Box>
					{fields.map((field, idx) => (
						<React.Fragment key={idx}>
							<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
								{field.label}
								<Asterisk />
							</Typography>

							{field.subValues ? (
								<Box
									display="grid"
									alignItems="flex-start"
									gridTemplateColumns={{ xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }}
									gap={{ xs: 10, md: 32 }}
									sx={{
										padding: 16,
										bgcolor: colors.primary + "09",
										border: `1.5px dotted ${colors.primary}`,
										borderRadius: borderRadius.md,
									}}
								>
									{/* <Typography
										// textAlign="center"
										variant="h6"
										fontSize={18}
										alignSelf={field.subValues ? "flex-start" : "unset"}
										mb="20px"
									>
										{field.label}
									</Typography>
									<Box
										display="grid"
										alignItems="flex-start"
										gridTemplateColumns={{ xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }}
										gap={{ xs: 10, md: 32 }}
										// sx={{
										// 	padding: 16,
										// 	bgcolor: colors.primary + "09",
										// 	border: `1.5px dotted ${colors.primary}`,
										// 	borderRadius: borderRadius.md,
										// }}
									> */}
									{field.subValues?.map((subField: any) => (
										<CustomTextField
											label={subField.label}
											key={subField.name}
											type="number"
											name={subField.name}
											value={subField.value}
											placeholder={subField.label}
											error={subField.error}
											endIcon={subField.isPercentage ? <>%</> : <></>}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												handleOnChange(
													e,
													true,
													field.parentKey === "monthlyDistribution" ? "monthlyDistribution" : "centRate",
												)
											}
											onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
												e.target.addEventListener("wheel", (e: Event) => e.preventDefault(), { passive: false })
											}
										/>
									))}
									{/* </Box> */}
								</Box>
							) : (
								<CustomTextField
									type="number"
									name={field.name}
									value={field.value}
									placeholder={field.label}
									error={field.error}
									onChange={handleOnChange}
									endIcon={field.unit ? <>{field.unit}</> : field.isPercentage ? <>%</> : <></>}
									onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
										e.target.addEventListener("wheel", (e: Event) => e.preventDefault(), { passive: false })
									}
								/>
							)}
						</React.Fragment>
					))}

					<Box />
					<Box display="flex" alignItems="center" justifyContent="flex-end" gap={20}>
						<CustomButton variant="outlined" color="secondary" onClick={handleCancel}>
							Cancel
						</CustomButton>
						<CustomButton type="submit">Save Changes</CustomButton>
					</Box>
				</Box>
			</form>
		</PageLayout>
	);
};

export default UtilityRatesPage;
