import { useContext, useState } from 'react';
import { OrdersContext } from './orderContext';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/loader/Loader';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig'; // Make sure this path is correct
import { toast } from 'react-toastify'; // Optional for better notifications

function Order() {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const userid = user?.user?.uid;

  const { mode, loading, orders, refreshOrders } = useContext(OrdersContext);

  // Convert object to array safely and filter for current user's orders
  const userOrders = orders && typeof orders === 'object'
    ? Object.values(orders).filter(order => order.userid === userid)
    : [];

  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancelOrder = async (orderId) => {
    if (isCancelling) return; // Prevent multiple clicks

    setIsCancelling(true);
    setCancellingId(orderId);

    try {
      const orderRef = doc(fireDB, "orders", orderId);
      await updateDoc(orderRef, {
        orderStatus: "Cancelled",
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Refresh orders after successful cancellation
      if (refreshOrders) {
        await refreshOrders();
      }

      toast.success("Order cancelled successfully!");
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setIsCancelling(false);
      setCancellingId(null);
    }
  };

  return (
    <Layout>
      {loading && <Loader />}

      {!loading && userOrders.length > 0 ? (
        <div className="h-full pt-10 space-y-6">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className={`rounded-lg p-6 shadow-md flex flex-col sm:flex-row gap-4 items-start ${mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
                }`}
            >
              {/* Date Section */}
              <div className={`px-4 py-2 rounded-lg ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                <p className="font-medium text-sm">
                  {order.date}
                </p>
              </div>

              {/* Order Details Section */}
              <div className="flex-1 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Customer Info */}
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold">{order.addressInfo?.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {order.email}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Shipping Address</p>
                    <p className="text-sm">{order.addressInfo?.address}</p>
                    <p className="text-sm">
                      {order.addressInfo?.city}, {order.addressInfo?.state} - {order.addressInfo?.pincode}
                    </p>
                  </div>

                  {/* Payment */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Order Total</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      Rs. {order.totalpay?.toLocaleString()}
                    </p>
                  </div>

                  {/* Status and Actions */}
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Status</p>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${order.orderStatus === 'Delivered'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : order.orderStatus === 'Cancelled'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                        {order.orderStatus}
                      </div>
                    </div>

                    {/* Cancel Button - Only show if order can be cancelled */}
                    {order.orderStatus !== 'Delivered' &&
                      order.orderStatus !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={isCancelling && cancellingId === order.id}
                          className={`mt-2 px-3 py-1 text-sm rounded transition-colors ${isCancelling && cancellingId === order.id
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                            }`}
                        >
                          {isCancelling && cancellingId === order.id
                            ? 'Cancelling...'
                            : 'Cancel Order'}
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <h2 className="text-center text-2xl text-gray-600 dark:text-white mt-10">
            No Orders Found
          </h2>
        )
      )}
    </Layout>
  );
}

export default Order;