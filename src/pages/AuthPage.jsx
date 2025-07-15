import React, { useState } from "react";
import Login from "../components/Login";
import OTP from "../components/OTP";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const navigate = useNavigate();
  const [otpStep, setOtpStep] = useState(false);
  const [otpData, setOtpData] = useState(null);

  const handleOtpSent = (data) => {
    setOtpData(data);
    setOtpStep(true);
  };

  const handleOtpVerified = (verifiedData) => {
    console.log("User verified successfully:", verifiedData);
    navigate("/dashboard");
  };

  const handleResendOtp = () => {
    if (!otpData) return;

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpData({
      ...otpData,
      otp: newOtp,
      message: `New OTP sent to ${otpData.phoneData.countryCode} ${otpData.phoneData.phoneNumber}. Use: ${newOtp}`,
    });

    console.log("New OTP:", newOtp); 
  };

  const handleBackToLogin = () => {
    setOtpStep(false);
    setOtpData(null);
  };

  return (
    <>
      {otpStep ? (
        <OTP
          otpData={otpData}
          onVerifySuccess={handleOtpVerified}
          onResendOtp={handleResendOtp}
          onBack={handleBackToLogin}
        />
      ) : (
        <Login onOtpSent={handleOtpSent} />
      )}
    </>
  );
}

export default AuthPage;
