import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getTechnicianSiteSchedules } from "../../../Services/technicianService";
import { Box, Divider, Typography } from "@mui/material";
import { useSelector } from "../../../Redux/reduxHooks";
import { selectColors } from "../../../Redux/Slices/generalSlice";
import CustomDialog from "../../Common/CustomDialog";
import { getStreetViewImage } from "../../../Utils/utils";
import styled from "@emotion/styled";
import { Avatar } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import HomeIcon from "@mui/icons-material/Public";
import BadgeIcon from "@mui/icons-material/BadgeOutlined";
import StatusChip from "../../Common/StatusChip";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import TableBlock from "../../Common/Table/TableBlock";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import CustomButton from "../../Common/CustomButton";
import { allRoutes } from "../../../Routes/AllRoutes";
import { useNavigate } from "react-router-dom";

export const tableHeaders: any = [
	{ text: "Title", key: "title", sortable: true },
	{ text: "Customer Name", key: "name", sortable: true },
	{ text: "Date", key: "date", customComponent: ({ text }: { text: string }) => <>{formatDate(text)}</> },
	{ text: "Time", key: "time" },
];

const TechnicianCalendar: React.FC<{ technicianId: string | null }> = ({ technicianId }) => {
	const colors = useSelector(selectColors);

	const [siteSchedules, setSiteSchedules] = useState<any>(null);
	const [selectedEvent, setSelectedEvent] = useState<any>(null);

	useEffect(() => {
		getDetails();
	}, [technicianId]);

	function getFormattedSchedules(schedules: any) {
		return schedules.map((schedule: any) => ({
			id: schedule.id,
			title: schedule.title,
			...schedule.extendedProps,
			...schedule.extendedProps.customer,
		}));
	}

	async function getDetails() {
		if (!technicianId) return;

		try {
			const {
				data: { upcomingSchedules, pastSchedules, allSchedules },
			} = await getTechnicianSiteSchedules(technicianId);

			const formatedUpcomingSchedules = getFormattedSchedules(upcomingSchedules);
			const formatedPastSchedules = getFormattedSchedules(pastSchedules);

			console.log({ formatedPastSchedules, formatedUpcomingSchedules });

			setSiteSchedules({
				allSchedules,
				pastSchedules: formatedPastSchedules,
				upcomingSchedules: formatedUpcomingSchedules,
			});
		} catch (err: any) {
			console.log("Error ", err);
			toast.error(err.message);
		}
	}

	const renderEventContent = (eventInfo: any) => {
		return (
			<div>
				<span>{eventInfo.event.title.replace("Installation - ", "")}</span>
				<br />
				<b>
					{eventInfo.timeText.endsWith("p")
						? eventInfo.timeText.replace("p", " PM")
						: eventInfo.timeText.endsWith("a")
						? eventInfo.timeText.replace("a", " AM")
						: eventInfo.timeText}{" "}
				</b>
			</div>
		);
	};

	function handleEventClick({ event: { _def: data } }: any) {
		console.log({ data });
		if (data) {
			setSelectedEvent(data);
		}
	}

	return (
		<div>
			{siteSchedules && (
				<>
					<Typography variant="h4" mb={25}>
						All Installations
					</Typography>

					<Box
						sx={{
							"& .fc .fc-button-primary": {
								color: colors.primary,
								borderColor: colors.border,
								backgroundColor: colors.primaryMidLight,
							},
							"& .fc .fc-button-primary:hover": {
								backgroundColor: colors.primary,
								borderColor: colors.border,
								color: "white",
							},
							"& .fc .fc-button-active, & .fc-today-button": {
								backgroundColor: `${colors.primary} !important`,
								borderColor: `${colors.border} !important`,
								color: "white !important",
							},
							"& .fc-toolbar-title": {
								fontSize: "1.2em",
							},
							"& .fc .fc-daygrid-day.fc-day-today, & .fc .fc-timegrid-col.fc-day-today": {
								backgroundColor: colors.primaryMidLight,
							},
							"& .fc .fc-event": {
								backgroundColor: colors.primary,
								borderColor: colors.border,
								color: "white",
								paddingInline: "5px",
								transition: "all 300ms cubic-bezier(0.075, 0.82, 0.165, 1)",
								cursor: "pointer",
								marginBottom: "4px",
							},
							"& .fc .fc-event:hover": {
								transform: "scale(0.98)",
							},
							"@media (max-width: 768px)": {
								"& .fc-header-toolbar": {
									flexDirection: "column",
									gap: "20px",
								},
								"& .fc-header-toolbar .fc-toolbar-chunk:first-child": {
									order: 1,
								},
							},
						}}
					>
						<FullCalendar
							plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
							initialView={"timeGridDay"}
							headerToolbar={{
								left: "prev,next today",
								center: "title",
								right: "timeGridDay,timeGridWeek,dayGridMonth",
							}}
							weekends={false}
							events={siteSchedules.allSchedules}
							dayMaxEvents={5}
							defaultAllDay={false}
							slotMinTime="06:00:00"
							slotMaxTime="22:00:00"
							eventContent={renderEventContent}
							eventBackgroundColor={colors.primary}
							eventBorderColor={colors.primaryLight}
							eventClick={handleEventClick}
						/>
					</Box>

					<Box sx={{ mt: 30 }} />

					<TableBlock
						heading="All upcoming installations"
						subHeading="These are list of all upcoming installations"
						tableHeaders={tableHeaders}
						tableData={siteSchedules.upcomingSchedules}
						onRowClick={(row: any) => {
							setSelectedEvent(siteSchedules.allSchedules.find((schedule: any) => schedule.id === row.id));
						}}
					/>
					<Box sx={{ mt: 30 }} />

					<TableBlock
						heading="All past installations"
						subHeading="These are list of all past installations"
						tableHeaders={tableHeaders}
						tableData={siteSchedules.pastSchedules}
						onRowClick={(row: any) => {
							setSelectedEvent(siteSchedules.allSchedules.find((schedule: any) => schedule.id === row.id));
						}}
					/>
					<Box sx={{ mt: 30 }} />

					<ViewSiteScheduleDialog event={selectedEvent} open={!!selectedEvent} onClose={() => setSelectedEvent(null)} />
				</>
			)}
		</div>
	);
};

