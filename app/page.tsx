// 'use client'
// import { useAuth } from "./context/AuthContext";
// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from "react";

// interface CustomError {
//   message: string
// }

// export default function Home() {
//   const authContext = useAuth()
//   const { user, loading, isAuthenticated } = authContext || {}

//   const router = useRouter()
  
  

//   useEffect(() => {
//     // Only check for redirection once loading is complete
//     console.log("loading ", loading)
//     console.log("isAuthenticated ", isAuthenticated)
//     if (!loading && !isAuthenticated) {
//       router.push('/register')
//     }
//     else if (!loading && isAuthenticated) {
//       //fetchSpendings()
//     }
//   }, [loading, isAuthenticated]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (!user) {
//     return <p>Redirecting...</p>;
//   }


 
  

//   return (
//     <div className="flex flex-col items-center p-4">
//       {!loading && isAuthenticated && user && (
//         <>
//           <h1 className="text-center text-2xl font-bold text-blue-600 mt-4 mb-6">
//             Hey {user.email}, Welcome to BudgetBuddy!
//           </h1>
          
//         </>
//       )}
//     </div>
//   );
// }

'use client';

import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';

interface Spending {
  id: number;
  name: string;
  amount: number;
  date: string;
  category: string;
}

export default function Home() {
  const authContext = useAuth();
  const { user, loading, isAuthenticated } = authContext || {};
  const router = useRouter();

  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredSpendings, setFilteredSpendings] = useState<Spending[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/register');
    } else if (!loading && isAuthenticated) {
      fetchSpendingSummary();
    }
  }, [loading, isAuthenticated]);

  const fetchSpendingSummary = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/spending-sum', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch spending summary');
      }

      const data = await response.json();
      setChartData(
        data.spendings.map((item: { category: string; sum: string }) => ({
          id: item.category,
          value: Number(item.sum),
          label: item.category,
        }))
      );
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching the summary');
    } finally {
      setLoadingChart(false);
    }
  };

  const fetchSpendingsByCategory = async (category: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `http://localhost:3000/api/spending?category=${category}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch spendings by category');
      }

      const data = await response.json();
      setFilteredSpendings(data.spendings || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching spendings');
    }
  };

  const handlePieClick = (event: any, item: any) => {
    // Use dataIndex to get the corresponding chartData entry
    const clickedCategory = chartData[item.dataIndex]?.id; 
  
    if (clickedCategory) {
      setSelectedCategory(clickedCategory); // Set the clicked category
    } else {
      alert('Category not found');
    }
  };
  
  if (loading || loadingChart) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      {!loading && isAuthenticated && user && (
        <>
          <h1 className="text-center text-2xl font-bold text-blue-600 mt-4 mb-6">
            Hey {user.email}, Welcome to BudgetBuddy!
          </h1>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
          >
            <Typography variant="h6">
              Click a slice to see spendings by category
            </Typography>

            <PieChart
              series={[
                {
                  data: chartData,
                },
              ]}
              onItemClick={handlePieClick}
              width={400}
              height={200}
              margin={{ right: 200 }}
            />
          </Stack>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Spendings by Category: {selectedCategory || 'None'}
            </h2>
            {selectedCategory && filteredSpendings.length === 0 && (
              <p>No spendings in this category.</p>
            )}
            {selectedCategory && filteredSpendings.length > 0 && (
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">Amount</th>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpendings.map((spending) => (
                    <tr key={spending.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {spending.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {spending.amount}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(spending.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
