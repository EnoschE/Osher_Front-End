import { Avatar, Box, Divider, Typography } from "@mui/material";
import CustomButton from "../../Common/CustomButton";
import { SiteSurveyLeftBlock } from "../schedulingStyles";
import { useSelector } from "../../../Redux/reduxHooks";
import { selectColors } from "../../../Redux/Slices/generalSlice";
import { selectUser } from "../../../Redux/Slices/userSlice";
import { useEffect, useState } from "react";
import CustomCalendar from "../../Common/CustomCalendar";
import CustomStepper from "../../Common/CustomStepper";
import { CheckCircleOutline, EventAvailableOutlined, EventRepeatOutlined, LoopOutlined } from "@mui/icons-material";
import SchedulingPageLayout from "../SchedulingPageLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { allRoutes } from "../../../Routes/AllRoutes";
import InformationBlock from "../InformationBlock";
import {
	assignTechnician,
	bookSiteSurvey,
	getAppointmentDetails,
	getAvailableSlotsOfTechnician,
	updateSurveyStatus,
} from "../../../Services/schedulingService";
import moment from "moment";
import Loader from "../../Common/Loader";
import { surveyStatuses } from "../../../Utils/enums";
import { navbarHeight, tabsHeight } from "../../../Utils/spacings";

const dummyTechnicianPicture =
	"https://static.vecteezy.com/system/resources/thumbnails/008/013/844/small_2x/asian-technician-civil-engineer-use-tablet-with-smart-pen-technology-on-transport-site-construction-to-inspect-blueprint-engineering-work-online-with-team-at-sunset-time-photo.jpg";

const steps = [
	{ text: "To be scheduled", icon: <EventRepeatOutlined /> },
	{ text: "Scheduled", icon: <EventAvailableOutlined /> },
	{ text: "In progress", icon: <LoopOutlined /> },
	{ text: "Completed", icon: <CheckCircleOutline /> },
];

const getFormattedDate = (date: any) => moment(date).format("YYYY-MM-DD");

