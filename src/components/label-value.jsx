import { Typography } from '@mui/material';

export default function LabelValue({ label, value }) {
    return (
      <p>
          <Typography variant="overline">{label}:</Typography><br/>
        <span>{value}</span>
      </p>
    );
  }