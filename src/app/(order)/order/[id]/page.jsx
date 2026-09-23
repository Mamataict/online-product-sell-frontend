"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_IMAGE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/images/default.png`
  : "/images/default.png";

export default function OrderCompletedPage() {
  const [visible, setVisible] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [order_info, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { id } = useParams();
  const token = Cookies.get("auth_token");

  const fetchOrderDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/order/${id}/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setOrderInfo(res.data.data);
    } catch (err) {
      console.error("Order fetch error:", err?.response?.data || err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  useEffect(() => {
    setVisible(true);

    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2.5 + Math.random() * 2,
      color: ["#F04B4B", "#22C55E", "#F59E0B", "#3B82F6", "#EC4899", "#10B981", "#FBBF24"][
        Math.floor(Math.random() * 7)
      ],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));
    setConfettiPieces(pieces);
  }, []);

  const steps = [
    { label: "Order Placed", done: true, icon: "✓" },
    { label: "Processing", done: true, icon: "✓" },
    { label: "Shipped", done: false, icon: "📦" },
    { label: "Delivered", done: false, icon: "🏠" },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", fontFamily: "sans-serif" }}>
        অর্ডার তথ্য লোড হচ্ছে...
      </div>
    );
  }

  if (error || !order_info) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", color: "#ef4444", fontFamily: "sans-serif" }}>
        অর্ডার তথ্য লোড করতে সমস্যা হয়েছে। পেজ রিফ্রেশ করুন।
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green: #16a34a;
          --green-light: #dcfce7;
          --red: #F04B4B;
          --gold: #D97706;
          --gold-light: #FEF3C7;
          --bg: #FAFAF8;
          --card: #FFFFFF;
          --text: #1C1917;
          --muted: #78716C;
          --border: #E7E5E4;
          --shadow: 0 4px 24px rgba(0,0,0,0.08);
        }

        body {
          font-family: 'Hind Siliguri', sans-serif;
          background: var(--bg);
          min-height: 100vh;
          color: var(--text);
        }

        .confetti-wrap {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; z-index: 999; overflow: hidden;
        }

        .confetti-piece {
          position: absolute; top: -20px;
          animation: fall linear forwards;
          border-radius: 2px;
          opacity: 0.9;
        }

        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          80% { opacity: 0.9; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }

        .page {
          max-width: 680px; margin: 0 auto; padding: 40px 20px 80px;
          opacity: 0; transform: translateY(24px);
          transition: all 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .page.visible { opacity: 1; transform: none; }

        .hero {
          text-align: center; padding: 40px 20px 36px;
          background: linear-gradient(145deg, #f0fdf4 0%, #fff 60%);
          border-radius: 24px; border: 1px solid #bbf7d0;
          margin-bottom: 28px; position: relative; overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute; top: -40px; right: -40px;
          width: 180px; height: 180px;
          background: radial-gradient(circle, #bbf7d080, transparent 70%);
          pointer-events: none;
        }

        .checkmark-ring {
          width: 84px; height: 84px; border-radius: 50%;
          background: var(--green); margin: 0 auto 20px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 12px #dcfce7, 0 0 0 24px #bbf7d060;
          animation: pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
        }
        @keyframes pop {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .checkmark-ring svg { width: 38px; height: 38px; }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 30px; font-weight: 800; color: var(--green);
          line-height: 1.2; margin-bottom: 8px;
        }
        .hero-sub {
          font-size: 15px; color: var(--muted); margin-bottom: 20px;
          line-height: 1.6;
        }

        .order-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--gold-light); border: 1px solid #FDE68A;
          padding: 8px 18px; border-radius: 30px;
          font-size: 13px; font-weight: 600; color: var(--gold);
        }

        .card {
          background: var(--card); border-radius: 20px;
          border: 1px solid var(--border); box-shadow: var(--shadow);
          margin-bottom: 20px; overflow: hidden;
        }
        .card-header {
          padding: 18px 22px; border-bottom: 1px solid var(--border);
          font-weight: 700; font-size: 15px; display: flex;
          align-items: center; gap: 8px;
        }

        .item-row {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 22px; border-bottom: 1px solid var(--border);
        }
        .item-row:last-of-type { border-bottom: none; }
        .item-emoji {
          width: 48px; height: 48px; border-radius: 12px;
          background: #F5F5F4; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0; overflow: hidden;
        }
        .item-info { flex: 1; }
        .item-name { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
        .item-qty { font-size: 12px; color: var(--muted); }
        .item-price { font-weight: 700; font-size: 14px; color: var(--text); }

        .summary-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 22px; font-size: 14px;
        }
        .summary-row.label { color: var(--muted); }
        .summary-row.total {
          font-weight: 800; font-size: 16px;
          border-top: 2px dashed var(--border); margin-top: 4px;
          padding-top: 14px; color: var(--green);
        }
        .free-tag {
          background: var(--green-light); color: var(--green);
          font-size: 11px; font-weight: 700; padding: 2px 8px;
          border-radius: 10px;
        }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; }
        .info-cell {
          padding: 18px 22px; border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .info-cell:nth-child(even) { border-right: none; }
        .info-cell:nth-last-child(-n+2) { border-bottom: none; }
        .info-cell-label { font-size: 11px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
        .info-cell-value { font-size: 14px; font-weight: 600; line-height: 1.4; }

        .actions { display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 20px; }
        .btn {
          padding: 15px 20px; border-radius: 14px; border: none;
          font-family: 'Hind Siliguri', sans-serif;
          font-size: 14px; font-weight: 700; cursor: pointer;
          transition: all 0.2s; text-align: center;
          text-decoration: none; display: block;
        }
        .btn-primary {
          background: var(--red); color: white;
          box-shadow: 0 4px 14px rgba(240,75,75,0.3);
        }
        .btn-primary:hover { background: #d63f3f; transform: translateY(-2px); }

        .footer {
          text-align: center; font-size: 12px; color: var(--muted);
          padding-top: 20px; line-height: 2;
        }
        .footer a { color: var(--red); text-decoration: none; }

        @media (max-width: 480px) {
          .hero-title { font-size: 24px; }
          .info-grid { grid-template-columns: 1fr; }
          .info-cell { border-right: none; border-bottom: 1px solid var(--border); }
          .info-cell:last-child { border-bottom: none; }
        }
      `}</style>

      {/* Confetti */}
      <div className="confetti-wrap">
        {confettiPieces.map((p) => (
          <div
            key={p.id}
            className="confetti-piece"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size * 0.6,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>

      <div className={`page ${visible ? "visible" : ""}`}>

        {/* Hero */}
        <div className="hero">
          <div className="checkmark-ring">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="hero-title">অর্ডার সম্পন্ন হয়েছে! 🎉</div>
          <div className="hero-sub">
            আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।<br />
            আমরা শীঘ্রই প্রক্রিয়া শুরু করব।
          </div>
          <div className="order-badge">
            🧾 অর্ডার নং: <strong>{order_info.order_info_id}</strong>
          </div>
        </div>

        {/* Order Items */}
        <div className="card">
          <div className="card-header">🛒 অর্ডারের বিবরণ</div>
          {order_info?.orders?.map((item) => (
            <div key={item.id} className="item-row">
              <div className="item-emoji">
                <Image
                  src={item?.product?.image_url || DEFAULT_IMAGE}
                  alt={item?.product?.name || "Product"}
                  width={48}
                  height={48}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="item-info">
                <div className="item-name">{item?.product?.name}</div>
                <div className="item-qty">পরিমাণ: {Number(item?.qty)}</div>
              </div>
              <div className="item-price">
                {Number(item?.qty) * Number(item?.price)} ৳
              </div>
            </div>
          ))}
          <div className="summary-row label">
            <span>সাবটোটাল</span>
            <span>{order_info?.subtotal} ৳</span>
          </div>
          <div className="summary-row label">
            <span>ডেলিভারি চার্জ</span>
            <span className="free-tag">{order_info?.delivery_fee} ৳</span>
          </div>
          <div className="summary-row total">
            <span>মোট</span>
            <span>{order_info?.grand_total} ৳</span>
          </div>
          <div style={{ padding: "14px 22px" }}></div>
        </div>

        {/* Delivery Info */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">📋 ডেলিভারি তথ্য</div>
          <div className="info-grid">
            <div className="info-cell">
              <div className="info-cell-label">প্রাপক</div>
              <div className="info-cell-value">{order_info?.customer?.name}</div>
            </div>
            <div className="info-cell">
              <div className="info-cell-label">পেমেন্ট</div>
              <div className="info-cell-value">Cash on Delivery ✅</div>
            </div>
            <div className="info-cell">
              <div className="info-cell-label">ঠিকানা</div>
              <div className="info-cell-value">{order_info?.customer?.address}</div>
            </div>
            <div className="info-cell">
              <div className="info-cell-label">যোগাযোগ</div>
              <div className="info-cell-value">{order_info?.customer?.phone}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="actions">
          <Link href="/" className="btn btn-primary">
            🛍️ আরও কিনুন
          </Link>
        </div>

        {/* Footer */}
        <div className="footer">
          কোনো সমস্যায় <Link href="#">সাপোর্টে যোগাযোগ করুন</Link> অথবা ফোন করুন{" "}
          <Link href="tel:8801896025050">01896025050</Link>
          <br />
          Copyright © 2026, Designed & Developed by Mamata
        </div>
      </div>
    </>
  );
}