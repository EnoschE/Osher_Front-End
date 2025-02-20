import * as React from "react";
import BillUploader from "./BillUploader";
import CustomButton from "../Common/CustomButton";
import { createWorker } from "tesseract.js";
import { Box, Divider } from "@mui/material";
// import pdfjs from "pdfjs-dist";
// import { getDocument } from "pdfjs-dist/legacy/build/pdf";
// import { fromBuffer } from "pdf2pic";
// TODO: will delete this file later

function extractValue(text: string, regex: RegExp) {
	const match = text.match(regex);
	return match ? parseFloat(match[1]) : null;
}

// const nationBillText = `TEXT B B oti pay — BILLING PERIOD PAGE 2 of 2
// National Grid Feb 12, 2016 to Mar 15,2016
// 1010 ANY STREET
// ANYTOWN RI 99999 ACCOUNTNUMBER
// 99999-99999 Apr 9, 2016 $70.11
// DETAIL OF CURRENT CHARGES
// Enrollment Information — —
// To enroll with a supplier or change to Delivery Services
// another supplier, you will need the
// following gi gl yedraecokits Service Period No. of days Current Reading - Previous Reading = Total Usage
// Loadzone elslan _— —
// AcctNo: 99999-09990 Cycle: 11, INGE Feb12-Mar16 ~~ 82 ~~ 26757 Acar ~~ 26384Acwsr ~~ 373kWh
// METER NUMBER 12345678 NEXT SCHEDULED READ DATE ON OR ABOUT Apr 15
// Electric Usage History RATE Basic Residential Rate A-16
// Month kWh Month kWh -— mW ee
// Mar 15 303 Oct15 239 Customer Charge 5.00
// hss 2 Roy 3 = LIHEAP Enhancement Charge 0.73
// Jun 15 259 Jan 16 514 Distribution Energy Chg 0.04164 x 373 kWh 15.53
// Jul 15 332 Feb 16 331 LC
// Aug 15 489 Mar 16 373 Energy Efficiency Prgrms 0.01107 x 373 kWh 4.13
// LEpIe 585 Renewable Egy Dist Chg 0.00233 x 373 kWh 0.87
// Transmission Charge 0.02348 x 373 kWh 8.76
// Transition Charge -0.00201 x 373 kWh -0.75
// RE Growth Program 0.17
// Total Delivery Services $ 34.44
// Right To Dispute Your Bill Supply Services
// And To An Impartial Hearing suppLIER National Grid
// If you believe your bill is inaccurate
// or for any reason payment may be
// withheld, you should first contact _EnergyCharge ~~ 0.08901 x 373kWh ~~ 3321
// our Customer Service Department at Total Supply Services $ 33.21
// 1-800-322-3223. If a mutually
// satisfactory settlement of this matter .
// cannot be made, you have the right Other Charges/Adjustments
// to submit this matter to: Reviewing -_—
// Officer, Division of Public Utilities Paperless Billing Credit -0.34
// and Carriers, 89 Jefferson Bivd., .
// Warwick, Rhode Island 02888 Gross Earnings Tax 0.04166667 x 67.31 2.80
// Telephone: 401-780-9700. National Total Other Charges/Adjustments $ 2.46
// Grid will not disconnect your service
// pending proceedings before a
// reviewing officer appointed by the
// Public Utilities Administrator.
// LIHEAP Charge
// This charge is required under Rhode
// Island law and will be used to provide _ } )
// funding for a Low-Income Home Right To Electric Service: Termination of Service to Elderly or Handicapped
// Energy Assistance Program EEE
// ("LIHEAP") Enhancement Plan, During Serious lliness: If you or anyone presently and If all residents in your household are 62 years of age
// designed to assist low-income electric normally living in your home is seriously ill, we will not or older or if any resident in your household is
// and natural gas households with their discontinue your electric service during such illness handicapped, the Company will not terminate your
// home energy and heating needs. By providing you: have a registered physician certify in writing service for failure to pay the past due bill without
// (on. i Ere Be meio — than to us that such illness exists, the nature and duration of the written approval from the Division of Public Utilities. If
// $10 4 A Jectri illness and you make satisfactory arrangements to pay your you cannot pay your bill all at once, you may be able
// per year or eac elect or bill. This certification must be received within seven (7) days to work out a payment plan with the Company. The
// natural gas service account. from the date that your physician initially contacts our Credit ~~ Elderly or Handicapped Forms that must be filled out
// R -— Department at 1-888-211-1313. are available at the Company. The Form also enables
// Explanation of Billing Terms You have a child under twenty four months and a you to participate in "Third Party Notification". If you
// Available financial hardship: If you or anyone presently and normally have any questions or want further information, call the
// RN ,.S§l]lhkAL living in your home has a child under twenty four months old ~~ Credit Department at 1-888-211-1313.
// If you would like an explanation of we will not terminate your electric service, provided you also
// any of the tems used on your bill have a financial hardship. Please call our Credit Department
// you may find them on our web site at 1-888-211-1313 immediately if this applies to you.
// at www.nationalgrid.com or you may Notice About Electronic Check Conversion
// call us at 1-800-322-3223. By sending your completed, signed check to us, you authorize us to use the account information from your check to
// make an electronic fund transfer from your account for the same amount as the check. If the electronic fund transfer
// cannot be processed for technical reasons, you authorize us to process the copy of your check.

