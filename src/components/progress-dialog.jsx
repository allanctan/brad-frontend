import * as React from 'react';

import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';

export default function SimpleDialog(props) {
    const { onClose, open, activeStep } = props;

    const handleClose = () => {
        onClose(activeStep);
    };

    const steps = ['Retrieve', 'Read', 'Analyze'];
    console.log(activeStep);

    return (
        <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
            <DialogTitle style={{ textAlign: 'center' }}> Processing Document</DialogTitle>
            <DialogContent style={{ maxHeight: '250px', height: '40vh', textAlign: 'center' }}>
                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <Box m={5}>
                        {activeStep == 0 ? (
                            <>
                                <CircularProgress />
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    STEP #1: Retrieving the document by crawling the page and looking for the document...
                                </Typography>
                            </>
                        ) : null}
                        {activeStep == 1 ? (
                            <>
                                <CircularProgress />
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    STEP #2: Reading the document using OCR to convert document into readable text...
                                </Typography>
                            </>
                        ) : null}
                        {activeStep == 2 ? (
                            <>
                                <CircularProgress />
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    STEP #3: Analyzing the content of the text to extract information about the document...
                                </Typography>
                            </>
                        ) : null}
                        {activeStep == 3 ? (
                            <>
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                Processing is finished.
                            </Typography>
                            <StarIcon style={{ color: 'orange', fontSize: '48px' }} />
                            </>
                        ) : null}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}