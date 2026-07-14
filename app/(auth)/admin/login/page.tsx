import { redirect } from "next/navigation";

/**
 * /admin/login now redirects to the unified /login page.
 * The intelligent authentication flow at /login handles both
 * admin (email) and student (admission number) accounts automatically.
 */
export default function AdminLoginRedirect() {
  redirect("/login");
}
