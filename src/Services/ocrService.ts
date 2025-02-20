import axios from "axios";

const base64ToBlob = (base64: string, type: string) => {
	const byteCharacters = atob(base64);
	const byteNumbers = new Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}
	const byteArray = new Uint8Array(byteNumbers);
	return new Blob([byteArray], { type });
};

export const convertPDFtoJPG = async (pdfFile: File) => {
	const secret = "LZ4AFR2BL9ViYwVl";
	const apiKey = "206836286"; // TODO: move to env file
	const apiUrl = `https://v2.convertapi.com/convert/pdf/to/jpg?Secret=${secret}`;

	const requestData = new FormData();
	requestData.append("ApiKey", apiKey);
	requestData.append("File", pdfFile);

	try {
		const response = await axios.post(apiUrl, requestData);
		if (response.status === 200) {
			const jpgFiles = response.data.Files.map((file: any) => {
				const blob = base64ToBlob(file.FileData, `image/${file.FileExt}`);
				return new File([blob], file.FileName, { type: blob.type });
			});

			return jpgFiles;
		}
	} catch (error) {
		console.error("Error converting PDF to JPG:", error);
	}
};
