import AdminLoginForm from "@/components/AdminLoginForm";
import PageFrame from "@/components/PageFrame";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <PageFrame>
      <section className="flex min-h-[calc(100svh-4rem)] items-center px-4 pb-16 pt-28 sm:px-6">
        <Suspense fallback={null}>
          <AdminLoginForm />
        </Suspense>
      </section>
    </PageFrame>
  );
}
