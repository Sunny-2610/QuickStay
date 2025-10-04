import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets, dashboardDummyData } from '../../assets/assets'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(dashboardDummyData)
  return (
    <div>
      <Title
        align='left'
        font='outfit'
        title='Dashboard'
        subtitle='Monitor your room listings, track bookings,
        and analyze revenue — all in one place. Stay updated with real-time insights to ensure smooth operations.'
      />

      {/* ===== Stats Cards ===== */}
      <div className='flex flex-wrap gap-4 my-8'>
        {/* Total Bookings */}
        <div className='bg-blue-50 border border-blue-100 rounded-lg flex items-center p-4 pr-8'>
          <img src={assets.totalBookingIcon} alt='' className='hidden sm:block h-10' />
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Bookings</p>
            <p className='text-gray-600 text-base'>{dashboardData.totalBookings}</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className='bg-blue-50 border border-blue-100 rounded-lg flex items-center p-4 pr-8'>
          <img src={assets.totalRevenueIcon} alt='' className='hidden sm:block h-10' />
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Revenue</p>
            <p className='text-gray-600 text-base'>{dashboardData.totalRevenue}</p>
          </div>
        </div>
      </div>

      {/* ===== Recent Bookings Table ===== */}
      <h2 className='text-xl text-blue-900 font-medium mb-5'>Recent Bookings</h2>
      <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium text-left'>User Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-left hidden sm:table-cell'>Room Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Price</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>
            </tr>
          </thead>

          <tbody className='text-sm'>
            {dashboardData.bookings.map((item, index) => (
              <tr key={index} className='border-t border-gray-300'>
                <td className='py-3 px-4 text-gray-700'>{item.user.username}</td>
                <td className='py-3 px-4 text-gray-700 hidden sm:table-cell'>{item.room.roomType}</td>
                <td className='py-3 px-4 text-gray-700 text-center'>$ {item.totalPrice}</td>
                <td className='py-3 px-4 text-center'>
                  <button
                    className={`py-1 px-3 text-xs rounded-full ${
                      item.isPaid
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {item.isPaid ? 'Completed' : 'Pending'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
