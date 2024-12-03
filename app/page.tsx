'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, pieArcLabelClasses} from '@mui/x-charts/PieChart';
import { PieItemIdentifier} from '@mui/x-charts/models';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import {Spending} from "./types/Spending";
import { CustomError } from './types/CustomError';
import { ChartData } from './types/ChartData';

export default function Home() {
  const authContext = useAuth();
  const { user, loading, isAuthenticated } = authContext || {};
  const router = useRouter();

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredSpendings, setFilteredSpendings] = useState<Spending[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/register');
    } else if (!loading && isAuthenticated) {
      fetchSpendingSummary();
      fetchSpendingsByCategory(selectedCategory || '');
    }
  }, [loading, isAuthenticated, selectedCategory]);

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
    } catch (err) {
      const error = err as CustomError;
      setError(error.message || 'An error occurred while fetching the summary');
    } finally {
      setLoadingChart(false);
    }
  };

  const fetchSpendingsByCategory = async (category: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `http://localhost:3000/api/spending-by-category?category=${category}`,
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
      console.log('data sp', data.spendings);
      setFilteredSpendings(data.spendings || []);
    } catch (err) {
      const error = err as CustomError;
      setError(error.message || 'An error occurred while fetching spendings');
    }
  };

  const handlePieClick = (event: React.MouseEvent<SVGPathElement, MouseEvent>, itemIdentifier: PieItemIdentifier) => {
    // Use dataIndex to get the corresponding chartData entry
    console.log('item', itemIdentifier);
    console.log('chartData', chartData);
    const clickedCategory = chartData[itemIdentifier.dataIndex]?.id; 
    console.log('clickedCategory', clickedCategory);
  
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
                <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                  Spendings by Category: {selectedCategory || 'None'}
                </h2>
                {selectedCategory && filteredSpendings.length === 0 && ( 
                  <p>No spendings in this category.</p>
                )}
                {selectedCategory &&  filteredSpendings.length > 0 &&( 
                  <div className="shadow-lg rounded-lg overflow-x-auto">
                  <div className="w-full max-w-md mx-auto shadow-md rounded-lg overflow-hidden">
                  <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-blue-100 text-left font-semibold text-sm text-blue-900">
                        <th className="border border-gray-200 px-4 py-2">Name</th>
                        <th className="border border-gray-200 px-4 py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSpendings.map((spending, index) => (
                        <tr
                          key={spending.id || index}
                          className={
                            index % 2 === 0
                              ? "bg-white"
                              : "bg-blue-50 hover:bg-blue-100"
                          }
                        >
                          <td className="border border-gray-200 px-4 py-2 text-sm">
                            {spending.name}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-sm text-right">
                          € {spending.sum}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>

                </div>
                
                )}
              </div>
            </Typography>
            
            
            <PieChart
              series={[
                {
                  data: chartData,
                  arcLabel: (item) => `${((item.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%`, // Display percentage values
                  arcLabelMinAngle: 35, // Only display labels for slices with a minimum angle
                  arcLabelRadius: '60%', // Position labels closer to the center of each slice
                },
              ]}
              onItemClick={ handlePieClick}
              width={400}
              height={200}
              margin={{ right: 200 }}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fontWeight: 'bold', // Make labels bold
                  fill: '#ffffff', // White text
                  textShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)', // Add shadow for contrast
                },
              }}
            />
          </Stack>

          
        </>
      )}
    </div>
  );
}
