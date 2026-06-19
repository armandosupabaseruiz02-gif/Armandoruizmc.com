"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const STATUS_OPTIONS = [
  { value: "new", label: "Nueva" },
  { value: "in_review", label: "En revisión" },
  { value: "contacted", label: "Contactada" },
  { value: "closed", label: "Cerrada" },
] as const;

export default function RequestStatusSelect({
  requestId,
  currentStatus,
}: {
  requestId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function updateStatus(nextStatus: string) {
    const previousStatus = status;
    setStatus(nextStatus);
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("contact_requests")
      .update({ status: nextStatus })
      .eq("id", requestId);

    if (updateError) {
      setStatus(previousStatus);
      setError("No se pudo actualizar el estado.");
    } else {
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={`status-${requestId}`} className="text-[11px] font-black text-gray-400 uppercase tracking-wide">
        Estado
      </label>
      <select
        id={`status-${requestId}`}
        value={status}
        disabled={loading}
        onChange={(event) => updateStatus(event.target.value)}
        className="min-h-[40px] rounded-xl border-2 border-naranja-100 bg-white px-3 text-[13px] font-bold text-gray-800 outline-none focus:border-naranja-400 disabled:opacity-60"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[12px] font-semibold text-red-700">{error}</p>}
    </div>
  );
}
