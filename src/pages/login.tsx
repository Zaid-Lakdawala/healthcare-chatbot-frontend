import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "@/store/user/api.ts";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loginMutation] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        await loginMutation(values).unwrap();
        navigate("/", { replace: true });
        // navigation handled by auth effect when auth becomes truthy
      } finally {
        setSubmitting(false);
      }
    },
  });

  const emailError =
    formik.touched.email && formik.errors.email
      ? formik.errors.email
      : undefined;
  const passwordError =
    formik.touched.password && formik.errors.password
      ? formik.errors.password
      : undefined;

  return (
    <Card>
      <CardHeader className="text-center">
        <div>
          <CardTitle className="text-3xl pb-1">Welcome back</CardTitle>
          <CardDescription className="">
            Sign in to your AI dashboard
          </CardDescription>
        </div>
      </CardHeader>
      <form onSubmit={formik.handleSubmit} noValidate>
        <CardContent className="">
          <div className="pb-5">
            <Label className="pb-2">Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...formik.getFieldProps("email")}
              className={emailError ? "border-red-500" : ""}
            />
            {emailError && (
              <p className="text-xs text-red-600 mt-1">{emailError}</p>
            )}
          </div>
          <div>
            <Label className="pb-2">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("password")}
                className={passwordError ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs text-red-600 mt-1">{passwordError}</p>
            )}
          </div>
          <div className="text-xs text-gray-500 text-center pt-6">
            By continuing, you agree to our{" "}
            <a className="underline hover:no-underline text-black" href="#">
              Terms
            </a>{" "}
            and{" "}
            <a className=" underline hover:no-underline text-black" href="#">
              Privacy
            </a>
            .
          </div>
        </CardContent>
        <CardFooter className="pt-6 flex flex-col">
          <Button type="submit" className="w-full">
            <div className="relative z-10 flex items-center justify-center gap-2">
              {submitting ? <>Please wait...</> : <>Sign in</>}
            </div>
          </Button>

          <div className="text-xs text-center pt-2 text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="underline hover:no-underline text-black"
            >
              Register
            </Link>
            {"  "}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;
