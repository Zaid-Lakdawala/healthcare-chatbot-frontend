import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import { useRegisterMutation } from "@/store/user/api";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [registerMutation, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),
      dateOfBirth: Yup.date()
        .max(new Date(), "Enter a valid date of birth")
        .required("Date of birth is required"),
      gender: Yup.string()
        .oneOf(["male", "female"], "Please select a gender")
        .required("Gender is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must contain at least one special character"
        )
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const registerData = {
          name: values.fullName,
          email: values.email,
          dob: values.dateOfBirth,
          gender: values.gender,
          password: values.password,
        };
        await registerMutation(registerData).unwrap();

        navigate("/login", { replace: true });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fullNameError =
    formik.touched.fullName && formik.errors.fullName
      ? formik.errors.fullName
      : undefined;
  const emailError =
    formik.touched.email && formik.errors.email
      ? formik.errors.email
      : undefined;
  const dateOfBirthError =
    formik.touched.dateOfBirth && formik.errors.dateOfBirth
      ? formik.errors.dateOfBirth
      : undefined;
  const genderError =
    formik.touched.gender && formik.errors.gender
      ? formik.errors.gender
      : undefined;
  const passwordError =
    formik.touched.password && formik.errors.password
      ? formik.errors.password
      : undefined;
  const confirmPasswordError =
    formik.touched.confirmPassword && formik.errors.confirmPassword
      ? formik.errors.confirmPassword
      : undefined;

  return (
    <Card>
      <CardHeader className="text-center">
        <div>
          <CardTitle className="text-3xl pb-1">Create Account</CardTitle>
          <CardDescription className="">
            Get started with AI healthcare
          </CardDescription>
        </div>
      </CardHeader>
      <form onSubmit={formik.handleSubmit} noValidate>
        <CardContent className="">
          <div className="pb-5">
            <Label className="pb-2">Full Name</Label>
            <Input
              type="text"
              {...formik.getFieldProps("fullName")}
              className={fullNameError ? "border-red-500" : ""}
            />
            {fullNameError && (
              <p className="text-xs text-red-600 mt-1">{fullNameError}</p>
            )}
          </div>
          <div className="pb-5">
            <Label className="pb-2">Email Address</Label>
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
          <div className="pb-5">
            <Label className="pb-2">Date of Birth</Label>
            <Input
              type="date"
              {...formik.getFieldProps("dateOfBirth")}
              className={dateOfBirthError ? "border-red-500" : ""}
            />
            {dateOfBirthError && (
              <p className="text-xs text-red-600 mt-1">{dateOfBirthError}</p>
            )}
          </div>
          <div className="pb-5">
            <Label className="pb-2">Gender</Label>
            <Select
              onValueChange={(value) => formik.setFieldValue("gender", value)}
              value={formik.values.gender}
            >
              <SelectTrigger
                className={genderError ? "w-full border-red-500" : "w-full"}
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            {genderError && (
              <p className="text-xs text-red-600 mt-1">{genderError}</p>
            )}
          </div>
          <div className="pb-5">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
          <div className="text-xs space-y-1 text-gray-500 pb-5 text-left">
            <p>Password must contain:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>At least 8 characters</li>
              <li>One lowercase letter</li>
              <li>One uppercase letter</li>
              <li>One number</li>
              <li>One special character</li>
            </ul>
          </div>
          <div>
            <Label className="pb-2">Confirm Password</Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                {...formik.getFieldProps("confirmPassword")}
                className={confirmPasswordError ? "border-red-500 pr-10" : ""}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 text-gray-500 hover:text-gray-700 -translate-y-1/2"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-xs text-red-600 mt-1">
                {confirmPasswordError}
              </p>
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
              {submitting ? <>Creating Account...</> : <>Create Account</>}
            </div>
          </Button>

          <div className="text-xs text-center pt-2 text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="underline hover:no-underline text-black"
            >
              Sign in
            </Link>
            {"  "}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Register;
