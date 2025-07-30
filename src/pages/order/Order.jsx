import { useContext } from 'react';
import { OrdersContext } from './orderContext';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/loader/Loader';

function Order() {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const userid = user?.user?.uid;

  const { mode, loading, orders } = useContext(OrdersContext);

  // ✅ Convert object to array safely
  const orderArray = orders && typeof orders === 'object'
    ? Object.values(orders)
    : [];

  // ✅ Filter for current user's orders
  const userOrders = orderArray.filter((order) => order.userid === userid);

  return (
    <Layout>
      {loading && <Loader />}

      {!loading && userOrders.length > 0 ? (
        <div className="h-full pt-10 space-y-6">
          {userOrders.map((order, orderIndex) => (
            <div key={order.id || orderIndex} className="mx-auto max-w-5xl px-6 xl:px-0 space-y-4">
              {order.cartItems.map((item, itemIndex) => (
                <div
                  key={item.id || itemIndex}
                  className={`rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start ${mode === 'dark' ? 'bg-gray-800 text-white' : ''
                    }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full rounded-lg sm:w-40"
                  />
                  <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div className="mt-5 sm:mt-0">
                      <h2 className="text-lg font-bold">{item.title}</h2>
                      <p className="mt-1 text-xs">{item.description}</p>
                      <p className="mt-1 text-xs">Rs. {item.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <h2 className="text-center text-2xl text-gray-600 dark:text-white mt-10">
            No Orders Yet
          </h2>
        )
      )}
    </Layout>
  );
}

export default Order;




// import { useContext } from 'react'
// import { OrdersContext } from './orderContext';
// import Layout from '../../components/layout/Layout'
// import Loader from '../../components/loader/Loader'

// function Order() {
//   const userid = JSON.parse(localStorage.getItem('user')).user.uid
//   const context = useContext(OrdersContext)
//   const { mode, loading, orders } = context
//   return (
//     <Layout>
//       {loading && <Loader />}
//       {orders && orders.length > 0 ?
//         (<>
//           <div className=" h-full pt-10">
//             {
//               orders.filter(obj => obj.userid == userid).map((order) => {
//                 // order.cartItems.map()
//                 return (
//                   <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
//                     {
//                       order.cartItems.map((item) => {
//                         return (
//                           <div className="rounded-lg md:w-2/3">
//                             <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start" style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '', }}>
//                               <img src={item.imageUrl} alt="product-image" className="w-full rounded-lg sm:w-40" />
//                               <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
//                                 <div className="mt-5 sm:mt-0">
//                                   <h2 className="text-lg font-bold text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>{item.title}</h2>
//                                   <p className="mt-1 text-xs text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>{item.description}</p>
//                                   <p className="mt-1 text-xs text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>{item.price}</p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })
//                     }
//                   </div>
//                 )
//               })
//             }
//           </div>
//         </>)
//         :
//         (
//           <h2 className=' text-center tex-2xl text-white'>Not Order</h2>
//         )

//       }
//     </Layout>
//   )
// }

// export default Order