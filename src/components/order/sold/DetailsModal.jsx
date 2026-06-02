export default function DetailsModal({ setIsModalOpen, order }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-[95%] lg:w-4/5 xl:w-3/4 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-5 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Invoice #{order?.order_info?.invoice}
            </h2>
            <p className="text-sm text-gray-500">
              Booking Date: {order?.order_info?.place_date?.toString()}
            </p>
          
          </div>
          <span
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold
              ${
                order?.order_info?.payment_status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {order?.order_info?.payment_status}
          </span>
        </div>

        {/* Order Items */}
        <section className="px-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Order Items
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-center">SKU</th>
                  <th className="p-3 text-center">Unit</th>
                  <th className="p-3 text-center">Price</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-center">Discount</th>
                </tr>
              </thead>
              <tbody>
                {order?.orders?.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">
                      {item.product_price.product.name}
                    </td>
                    <td className="p-3 text-center text-gray-600">
                      {item.product_price.product.sku}
                    </td>
                    <td className="p-3 text-center">
                      {item.product_price.product.unit}
                    </td>
                    <td className="p-3 text-center">
                      ৳ {Number(item.product_price.price)}
                    </td>
                    <td className="p-3 text-center">{Number(item.qty)}</td>
                    <td className="p-3 text-center">
                      {item.product_price.discount_type === "percentage"
                        ? `${Number(item.product_price.discount)}%`
                        : `${Number(item.product_price.discount)} ৳`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Info Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-6">
          {[
            ...(order?.campaign
              ? [
                  {
                    title: "Campaign",
                    data: [
                      ["Name", order.campaign.campaign?.name ?? "-"],
                      [
                        "Discount",
                        `${Number(order.campaign.discount)}${
                          order.campaign.discount_type === "percentage"
                            ? "%"
                            : " ৳"
                        }`,
                      ],
                    ],
                  },
                ]
              : []),

            {
              title: "Branch",
              data: [
                ["Name", order?.branch?.name],
                ["Code", order?.branch?.branch_code],
                ["Address", order?.branch?.address],
              ],
            },
            {
              title: "Customer",
              data: [
                ["Name", order?.customer?.name],
                ["Phone", order?.customer?.phone],
                ["Email", order?.customer?.email],
                ["Address", order?.customer?.address],
              ],
            },
            {
              title: "Sales Person",
              data: [
                ["Name", order?.seller?.name],
                ["User ID", order?.seller?.username],
                ["Email", order?.seller?.email],
              ],
            },
          ].map((section, idx) => (
            <div key={idx} className="border rounded-xl p-4 bg-slate-50">
              <h4 className="font-semibold text-gray-800 mb-2">
                {section.title}
              </h4>
              <div className="space-y-1 text-sm text-gray-700">
                {section.data.map(([label, value], i) => (
                  <p key={i}>
                    <span className="font-medium text-gray-600">{label}:</span>{" "}
                    {value || "-"}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
