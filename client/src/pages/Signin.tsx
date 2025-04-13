import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import Cookies from "js-cookie";
import { BACKEND_URI } from "@/utils/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormFields {
  email: string;
  password: string;
}

export default function Signin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const navigate = useNavigate();

  const onsubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const res = await fetch(`${BACKEND_URI}/api/v1/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
        credentials: "include",
      });

      const response = await res.json();
      if (response.success) {
        navigate(`/dashboard/${response.username}`);
        Cookies.set("canvas_cloud_auth", response.token, {
          // secure: true,
          // domain: "excalidraw-cloud.vercel.app",
          // expires: 5 * 60 * 1000,
          // sameSite: "Lax",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onsubmit)}
      className="px-4 flex items-center min-h-[90vh] flex-col justify-center space-y-4 mx-auto max-w-sm"
    >
      <div>
        <h2 className="text-2xl font-bold">Signup</h2>
      </div>

      <div className="w-full">
        <label htmlFor="Email">Email</label>
        <Input
          {...register("email", {
            required: { value: true, message: "Email is required." },
          })}
          type="email"
          placeholder="Email"
        />
        {errors.email && <p>{errors.email.message}</p>}

        <label htmlFor="Password">Password</label>
        <Input
          {...register("password", {
            required: { value: true, message: "Password is required" },
            minLength: {
              value: 6,
              message: "Password should be minimun 6 char long.",
            },
          })}
          type="password"
          placeholder="Password"
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <div className="w-full">
        <Button className="w-full">Submit</Button>
      </div>

      <div>
        <Link
          to={"/signup"}
          className="text-blue-600 underline underline-offset-2"
        >
          Create account
        </Link>
      </div>
    </form>
  );
}
