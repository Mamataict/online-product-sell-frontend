"use client";
import React, { useRef } from "react";

export default function Receipt({ order }) {
  const printRef = useRef();

  const handlePrint = () => {
    if (!printRef.current) return;

    const content = printRef.current.innerHTML;
    const printWindow = window.open("", "Print", "width=300,height=800");

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body {
              font-family: "Courier New", monospace;
              padding: 10px;
            }

            .center { text-align: center; }
            .bold { font-weight: bold; }

            .info {
              font-size: 14px;
              margin-bottom: 4px;
            }

            hr {
              border: none;
              border-top: 1px dashed #000;
              margin: 8px 0;
            }

            table {
              width: 100%;
              font-size: 14px;
              border-collapse: collapse;
            }

            th {
              text-align: left;
              font-size: 14px;
              border-bottom: 1px solid #000;
              padding-bottom: 4px;
            }

            td {
              padding: 4px 0;
            }

            .right { text-align: right; }

            .totals {
              text-align: right;
              font-size: 14px;
              margin-top: 3px;
            }

            .grand-total {
              text-align: right;
              font-size: 16px;
              font-weight: bold;
              margin-top: 10px;
            }
          </style>
        </head>

        <body>${content}</body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      const imgs = printWindow.document.images;
      if (imgs.length === 0) {
        printWindow.print();
        return;
      }

      let loaded = 0;
      for (let img of imgs) {
        img.onload = img.onerror = () => {
          loaded++;
          if (loaded === imgs.length) {
            printWindow.print();
          }
        };
      }
    };
  };

  return (
    <div>
      <div ref={printRef}>
        {/* LOGO */}
        <p className="info">Print Date: {new Date().toLocaleDateString()}</p>
        <div className="center">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/images_cus/icons/dairy_fresh_logo.png`}
            alt="Dairy Fresh"
            width="70"
            height="70"
          />
        </div>

        <div
          className="center bold"
          style={{ fontSize: "18px", marginTop: "5px" }}
        >
          Dairy Fresh
        </div>

        <div
          className="center bold"
          style={{ fontSize: "18px", marginTop: "5px" }}
        >
          Branch: {order.branch.name}
        </div>

        <p className="info bold">Invoice: {order.invoice}</p>
        <p className="info">
          INV. Date:{" "}
          {order.place_date
            ? new Date(order.place_date).toLocaleDateString()
            : ""}
        </p>

        <hr />

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th className="right">Total</th>
            </tr>
          </thead>

          <tbody>
            {order.orders.map((item) => (
              <tr key={item.id}>
                <td>{item?.product_price?.product?.name}</td>
                <td>
                  {Number(item.qty)} × {Number(item.price / item.qty)}{" "}
                </td>
                <td className="right">{Number(item.price)} BDT</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />

        {order.campaign && (
          <>
            <p className="totals">
              Sub Total: {Number(order.payable_price)} BDT
            </p>

            <p className="totals">
              Discount:{" "}
              {order.campaign.discount_type === "percentage"
                ? `${Number(order.campaign.discount)}%`
                : `${Number(order.campaign.discount)} BDT`}
            </p>
          </>
        )}

        <p className="grand-total">
          Grand Total: {Number(order.grand_total)} BDT
        </p>

        <hr />

        <div className="center" style={{ fontSize: "13px" }}>
          Thank you for shopping!
        </div>
      </div>

      <button
        className="cursor-pointer text-blue-600 underline mt-3"
        onClick={handlePrint}
      >
        Print Receipt
      </button>
    </div>
  );
}
