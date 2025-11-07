import { Route, Navigate } from "react-router";

import { AuthLayout } from "../components/layouts/AuthLayout";
import { SignIn } from "../pages/Auth/SignIn";
import { SignUp } from "../pages/Auth/SignUp";

export function AuthRoutes() {
  return (
    <Route path="/" element={<AuthLayout />}>
      <Route index element={<Navigate to="signin" replace />} />
      <Route path="signin" element={<SignIn />}></Route>
      <Route path="signup" element={<SignUp />}></Route>
    </Route>
  );
}
