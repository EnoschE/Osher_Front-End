import { Backdrop, CircularProgress } from "@mui/material";

interface LoaderProps {
	open?: boolean;
	handleClose?: any;
}

const Loader = ({ open = false, handleClose }: LoaderProps) => {
	return (
		<Backdrop
			sx={{
				color: "#fff",
				zIndex: (theme) => theme.zIndex.drawer + 1,
			}}
			open={open}
			onClick={handleClose}
		>
			<CircularProgress color="inherit" />
		</Backdrop>
	);
};

export default Loader;