const SiteSurvey = () => {
	const colors = useSelector(selectColors);

	const navigate = useNavigate();
	const location = useLocation();
	const user = useSelector(selectUser);
	const searchParams = new URLSearchParams(location.search);

	const [technician, setTechnician] = useState({ _id: "", name: "", picture: "" });
	const [date, setDate] = useState<any>(new Date());
	const [timeSlot, setTimeSlot] = useState<string>("");
	const [allSlots, setAllSlots] = useState<Array<string>>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);
	const [status, setStatus] = useState<null | any>(0);
	const [appointment, setAppointment] = useState<null | any>(null);

	useEffect(() => {
		getBookedAppointment();
	}, []);
	useEffect(() => {
		getAvailableSlots();
	}, [technician, date]);

	const getBookedAppointment = async () => {
		setLoading(true);
		try {
			const { data: bookedAppointment } = await getAppointmentDetails();
			console.log("Appointment: ", bookedAppointment);
			setAppointment(bookedAppointment);

			if (bookedAppointment) {
				if ([surveyStatuses.SCHEDULED, surveyStatuses.PAYMENT_DEPOSITED].includes(bookedAppointment?.status)) {
					setStatus(1);
					if ([surveyStatuses.SCHEDULED].includes(bookedAppointment?.status)) {
						const isRedirectedFromPaymentPage = !!searchParams.get("payment_intent");
						if (isRedirectedFromPaymentPage) {
							await updateSurveyStatus(bookedAppointment?._id, surveyStatuses.PAYMENT_DEPOSITED);
						} else {
							navigate(allRoutes.PAYMENT, { state: { appointmentId: bookedAppointment?._id } });
						}
					}
				} else if ([surveyStatuses.PENDING].includes(bookedAppointment?.status)) {
					setStatus(2);
				} else if ([surveyStatuses.COMPLETED].includes(bookedAppointment?.status)) {
					setStatus(3);
				}
			} else {
				getTechnicianDetails();
			}
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const getTechnicianDetails = async () => {
		try {
			const { data } = await assignTechnician();
			const assignedTechnician = data?.technicianData?.technicianId ?? {};
			if (!assignedTechnician.ImageUrl) {
				assignedTechnician.picture = dummyTechnicianPicture;
			}

			setTechnician(assignedTechnician);
		} catch (error: any) {
			toast.error(error);
		}
	};

	const getAvailableSlots = async () => {
		if (!technician?._id) return;

		try {
			const formattedDate = getFormattedDate(date);
			const { data: availableSlots } = await getAvailableSlotsOfTechnician(technician._id, formattedDate);

			setAllSlots(availableSlots);
			setTimeSlot(availableSlots?.[0] ?? "");
		} catch (error: any) {
			toast.error(error);
		}
	};

	const handleBookSurvey = async () => {
		setSaving(true);
		try {
			const formattedDate = getFormattedDate(date);
			const bookedSurvey = await bookSiteSurvey(formattedDate, timeSlot);

			console.log("Booked: ", bookedSurvey);

			navigate(allRoutes.PAYMENT);
		} catch (error: any) {
			toast.error(error);
		}
		setSaving(false);
	};

	const handleCancel = async () => {
		try {
			navigate(allRoutes.PROPOSAL_ACCEPTANCE);
		} catch (error: any) {
			toast.error(error);
		}
	};

	return (
		<SchedulingPageLayout>
			<Loader open={loading} />
			{status > 0 ? (
				<InformationBlock
					title="You have successfully scheduled a survey"
					subtitle={
						<>
							The site survey will take place on <b>{moment(appointment?.date).format("MM/DD/yyyy")}</b>, at{" "}
							<b>{appointment?.time}</b>.
						</>
					}
					buttonText="Back To Home"
					buttonOnClick={() => navigate(allRoutes.PROPOSAL_ACCEPTANCE)}
					height={`calc(100vh - ${navbarHeight}px - ${tabsHeight}px  - 185px)`}
				/>
			) : (
				<Box sx={{ py: 48, pt: { xs: 0, sm: 70 } }}>
					<Typography variant="h4">Site Survey</Typography>
					<Typography fontSize={16} mt={8}>
						Schedule and manage your site survey below
					</Typography>
					<Divider sx={{ mt: 14, mb: 32 }} />

					<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1.5fr" }, gap: 80 }}>
						<SiteSurveyLeftBlock
							sx={{
								backgroundColor: colors.lightGray,
							}}
						>
							<Box display="flex" alignItems="center" gap={16}>
								<Avatar sx={{ width: 83, height: 83, border: `1px solid ${colors.border}` }} src={technician.picture} />
								<Box>
									<Typography variant="h4">{technician.name || "Your Installation Crew"}</Typography>
									<Typography fontSize={16} mt={8}>
										Site Installation Crew
									</Typography>
								</Box>
							</Box>
							<Divider />
							<Box>
								<Typography variant="h5">Your location</Typography>
								<Typography mt={8}>{user.address || "Your address"}</Typography>
							</Box>

							<Box mt={21}>
								<Typography variant="h5">A message from {technician.name?.split(" ")?.[0]}</Typography>
								<Typography mt={8}>Thank you for scheduling a site survey. I looks forward to meeting you.</Typography>
							</Box>

							<Box>
								<Typography variant="h5">What to expect</Typography>
								<Typography mt={8}>
									We’ll need access to the roof, attic and electrical panel. Please Ensure an adult is home at the time
									of the visit. Allow a 1 hour window for arrival. If anything changes, you may reschedule your site
									survey in advance.
								</Typography>
							</Box>
						</SiteSurveyLeftBlock>

						<Box
							sx={{
								display: "grid",
								borderBottom: `1px solid ${colors.border}`,
								gridTemplateColumns: { xs: "1fr", sm: "1fr 0.8fr" },
								gap: 40,
							}}
						>
							<Box>
								<Typography variant="h5" mb={24}>
									Select Date & Time
								</Typography>
								<CustomCalendar value={date} onChange={setDate} />
							</Box>
							<Box display="flex" flexDirection="column" gap={16} mb={24}>
								{allSlots?.map((item, key) => (
									<CustomButton
										key={key}
										variant="outlined"
										color={item === timeSlot ? "primary" : "secondary"}
										onClick={() => setTimeSlot(item)}
										sx={{ paddingBlock: 9 }}
									>
										{item}
									</CustomButton>
								))}
							</Box>
						</Box>
					</Box>

					<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1.5fr" }, gap: 80, mt: 24 }}>
						<Box display={{ xs: "none", sm: "inline-block" }} />
						<Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={17}>
							<CustomButton
								onClick={handleCancel}
								sx={{ backgroundColor: colors.lightGray, color: colors.text, "&:hover": { color: "white" } }}
							>
								Cancel
							</CustomButton>
							<CustomButton disabled={!timeSlot || saving} onClick={handleBookSurvey} sx={{ order: { xs: -1, sm: 1 } }}>
								Book Survey
							</CustomButton>
						</Box>
					</Box>
				</Box>
			)}

			<Box pt={42} maxWidth={640} mx="auto" mb={{ xs: 32, sm: 70 }}>
				<CustomStepper steps={steps} activeStep={status} />
			</Box>
		</SchedulingPageLayout>
	);
};

export default SiteSurvey;
