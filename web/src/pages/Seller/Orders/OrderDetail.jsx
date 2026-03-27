import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusColors = {
  pending: "bg-gray-50 text-gray-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-yellow-50 text-yellow-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const OrderDetail = ({ order, onClose }) => {
  const total = order.orderItems.reduce(
    (sum, oi) => sum + (oi.product?.price ?? 0) * (oi.quantity ?? 1),
    0,
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-800">
            Order #
            {typeof order.id === "string"
              ? order.id.slice(-8).toUpperCase()
              : order.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase">
                Order Date
              </label>
              <p className="text-sm text-neutral-800 mt-1">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Invalid Date"}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase">
                Payment Status
              </label>
              <p className="text-sm mt-1">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    order.isPaid
                      ? "bg-green-50 text-green-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Pending"}
                </span>
              </p>
            </div>
          </div>

          <hr />

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3">
              Customer Information
            </h3>
            <div className="space-y-2 text-sm text-neutral-700">
              <p>
                <strong>Name:</strong> {order.user?.name ?? "Guest"}
              </p>
              <p>
                <strong>Email:</strong> {order.user?.email ?? "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {order.user?.phone ?? "N/A"}
              </p>
            </div>
          </div>

          <hr />

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3">
              Shipping Address
            </h3>
            <div className="space-y-1 text-sm text-neutral-700">
              <p>{order.recipientName || order.user?.name || "N/A"}</p>
              <p>{order.address || "N/A"}</p>
              {(order.city || order.province || order.zipCode) && (
                <p>
                  {order.city}
                  {order.city && order.province && ", "}
                  {order.province} {order.zipCode}
                </p>
              )}
              <p>Phone: {order.recipientPhone || order.phone || "N/A"}</p>
            </div>
          </div>

          <hr />

          {/* Rider Information */}
          {order.rider ? (
            <>
              <div>
                <h3 className="font-semibold text-neutral-800 mb-3">
                  Rider Information
                </h3>
                <div className="space-y-2 text-sm text-neutral-700">
                  <p>
                    <strong>Name:</strong> {order.rider.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.rider.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.rider.email}
                  </p>
                  <p>
                    <strong>Rating:</strong> {order.rider.rating}⭐
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Delivery Status:</strong>{" "}
                    {order.delivery_status?.charAt(0).toUpperCase() +
                      order.delivery_status?.slice(1) || "Pending"}
                  </p>
                </div>
              </div>

              <hr />
            </>
          ) : null}

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.orderItems.map((item) => {
                const firstImage = item.images?.[0]?.url;
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 border border-gray-100 rounded-lg p-3"
                  >
                    {/* Product Image */}
                    {firstImage ? (
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={firstImage}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                    {/* Product Details */}
                    <div className="flex-1">
                      <p className="font-medium text-neutral-800">
                        {item.product?.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Qty: {item.quantity}
                        {item.size?.name && ` • Size: ${item.size.name}`}
                      </p>
                    </div>
                    {/* Price */}
                    <p className="font-semibold text-neutral-800 text-right">
                      ₱
                      {(
                        (item.product?.price ?? 0) * item.quantity
                      ).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <hr />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Subtotal:</span>
              <span className="text-neutral-800">
                ₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </span>
            </div>
            {order.shippingFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping:</span>
                <span className="text-neutral-800">
                  ₱
                  {(order.shippingFee ?? 0).toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold border-t border-gray-100 pt-2 mt-2">
              <span>Total:</span>
              <span>
                ₱
                {(total + (order.shippingFee ?? 0)).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <hr />

          {/* Status History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <>
              <div>
                <h3 className="font-semibold text-neutral-800 mb-3">
                  Status History
                </h3>
                <div className="space-y-3">
                  {order.statusHistory.map((entry, idx) => (
                    <div key={idx} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-neutral-800">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              statusColors[entry.status] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {entry.status.charAt(0).toUpperCase() +
                              entry.status.slice(1)}
                          </span>
                        </p>
                        <p className="text-xs text-neutral-500">
                          {entry.timestamp
                            ? new Date(entry.timestamp).toLocaleDateString(
                                "en-PH",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : ""}
                        </p>
                      </div>
                      {entry.message && (
                        <p className="text-sm text-neutral-600 mt-1">
                          {entry.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <hr />
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              className="w-full bg-black text-white hover:bg-black/80"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