export default TechnicianCalendar;

const ImageContainer = styled(Box)({
	position: "relative",
	height: 200,
	width: "100%",
	overflow: "hidden",
});

const Overlay = styled(Box)(({ theme }) => ({
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	backgroundColor: "rgba(0,0,0,0.4)",
}));

const StyledTypography = styled(Typography)({
	position: "absolute",
	bottom: 16,
	left: 16,
	color: "white",
	fontSize: 20,
	fontWeight: 500,
});

interface DialogProps {
	open: boolean;
	onClose?: () => void;

	onSuccess?: () => void;
	event: any;
}

const ViewSiteScheduleDialog = ({ open, onClose, event }: DialogProps) => {
	if (!event) return <></>;
	const navigate = useNavigate();

	const { customer, time, date, status } = event.extendedProps;

	const formattedDate = formatDate(date);
	console.log(event);

	return (
		<CustomDialog open={open} onClose={onClose} maxWidth="500px" iconColor="white" contentStyle={{ padding: "0px" }}>
			<ImageContainer>
				<img
					src={getStreetViewImage(customer?.address)}
					alt="customer home"
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						position: "absolute",
					}}
				/>
				<Overlay />
				<StyledTypography variant="subtitle1">{event.title}</StyledTypography>
			</ImageContainer>
			<Box p={20}>
				<Box
					display="grid"
					gridTemplateColumns={{ xs: "1fr", md: "130px 1fr" }}
					gap={5}
					rowGap={16}
					alignItems="start"
					justifyItems="flex-start"
				>
					<Box display={"flex"} alignItems={"center"}>
						<AccessTimeIcon sx={{ mr: 9, fontSize: "15px" }} />
						<Typography variant="h6" fontSize="15px">
							Time:
						</Typography>
					</Box>
					<Typography>{time}</Typography>

					<Box display={"flex"} alignItems={"center"}>
						<CalendarMonthIcon sx={{ mr: 9, fontSize: "15px" }} />
						<Typography variant="h6" fontSize="15px">
							Date:
						</Typography>
					</Box>
					<Typography>{formattedDate}</Typography>

					<Box display={"flex"} alignItems={"center"}>
						<SolarPowerIcon sx={{ mr: 9, fontSize: "15px" }} />
						<Typography variant="h6" fontSize="15px">
							Status:
						</Typography>
					</Box>
					<StatusChip status={status}></StatusChip>
				</Box>

				<Divider sx={{ my: 10 }}></Divider>
				<Box>
					<Box display={"flex"} gap={4}>
						<Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
							Customer Details
						</Typography>

						<CustomButton
							onClick={() =>
								navigate(allRoutes.VIEW_CUSTOMER.replace(":id", (customer?.sequentialId || "")?.toString()))
							}
							variant="text"
							sx={{ padding: 5, minWidth: "unset" }}
						>
							<LaunchOutlinedIcon sx={{ fontSize: "15px" }} />
						</CustomButton>
					</Box>

					<Box
						display="grid"
						gridTemplateColumns={{ xs: "1fr", md: "130px 1fr" }}
						gap={5}
						rowGap={16}
						alignItems="center"
						justifyItems="flex-start"
						mt={15}
					>
						<Box display={"flex"} alignItems={"center"}>
							<AccountCircleIcon sx={{ mr: 9, fontSize: "15px" }} />
							<Typography variant="h6" fontSize="15px">
								Profile:
							</Typography>
						</Box>

						<Avatar src={customer?.ImageUrl} />

						<Box display={"flex"} alignItems={"center"}>
							<BadgeIcon sx={{ mr: 9, fontSize: "15px" }} />
							<Typography variant="h6" fontSize="15px">
								Name:
							</Typography>
						</Box>
						<Typography>{customer?.name}</Typography>

						<Box display={"flex"} alignItems={"center"}>
							<HomeIcon sx={{ mr: 9, fontSize: "16px" }} />
							<Typography variant="h6" fontSize="15px">
								Address:
							</Typography>
						</Box>
						<Typography>{customer?.address}</Typography>

						<Box display={"flex"} alignItems={"center"}>
							<MailOutlineIcon sx={{ mr: 9, fontSize: "15px" }} />
							<Typography variant="h6" fontSize="15px">
								Email:
							</Typography>
						</Box>
						<Typography>{customer?.email}</Typography>

						{customer?.phone && (
							<>
								<Box display={"flex"} alignItems={"center"}>
									<LocalPhoneOutlinedIcon sx={{ mr: 9, fontSize: "15px" }} />
									<Typography variant="h6" fontSize="15px">
										Phone No:
									</Typography>
								</Box>
								<Typography>{customer?.phone}</Typography>
							</>
						)}
					</Box>
				</Box>
			</Box>
		</CustomDialog>
	);
};

const formatDate = (date: string) => {
	const options: any = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
	return new Date(date).toLocaleDateString("en-US", options);
};
