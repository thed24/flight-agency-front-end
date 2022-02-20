import { Alert, Button } from "@mui/material";

export interface AlertDetails {
  message: string;
  type: "success" | "error";
}

export interface AlertBarProps {
  details: AlertDetails;
  callback: () => void;
}

export default function AlertBar({ details, callback }: AlertBarProps) {
  const { message, type } = details;

  return (
    <Alert
      severity={type}
      action={
        <Button onClick={callback} color="inherit" size="small">
          X
        </Button>
      }
    >
      {message}
    </Alert>
  );
}
