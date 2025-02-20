import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserState } from "../../Redux/Slices/userSlice";
import { PlaceType } from "../Common/GoogleMapsTextField";
import { allRoutes } from "../../Routes/AllRoutes";
import Loader from "../Common/Loader";
import EditAdmin from "../Admins/EditAdmin";
import { verifyTokenService } from "../../Services/userService";
import { roles } from "../../Utils/tokenKeyValue";
import CustomDialog from "./CustomDialog";
interface AccountSettingsData extends UserState {
	confirmPassword?: string;
	addressObject?: PlaceType | null;
}

const defaultData = {
	name: "",
	addressObject: null,
	phone: "",
	password: "",
	confirmPassword: "",
};

const AccountCreation = () => {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const navigate = useNavigate();

	const [data, setData] = useState<AccountSettingsData>(defaultData);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		verifyToken();
	}, [token]);

	const verifyToken = async () => {
		console.log({ token });
		if (!token) return;
		try {
			const { data: tokenFormData } = await verifyTokenService(token);
			console.log({ data: tokenFormData });
			console.log("Set the data");
			setData({
				...tokenFormData,
				addressObject: {
					description: tokenFormData.address,
					structured_formatting: {
						main_text: tokenFormData.address,
						secondary_text: tokenFormData.address,
					},
				},
			});
			return data;
		} catch (error: any) {
			toast.error(error.message);
			navigate(allRoutes.HOME);
		}
	};

	return (
		<CustomDialog open={true} maxWidth={"900px"}>
			<Loader open={loading} />

			{token && <FormComponent token={token} data={data}></FormComponent>}
		</CustomDialog>
	);
};

function FormComponent({ token, data }: any) {
	let jsx = <></>;
	const adminRoles = [roles.ADMIN_MANGER, roles.DIRECTOR, roles.PSL, roles.SUPER_ADMIN];

	if (adminRoles.includes(data.role)) {
		jsx = <EditAdmin token={token} tokenFormData={data} />;
	}

	return jsx;
}

export default AccountCreation;
