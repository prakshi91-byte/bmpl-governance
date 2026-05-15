import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({ component: DisabledSignupPage });

function DisabledSignupPage() {
  return <Navigate to="/" />;
}
