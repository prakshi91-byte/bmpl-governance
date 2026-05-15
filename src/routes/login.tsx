import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({ component: DisabledLoginPage });

function DisabledLoginPage() {
  return <Navigate to="/" />;
}
