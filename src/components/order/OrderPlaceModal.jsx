export default function OrderPlaceModal({ handlePrint, order }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-[90%] lg:w-[400px] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}

        <div>
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Order Placed Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                    Your order has been placed successfully. You can now print the receipt or close this dialog.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => handlePrint(order?.id)}
                        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
                    >
                        Print Receipt
                    </button>
                </div>
            </div>
        </div>

        

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
