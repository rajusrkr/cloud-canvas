import { Button, Card, CardBody, CardHeader, Form, Input } from "@heroui/react";
import { LogIn, ShieldEllipsis } from "lucide-react";
import { useState } from "react";
import { useUserStore } from "../store/useUserStore";
import CustomLoader from "./custom-loader";
import { useNavigate } from "react-router";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const {
    isLoading,
    errorMessage,
    isError,
    signin,
    isCredentialsCorrect,
    verifyOtp,
  } = useUserStore();

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signin({ email: email, password: password });
  };
  const handleOtpVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await verifyOtp({ otp, navigate });
    setPassword("")
    setOtp("")
  };

  return (
    <div>
      {/* If isCredential true */}
      {isCredentialsCorrect ? (
        // Otp verify form
        <Card className="max-w-xl w-96">
          <CardHeader>
            <div>
              <h2 className="text-2xl font-semibold">Verify Otp</h2>
              <p className="text-default-500 text-sm">Otp sent to your email</p>
            </div>
          </CardHeader>
          <CardBody>
            <Form
              onSubmit={handleOtpVerify}
              className="flex justify-center items-center"
            >
              <Input
                type="text"
                placeholder="Enter OTP"
                label="OTP"
                labelPlacement="outside"
                isRequired
                value={otp}
                variant="faded"
                onChange={(e) => setOtp(e.target.value.toUpperCase())}
              />

              {/* Show error message */}
              <p className="text-danger-500 text-xs font-semibold">
                {isError && (<>Error: {errorMessage}</>)}
              </p>

              <Button
                type="submit"
                color="primary"
                isDisabled={isLoading}
                className="w-full font-semibold"
                variant="solid"
              >
                {isLoading ? (
                  <CustomLoader height={1.5} width={1.5} />
                ) : (
                  <span className="flex items-center gap-1">
                    Submit otp <ShieldEllipsis size={16} />
                  </span>
                )}
              </Button>
            </Form>
          </CardBody>
        </Card>
      ) : (
        // Signin form
        <Card className="max-w-xl w-96">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Signin</h2>
          </CardHeader>
          <CardBody>
            <Form
              onSubmit={handleSignin}
              className="flex justify-center items-center"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                label="Email"
                labelPlacement="outside"
                isRequired
                value={email}
                variant="faded"
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                type="password"
                placeholder="Enter your password"
                label="Password"
                labelPlacement="outside"
                isRequired
                value={password}
                variant="faded"
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Show error message */}
              <p className="text-danger-500 text-xs font-semibold">
                {isError && errorMessage}
              </p>

              <Button
                type="submit"
                color="primary"
                isDisabled={isLoading}
                className="w-full font-semibold"
                variant="solid"
              >
                {isLoading ? (
                  <CustomLoader height={1.5} width={1.5} />
                ) : (
                  <span className="flex items-center gap-1">
                    Signin <LogIn size={16} />
                  </span>
                )}
              </Button>
            </Form>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
