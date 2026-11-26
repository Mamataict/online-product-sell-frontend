import OrderCompleted from "@/components/front/OrderCompleted";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

async function getOrder(id, cus) {
  try {
    const url = new URL(`${API_URL}/api/order/${id}/info`);
    if (cus) url.searchParams.set("cus", cus);

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const { cus } = await searchParams;

  const order = await getOrder(id, cus);
  return <OrderCompleted order_info={order} />;
}