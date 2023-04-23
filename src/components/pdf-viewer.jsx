import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import Pagination from '@mui/material/Pagination';


export default function PdfViewer(props) {
    const [numPages, setNumPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1); //setting 1 to show fisrt page

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const handleChangePage = (event, newPage) => {
        console.log(newPage);
        setPageNumber(newPage);
    };

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    const { pdf } = props;

    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <div>
                    <Document
                        file={pdf}
                        options={{ workerSrc: "/pdf.worker.js" }}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        <Page pageNumber={pageNumber} renderTextLayer={false} />
                    </Document>
                </div>
                <div style={{ alignSelf: "center" }}>
                    <Pagination count={numPages} page={pageNumber} onChange={handleChangePage} variant="outlined" />
                </div>
            </div>
        </>
    );
}