// `;

// const eversourceBillText = `ERS=URCE
// ____
// Dy OBOA2D $73.30
// Account Number: y .
// Customer name key:
// Statement Date: 07/09/20
// Service Provided To: Electric Account Summary
// Amount Due On 07/04/20 $59.38
// Last Payment Received On 06/26/20 -$59.38
// Sve Addr: Balance Forward a $0.00
// ARLINGTON MA 02476 urrent Lharges/Lredits
// Rate A1 R1 RESIDENTIAL Cycle 05 Electric Supply Services $36.71
// Service from 06/05/20 - 07/08/20 33 Days Delivery Services $36.59
// Next read date on or about: Aug 06, 2020 Total Current Charges ~~ $7330
// Meter Current Previous Current Reading Total Amount Due $73.30
// Number Read Read Usage Type
// 1821475 75600 75332 268 Actual Total Charges for Electricity
// montniyikwhuse —  [embyeiil
// eter1821475
// CL Jur Aug Sep Oct ~~ MNov Dec Jan | Generation Service Charge 268 kWh X .13699 $36.71
// 217 267 203 226 229 323 280 a a cara
// ———————————————————————————————— Subtotal Supplier Services $36.71
// Feb Mar Apr May Jun Jul
// 299 405 288 250 213 268 Delivery
// Rate A1 R1 RESIDENTIAL) (Prorated
// Contact Information ne 1821475 I )
// Emergency: 800-592-2000
// WWW. BVersource.com Customer Charge $7.00
// CustomerServiceMA@eversource.com Distribution Charge 268 kWh X .06455 $17.30
// Pay by Phone: 888-783-661 8 Transition Charge 268 kWh X .00004 $0.01
// Customer Service: 800-592-2000 Transmission Charge 268 kWh X .02731 $7.32
// Revenue Decoupling Charge 268 kWh X .00090 $0.24
// Important Messages About Your Account Distributed Solar Charge 268 kWh X .00190 $0.51
// DIGGING? STATE LAW REQUIRES YOU OR YOUR CONTRACTOR TO CALL DIG Renewable Energy Charge 268 kWh X .00049 $0.13
// SAFE AT 811 AT LEAST THREE BUSINESS DAYS PRIOR TO DIGGING. FOR Energy Efficiency 268 kWh X .01522 $4.08
// MORE INFORMATION VISIT DIGSAFE.COM. IMPORTANT SAFETY INFORMATION Subtotal Delivery Services $36.59
// IS ALSO AVAILABLE IN THE "SAFETY" SECTION OF EVERSOURCE.COM. Total Cost of Electricity $73.30
// Total Current Charges $73.30
// EM_200705.TXT
// Eversource is required to comply with Department of Public Utilities" billing and termination regulations. If you have a dispute please see the bill insert for more information.
// Visit the "Monthly Customer Communications" page under "My Account" then "Billing & Payment" on Eversource.com for an electronic version of this insert.
// Eversource offers Payment Plans for customers with overdue bills. Budget Billing is also available to pay a more consistent bill each month.
// Please see the Customer Rights Supplement for more information.`;

