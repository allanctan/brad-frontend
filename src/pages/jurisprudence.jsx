import React, { useState, useEffect } from "react";
import styles from "@/styles/jurisprudence.module.css";
import PdfViewer from "@/components/pdf-viewer"
import JurisprudenceTabs from "@/components/jurisprudence-tab";
import Paper from '@mui/material/Paper';
import SimpleDialog from "@/components/progress-dialog";
import LabelValue from "@/components/label-value"
import Chatbox from "@/components/chat/chatbox";

function Jurisprudence() {
    const [url, setUrl] = useState('');
    const [pdfLinksStatus, setPdfLinksStatus] = useState('Pending');
    const [ocrStatus, setOcrStatus] = useState('Pending');
    const [analyzeStatus, setAnalyzeStatus] = useState('Pending');
    const [stepIndex, setStepIndex] = useState(0);
    const [pdfLink, setPdfLink] = useState('/initial.pdf');
    const [ocrLink, setOcrLink] = useState('');
    const [numPages, setNumPages] = useState(0);
    const [extractedData, setExtractedData] = useState({});
    const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
    const [open, setOpen] = React.useState(false);
  
    const backendUrl = 'https://predictive-analytics.dev/';

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = (value) => {
      setOpen(false);
    };
  
    const handleChange = (event) => {
        setUrl(event.target.value);
    };

    const handleProgressChange = (index) => {
        setStepIndex(index)
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        handleProgressChange(0);
        setPdfLinksStatus("Pending");
        setOcrStatus("Pending");
        setAnalyzeStatus("Pending");
        setOpen(true);

        fetch(backendUrl + '/get-pdf-links', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url }),
        })
            .then(response => response.json())
            .then(data => {
                setPdfLinksStatus('Success');
                handleProgressChange(1);
                console.log(backendUrl + data.pdf_viewer);
                setPdfLink(backendUrl + data.pdf_viewer);
                return fetch(backendUrl + '/read-ocr', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pdf_url: data.pdf_links[0] }),
                })
                    .then(response => response.json())
                    .then(data => {
                        handleProgressChange(2);
                        setOcrStatus('Success');
                        setOcrLink(data.filename);
                        return fetch(backendUrl + '/extract-data', {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ json_file: data.filename }),
                        })
                            .then(response => response.json())
                            .then(data => {
                                handleProgressChange(3);
                                setExtractedData(JSON.parse(data.data));
                                setAnalyzeStatus('Success');
                            })
                            .catch(() => {
                                setAnalyzeStatus('Error');
                            });
                    })
                    .catch(() => {
                        setOcrStatus('Error');
                    });
            })
            .catch(() => {
                setPdfLinksStatus('Error');
            });
    };

    return (
        <div>
            <header className={styles.header}>
                <h3 className={styles.title}> Welcome to Brad! </h3>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <p className={styles.label}>URL:</p>
                    <form onSubmit={handleSubmit}>
                        <label>
                            <input type="text" className={styles.urlInput} value={url} onChange={handleChange} />
                        </label>
                        <SimpleDialog
                            open={open}
                            onClose={handleClose}
                            activeStep={stepIndex}
                        />
                        <button type="submit">Analyze</button>
                    </form>
                </div>
                <div></div>
            </header>
            <div style={{ display: "flex" }}>
                <div style={{ width: "60%" }}>
                    <PdfViewer pdf={pdfLink} />
                </div>
                <div style={{ width: "40%", margin: "0 3em" }}>
                    <JurisprudenceTabs onTabChange={setSelectedTabIndex} />
                    {selectedTabIndex === 0 ? (
                        <>
                            <Paper className={styles.paperStyle} elevation={3}>
                                <LabelValue label="CASE NO" value={extractedData.case_no ?? "N/A"}/>
                                <LabelValue label="CASE TITLE" value={extractedData.case_title ?? "N/A"}/>
                                <LabelValue label="DOCUMENT TYPE" value={extractedData.document_type ?? "N/A"}/>
                                <LabelValue label="DOCUMENT DATE" value={extractedData.document_date ?? "N/A"}/>
                                <LabelValue label="BRIEF" value={extractedData.brief ?? "N/A"}/>
                                <LabelValue label="SUMMARY" value={extractedData.summary ?? "N/A"}/>
                            </Paper>
                        </>
                    ) : null}
                    {selectedTabIndex === 1 ? (
                        <Chatbox filename={ocrLink}/>
                    ) : null}

                </div>
            </div>
        </div>
    );
}

export default Jurisprudence;
