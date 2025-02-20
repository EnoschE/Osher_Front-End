import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFViewerProps {
	pdf: string; // You can also use File type if you want to accept PDF files
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdf }) => {
	const [numPages, setNumPages] = useState(0);
	const [pageNumber, setPageNumber] = useState(1);

	useEffect(() => {
		const loadPdf = async () => {
			const pdfDocument = pdfjs.getDocument(pdf);
			const { numPages } = await pdfDocument.promise;
			setNumPages(numPages);
		};
		loadPdf();
	}, [pdf]);

	const handlePreviousPage = () => {
		if (pageNumber > 1) {
			setPageNumber(pageNumber - 1);
		}
	};

	const handleNextPage = () => {
		if (pageNumber < numPages) {
			setPageNumber(pageNumber + 1);
		}
	};

  const loadSuccess =()=> {
    console.log("PDF loaded successfully!")
  }

	return (
		<div>
			<Document file={pdf} onLoadSuccess={loadSuccess}>
				<Page pageNumber={pageNumber} />
			</Document>
			<p>
				Page {pageNumber} of {numPages}
			</p>
			<button onClick={handlePreviousPage}>Previous Page</button>
			<button onClick={handleNextPage}>Next Page</button>
		</div>
	);
};

export default PDFViewer;
