import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

const theme = createTheme({
  components: {
    MuiSnackbar: {
      variants: [
        {
          props: { variant: "error" },
          style: {
            "& .MuiSnackbarContent-root": {
              background: "#c34747",
            },
          },
        },
        {
          props: { variant: "success" },
          style: {
            "& .MuiSnackbarContent-root": {
              background: "#078728",
            },
          },
        },
        {
          props: { variant: "warning" },
          style: {
            "& .MuiSnackbarContent-root": {
              background: "#dd8a20",
            },
          },
        },
      ],
    },
  },
});

export default function CustomSnackbar(props) {
  let [open, setOpen] = React.useState(props.open);
  // let open = props.open
 

  const handleClose = () => {
        setOpen(false);
  };

  const action = (
    <React.Fragment>
      {/* <IconButton size="small" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton> */}
    </React.Fragment>
  );

  return (
    <ThemeProvider theme={theme}>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        variant={props.variant}
        open={props.open}
        autoHideDuration={5000}
        message={props.message}
        action={action}
      />
    </ThemeProvider>
  );
}