const BillOCR = () => {
	const [bill, setBill] = React.useState<any>("");
	const [data, setData] = React.useState<any>({ delivery: "", supply: "" });

	const handleSelectBill = (pdfFile: any) => {
		setBill(pdfFile);
	};

	console.log("BILL", bill);

	const handleScan = async (evt: any) => {
		evt.preventDefault();

		const worker = await createWorker();

		// Check if the selected file is a PDF
		if (bill.type === "application/pdf") {
			// const converter = new pdf2pic();
			// Convert the PDF to images
			// const imageInfo = await converter.convert(pdfPath, undefined);
			// const imageInfo = await fromBuffer(bill, undefined);
			// console.log("IMA", imageInfo);
			// const imagePromises = imageInfo.map((image) => {
			// 	return new Promise(async (resolve) => {
			// 		const {
			// 			data: { text },
			// 		} = await Tesseract.recognize(image.path, "eng");
			// 		resolve(text);
			// 	});
			// });
			// Read the PDF file and convert it to text
			// const pdfData = await new Response(bill).arrayBuffer();
			// // const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
			// const pdf = await getDocument({ data: pdfData }).promise;
			// const pageCount = pdf.numPages;
			// let pdfText = "";
			// for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
			// 	const page = await pdf.getPage(pageNum);
			// 	const pageText = await page.getTextContent();
			// 	pdfText += pageText.items.map((item: any) => item.str).join(" ");
			// }
			// const {
			// 	data: { text },
			// } = await worker.recognize(pdfText);
			// console.log("TEXT", text);
		} else {
			const {
				data: { text },
			} = await worker.recognize(bill);
			// const text = eversourceBillText;
			// const text = nationBillText;
			console.log("TEXT", text);

			const isEversourceBill = text?.toLowerCase()?.includes("eversource");

			let supplyRegex = /total supplier services \$([\d.]+)/i;
			let deliveryRegex = /total delivery services \$([\d.]+)/i;

			if (!isEversourceBill) {
				supplyRegex = /total supply services \$\s*([\d.]+)/i;
				deliveryRegex = /total delivery services \$\s*([\d.]+)/i;
			}

			const totalSupplyServices = extractValue(text, supplyRegex);
			const totalDeliveryServices = extractValue(text, deliveryRegex);
			const provider = isEversourceBill ? "EVERSOURCE" : "NATIONALGRID";

			setData({
				provider: provider,
				delivery: totalDeliveryServices,
				supply: totalSupplyServices,
			});

			console.log("Provider: ", provider);
			console.log("Total Supply Services: $", totalSupplyServices);
			console.log("Total Delivery Services: $", totalDeliveryServices);
		}
		await worker.terminate();
	};

	return (
		<Box px={80}>
			<h1>OCR</h1>
			<BillUploader onUpdate={handleSelectBill} />
			<CustomButton fullWidth onClick={handleScan}>
				Scan
			</CustomButton>
			<Divider sx={{ my: 20 }} />
			<h1>Provider: {data.provider}</h1>
			<h1>Delivery: {data.delivery}</h1>
			<h1>Supply: {data.supply}</h1>
		</Box>
	);
};

export default BillOCR;
