// pages/auth/callback/google.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const exchangeCode = async () => {
      const code = router.query.code as string;
      if (!code) return;

      try {
        const res = await fetch("/api/auth/social/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (res.ok) {
          // Save JWT for session
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/"); // redirect to homepage
        } else {
          console.error("Login failed:", data.message);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    if (router.isReady) exchangeCode();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p>Authenticating with Google...</p>
    </div>
  );
}