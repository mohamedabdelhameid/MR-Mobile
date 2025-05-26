import React from "react";
import {
  Modal,
  Backdrop,
  Fade,
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import imgVFE from "./images/VFECash.jpg";
import imgInsta from "./images/Instapay.jpg";

function PaymentModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          style: {
            backdropFilter: "blur(5px)", // تأثير البلور
            backgroundColor: "rgba(0,0,0,0.4)", // خلفية شفافة داكنة
          },
        },
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
        direction: "rtl",
      }}
    >
      <Fade in={open}>
        <Paper
          sx={{
            width: { xs: "90%", md: "600px" },
            p: 4,
            position: "relative",
            outline: "none",
            borderRadius: 2,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              color: "text.secondary",
            }}
          >
            <CloseOutlinedIcon />
          </IconButton>

          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 3, textAlign: "center" }}
          >
            اختر طريقة الدفع
          </Typography>

          <Grid container spacing={3}>
            {/* InstaPay QR */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  الدفع عبر InstaPay
                </Typography>
                <Box
                  component="img"
                  src={imgInsta}
                  alt="InstaPay QR"
                  sx={{ width: 200, height: 200, objectFit: "contain", mb: 2 }}
                />
              </Paper>
            </Grid>

            {/* Wallet QR */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  الدفع عبر المحفظة الإلكترونية
                </Typography>
                <Box
                  component="img"
                  src={imgVFE}
                  alt="Wallet QR"
                  sx={{ width: 200, height: 200, objectFit: "contain", mb: 2 }}
                />
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onClose}
              sx={{ px: 4, py: 1.5 }}
            >
              إغلاق
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
}

export default PaymentModal;
