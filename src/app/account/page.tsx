"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

const tabs = [
  { id: "prescriptions", label: "My Prescription Request", icon: "🧾" },
  { id: "bookings", label: "My Bookings", icon: "🗓️" },
  { id: "address", label: "My Address", icon: "📍" },
  { id: "reports", label: "My Reports", icon: "📁" },
  { id: "membership", label: "My Membership Cards", icon: "💳" },
  { id: "profile", label: "My Profile", icon: "👤" },
  { id: "notifications", label: "My Notification", icon: "🔔" },
  { id: "family", label: "My Family Members", icon: "👥" },
];

export default function AccountPage() {
  const sp = useSearchParams();
  const active = sp.get("tab") || "prescriptions";
  const current = useMemo(() => tabs.find((t) => t.id === active)?.id || "prescriptions", [active]);

  // Basic data states per tab
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        let url = "";
        switch (current) {
          case "prescriptions":
            url = "/prescriptions/list";
            break;
          case "bookings":
            url = "/bookings";
            break;
          case "reports":
            url = "/reports";
            break;
          case "address":
            url = "/addresses";
            break;
          case "membership":
            url = "/memberships";
            break;
          case "family":
            url = "/family";
            break;
          case "notifications":
            url = "/notifications";
            break;
          case "profile":
            url = "/me";
            break;
        }
        if (!url) {
          setData(null);
        } else {
          const json = await apiFetch<any>(url);
          setData(json);
        }
      } catch (e: any) {
        setError(e.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [current]);

  return (
    <main className="min-h-[calc(100dvh-64px)] bg-emerald-50/30">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="rounded-xl bg-white border border-emerald-100 p-3">
          <div className="mb-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">👤</div>
              <div>
                <div className="text-emerald-800 font-semibold truncate">My Account</div>
                <div className="text-xs text-emerald-700/80">Welcome</div>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {tabs.map((t) => (
              <Link
                key={t.id}
                href={`/account?tab=${t.id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${
                  current === t.id
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-800 hover:bg-emerald-50 border-emerald-200"
                }`}
              >
                <span className="shrink-0">{t.icon}</span>
                <span className="truncate">{t.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <section className="rounded-xl bg-white border border-gray-200 p-5 min-h-[60vh]">
          <h1 className="text-xl font-semibold mb-4">
            {tabs.find((t) => t.id === current)?.label || "Dashboard"}
          </h1>

          {loading && <div className="text-gray-600">Loading...</div>}
          {error && <div className="text-red-600">{error}</div>}

          {!loading && !error && current === "prescriptions" && (
            Array.isArray(data) && data.length > 0 ? (
              <ul className="divide-y">
                {data.map((it: any, idx: number) => (
                  <li key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{it.name || it.email || "Unknown"}</div>
                      <div className="text-sm text-gray-600">{it.filename || it.id}</div>
                    </div>
                    <div className="text-sm text-gray-500">{it.storedAt ? new Date(it.storedAt).toLocaleString() : ""}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-700">No prescription requests yet.</div>
            )
          )}

          {!loading && !error && current === "bookings" && (
            Array.isArray(data) && data.length > 0 ? (
              <ul className="divide-y">
                {data.map((b: any) => (
                  <li key={b.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{b.package || b.title}</div>
                      <div className="text-sm text-gray-600">{b.date} {b.time}</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">{b.status || "Booked"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-700">No bookings found.</div>
            )
          )}

          {!loading && !error && current === "reports" && (
            Array.isArray(data) && data.length > 0 ? (
              <ul className="divide-y">
                {data.map((r: any) => (
                  <li key={r.id || r.filename} className="py-3 flex items-center justify-between">
                    <div className="font-medium text-gray-900">{r.test || r.title || r.filename}</div>
                    {r.url && <a className="text-emerald-700 hover:underline" href={r.url} target="_blank">Download</a>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-700">No reports available.</div>
            )
          )}

          {!loading && !error && current === "address" && (
            Array.isArray(data) && data.length > 0 ? (
              <ul className="grid gap-3">
                {data.map((a: any) => (
                  <li key={a.id} className="p-3 rounded-lg border border-gray-200">
                    <div className="font-medium text-gray-900">{a.label || "Address"}</div>
                    <div className="text-sm text-gray-700">{a.line1}{a.line2 ? ", " + a.line2 : ""}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-700">No addresses saved.</div>
            )
          )}

          {!loading && !error && current === "membership" && (
            Array.isArray(data) && data.length > 0 ? (
              <ul className="grid gap-3">
                {data.map((m: any) => (
                  <li key={m.id} className="p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{m.plan || m.name}</div>
                      <div className="text-sm text-gray-600">Valid till {m.expires}</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">{m.status || "Active"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-700">No membership cards.</div>
            )
          )}

          {!loading && !error && current === "family" && (
            Array.isArray(data) && data.length > 0 ? (
              <ul className="divide-y">
                {data.map((f: any) => (
                  <li key={f.id} className="py-3 flex items-center justify-between">
                    <div className="font-medium text-gray-900">{f.name}</div>
                    <div className="text-sm text-gray-600">{f.relation}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-700">No family members added.</div>
            )
          )}

          {!loading && !error && current === "profile" && (
            data ? (
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="font-medium text-gray-900">{data.name || data.email || "User"}</div>
                </div>
                <div className="p-3 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium text-gray-900">{data.email || "-"}</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-700">Profile info not available.</div>
            )
          )}

          {!loading && !error && current === "notifications" && (
            Array.isArray(data) && data.length > 0 ? (
              <ul className="divide-y">
                {data.map((n: any) => (
                  <li key={n.id} className="py-3">
                    <div className="font-medium text-gray-900">{n.title}</div>
                    <div className="text-sm text-gray-600">{n.message}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-700">No notifications.</div>
            )
          )}
        </section>
      </div>
    </main>
  );
}
