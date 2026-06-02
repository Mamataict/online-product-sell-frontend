"use client";

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import api from "@/lib/axios";
import Cookies from "js-cookie";
import Image from 'next/image';
import Link from "next/link";

export default function OrderCompletedPage() {
  const [visible, setVisible] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [count, setCount] = useState(0);
  const [order_info, setOrderInfo] = useState({});

  const { id } = useParams();

  const token = Cookies.get("auth_token");

  const fetchOrderDetails = async () => {
    const res = await api.get(`/api/order/${id}/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    setOrderInfo(res.data.data);
  
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

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

    let start = 0;
    const target = 347;
    const duration = 1500;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const timer = setTimeout(() => requestAnimationFrame(step), 400);
    return () => clearTimeout(timer);
  }, []);

  const orderItems = [
    { name: "Deshi Cotton Panjabi – White", qty: 1, price: "৳1,250", img: "👘" },
    { name: "Premium Hilsa Fish (1kg)", qty: 2, price: "৳2,400", img: "🐟" },
    { name: "Nakshi Kantha Cushion", qty: 1, price: "৳850", img: "🎨" },
  ];

  const steps = [
    { label: "Order Placed", done: true, icon: "✓" },
    { label: "Processing", done: true, icon: "✓" },
    { label: "Shipped", done: false, icon: "📦" },
    { label: "Delivered", done: false, icon: "🏠" },
  ];

  useEffect(() => {
    
  }, []);

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

        /* HEADER */
        .header {
          display: flex; align-items: center; justify-content: space-between;
          padding-bottom: 24px; border-bottom: 1px solid var(--border);
          margin-bottom: 36px;
        }
        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 24px; font-weight: 800; color: var(--red);
          letter-spacing: -0.5px;
        }
        .logo span { color: var(--gold); }
        .help-link {
          font-size: 13px; color: var(--muted); text-decoration: none;
          border: 1px solid var(--border); padding: 6px 14px; border-radius: 20px;
          transition: all 0.2s;
        }
        .help-link:hover { border-color: var(--red); color: var(--red); }

        /* SUCCESS HERO */
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

        /* TRACKER */
        .tracker {
          display: flex; align-items: flex-start; justify-content: center;
          gap: 0; margin-bottom: 28px; padding: 28px 20px;
          background: var(--card); border-radius: 20px;
          border: 1px solid var(--border); box-shadow: var(--shadow);
        }
        .track-step { display: flex; flex-direction: column; align-items: center; flex: 1; }
        .track-icon {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; position: relative; z-index: 1;
          transition: all 0.3s;
        }
        .track-icon.done { background: var(--green); color: white; }
        .track-icon.pending { background: #F5F5F4; color: var(--muted); font-size: 16px; }
        .track-label { font-size: 11px; color: var(--muted); margin-top: 8px; text-align: center; font-weight: 500; }
        .track-line {
          flex: 1; height: 2px; margin-top: 19px; align-self: flex-start;
          background: var(--border); position: relative; max-width: 60px;
        }
        .track-line.done { background: var(--green); }

        /* ORDER DETAILS */
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

        /* ITEMS */
        .item-row {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 22px; border-bottom: 1px solid var(--border);
        }
        .item-row:last-of-type { border-bottom: none; }
        .item-emoji {
          width: 48px; height: 48px; border-radius: 12px;
          background: #F5F5F4; display: flex; align-items: center;
          justify-content: center; font-size: 24px; flex-shrink: 0;
        }
        .item-info { flex: 1; }
        .item-name { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
        .item-qty { font-size: 12px; color: var(--muted); }
        .item-price { font-weight: 700; font-size: 14px; color: var(--text); }

        /* SUMMARY */
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

        /* INFO GRID */
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; }
        .info-cell {
          padding: 18px 22px; border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .info-cell:nth-child(even) { border-right: none; }
        .info-cell:nth-last-child(-n+2) { border-bottom: none; }
        .info-cell-label { font-size: 11px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
        .info-cell-value { font-size: 14px; font-weight: 600; line-height: 1.4; }

        /* POINTS */
        .points-banner {
          background: linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%);
          border-radius: 18px; padding: 22px 24px;
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 20px; color: white;
        }
        .points-icon { font-size: 36px; }
        .points-title { font-weight: 700; font-size: 16px; margin-bottom: 3px; }
        .points-sub { font-size: 13px; opacity: 0.75; }
        .points-count {
          margin-left: auto; text-align: right;
          font-family: 'Playfair Display', serif;
          font-size: 32px; font-weight: 800;
          line-height: 1;
        }
        .points-count span { font-size: 13px; opacity: 0.75; font-family: 'Hind Siliguri'; font-weight: 400; display: block; }

        /* ACTIONS */
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
        .btn-primary:hover { background: #d63f3f; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(240,75,75,0.4); }
        .btn-secondary {
          background: var(--card); color: var(--text);
          border: 1.5px solid var(--border);
        }
        .btn-secondary:hover { border-color: var(--text); transform: translateY(-2px); }

        .btn-full { grid-column: 1/-1; background: #f5f5f4; color: var(--muted); font-size: 13px; }
        .btn-full:hover { background: #e5e5e4; color: var(--text); }

        /* FOOTER */
        .footer {
          text-align: center; font-size: 12px; color: var(--muted);
          padding-top: 20px; line-height: 2;
        }
        .footer a { color: var(--red); text-decoration: none; }

        /* RESPONSIVE */
        @media (max-width: 480px) {
          .hero-title { font-size: 24px; }
          .info-grid { grid-template-columns: 1fr; }
          .info-cell { border-right: none; border-bottom: 1px solid var(--border); }
          .info-cell:last-child { border-bottom: none; }
          .tracker { padding: 20px 8px; }
          .track-label { font-size: 10px; }
          .points-count { font-size: 26px; }
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
        {/* Header */}
        {/* <div className="header">
          <div className="logo">বাজার<span>Express</span></div>
          <a href="#" className="help-link">সাহায্য দরকার?</a>
        </div> */}

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

        {/* Tracker */}
        {/* <div className="tracker">
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", flex: 1 }}>
              <div className="track-step">
                <div className={`track-icon ${step.done ? "done" : "pending"}`}>
                  {step.icon}
                </div>
                <div className="track-label">{step.label}</div>
              </div>
              {i < steps.length - 1 && (
                <div className={`track-line ${step.done ? "done" : ""}`} />
              )}
            </div>
          ))}
        </div> */}

        {/* Order Items */}
        <div className="card">
          <div className="card-header">🛒 অর্ডারের বিবরণ</div>
          {order_info?.orders?.map((item, i) => (
            <div key={i} className="item-row">
              <div className="item-emoji">
                <Image src={item?.product?.image_url} alt={item?.product?.name} width={32} height={32} />
              </div>
              <div className="item-info">
                <div className="item-name">{item?.product?.name}</div>
                <div className="item-qty">পরিমাণ: {Number(item?.qty)}</div>
              </div>
              <div className="item-price">{Number(item?.qty) * Number(item?.price)}</div>
            </div>
          ))}
          <div className="summary-row label"><span>সাবটোটাল</span><span>{order_info?.subtotal}</span></div>
          <div className="summary-row label"><span>ডেলিভারি চার্জ</span><span className="free-tag">{order_info?.delivery_fee}</span></div>
          
          <div className="summary-row total"><span>মোট</span><span>{order_info?.grand_total}</span></div>
          <div style={{ padding: "14px 22px" }}></div>
        </div>

        {/* Delivery & Payment Info */}
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

        {/* Loyalty Points */}
        {/* <div className="points-banner">
          <div className="points-icon">⭐</div>
          <div>
            <div className="points-title">পয়েন্ট অর্জিত হয়েছে!</div>
            <div className="points-sub">আপনার পরবর্তী কেনাকাটায় ব্যবহার করুন</div>
          </div>
          <div className="points-count">
            +43
            <span>পয়েন্ট</span>
          </div>
        </div> */}

        {/* Actions */}
        <div className="actions">
          {/* <a href="#" className="btn btn-primary">🛍️ আরও কিনুন</a> */}
          <Link href={`/`} className="btn btn-primary">
            🛍️ আরও কিনুন
          </Link>
          {/* <a href="#" className="btn btn-secondary">📦 অর্ডার ট্র্যাক করুন</a>
          <a href="#" className="btn btn-full">🖨️ রসিদ ডাউনলোড করুন</a> */}
        </div>

        {/* Footer */}
        <div className="footer">
          কোনো সমস্যায় <Link href="#">সাপোর্টে যোগাযোগ করুন</Link> অথবা ফোন করুন <Link href="tel:8801896025050">01896025050</Link><br />
          © ২০২৬ Dairy Fresh · Made with ❤️ in Bangladesh
        </div>
      </div>
    </>
  );
}
