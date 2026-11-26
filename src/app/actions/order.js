"use server";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function confirmOrder(payload) {
  try {
    const res = await fetch(`${API_URL}/api/order/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || json?.status === false) {
      return {
        ok: false,
        message: json?.message || "Something went wrong. Please try again.",
      };
    }

    if (!json?.route) {
      return { ok: false, message: "Something went wrong. Please try again." };
    }

    return { ok: true, route: json.route };
  } catch {
    return {
      ok: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}