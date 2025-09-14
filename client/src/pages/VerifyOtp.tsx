import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function VerifyOtp() {
  const [otpValue, setOtpValue] = useState("");
  const [isOtpError, setIsOtpError] = useState(false);
  const [otpErrorMessage, setOtpErrorMessage] = useState("");
  const navigate = useNavigate()

  const {verifyOtp} = useUserStore()

  const handleOtpSubmit = async () => {
    setIsOtpError(false);
    if (otpValue.length < 6) {
      setIsOtpError(true);
      setOtpErrorMessage("Enter 6 digit otp.");
      return;
    }
   const otp = otpValue.toUpperCase();
    await verifyOtp({otp, navigate})
  };


  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
      <div className="flex justify-center flex-col items-center">
        <h2 className="text-3xl font-semibold text-gray-300">Verify OTP</h2>
        <p className="text-red-500 text-sm font-semibold">
          {isOtpError && `${otpErrorMessage}`}
        </p>
      </div>
      <div>
        <InputOTP
          maxLength={6}
          value={otpValue}
          onChange={(val) => setOtpValue(val)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="uppercase" />
            <InputOTPSlot index={1} className="uppercase" />
            <InputOTPSlot index={2} className="uppercase" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="uppercase" />
            <InputOTPSlot index={4} className="uppercase" />
            <InputOTPSlot index={5} className="uppercase" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div>
        <Button onClick={handleOtpSubmit} size={"lg"}>
          Submit
        </Button>
      </div>
    </div>
  );
}
