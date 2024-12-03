'use client';

import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Spending} from "../types/Spending";
import {CustomError} from "../types/CustomError";

const MySpendings = () => {
  const [spendings, setSpendings] = useState<Spending[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedSpending, setEditedSpending] = useState<Spending | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [spending, setSpending] = useState({ //this is used to add a new spending
    name: '',
    amount: '',
    date: '',
    category: '',
  });

  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [startDate, endDate] = dateRange || [undefined, undefined];


    useEffect(() => {
      if (startDate && endDate) {
        fetchSpendingsByDateRange();
      }
      else {
        fetchSpendings();
      }
    }, [dateRange]);

  const fetchSpendings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://budget-buddy-backend-630243095989.europe-west1.run.app/api/spendings', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch spendings');
      }

      const data = await response.json();
      setSpendings(data.spendings);
    } catch (err) {
      const error = err as CustomError;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpendingsByDateRange = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `https://budget-buddy-backend-630243095989.europe-west1.run.app/api/spending-date?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch spendings');
      }

      const data = await response.json();
      setSpendings(data.spendings);
    } catch (err) {
      const error = err as CustomError;
      setError(error.message);
    }
  }

  // function downloadCSV = async () => {
  //   const token = localStorage.getItem('token');
  //   try {
  //     const response = await fetch(
  //       `https://budget-buddy-backend-630243095989.europe-west1.run.app/api/spending-date?startDate=${startDate}&endDate=${endDate}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch spendings');
  //     }

  //     const data = await response.json();
  //     setSpendings(data.spendings);
  //   } catch (err) {
  //     const error = err as CustomError;
  //     setError(error.message);
  //   }

  //   const csvRows = [];

  //   // Headers
  //   const headers = Object.keys(spendings[0]);
  //   csvRows.push(headers.join(',')); // Join with commas for CSV

  //   // Data Rows
  //   for (const row of spendings) {
  //     const values = headers.map(header => `"${row[header]}"`); // Wrap values in quotes
  //     csvRows.push(values.join(',')); // Join with commas
  //   }

  //   // Create CSV Blob
  //   const csvContent = csvRows.join('\n');
  //   const blob = new Blob([csvContent], { type: 'text/csv' });
  //   const url = URL.createObjectURL(blob);

  //   // Create a link to trigger download
  //   const a = document.createElement('a');
  //   a.setAttribute('href', url);
  //   a.setAttribute('download', 'spendings.csv');
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // }

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!confirm('Are you sure you want to delete this spending?')) return;

    try {
      const response = await fetch(`https://budget-buddy-backend-630243095989.europe-west1.run.app/api/spending/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete spending');
      }

      setSpendings((prevSpendings) =>
        prevSpendings.filter((spending) => spending.id !== id)
      );
    } catch (err) {
      const error = err as CustomError;
      setError(error.message);
    }
  };

  const handleInputChangeAddSpending = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSpending({ ...spending, [e.target.name]: e.target.value });
    
  };

  const handleSaveAddSpending = async () => {
    console.log("Spending saved: ", spending);
    setIsAddModalOpen(false);

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`https://budget-buddy-backend-630243095989.europe-west1.run.app/api/spending`, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(spending),
        });

        if (!res.ok) throw new Error('Failed to add spending');
        const data = await res.json(); // Parse response
        const newSpending = data.spending; // Extract the spending object

        setSpendings((prevSpendings) => [...prevSpendings, newSpending]); // Update spendings with the new item
      
      } catch (err) {
        const error = err as CustomError;
        setError(error.message);
      }

    
  };


  const openEditModal = (id: number) => {
    setEditingId(id);
    const spendingToEdit = spendings.find((spending) => spending.id === id);
    if (spendingToEdit) {
      spendingToEdit.date = new Date(spendingToEdit.date).toISOString().split('T')[0]; // Format the date
    }
    if (spendingToEdit) {
      console.log("spendingToEdit.date ", spendingToEdit.date)
      setEditedSpending({ ...spendingToEdit}); // Ensure the date is formatted correctly
      setIsModalOpen(true);
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log("name: ", name, "value: ", value)
    setEditedSpending((prev) => (prev ? { ...prev, [name]: value } : null));
    console.log("editedSpending: ", editedSpending)
  };

  const handleSave = async () => {
    if (!editedSpending || editingId === null) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://budget-buddy-backend-630243095989.europe-west1.run.app/api/spending/${editingId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedSpending),
      });

      if (!res.ok) throw new Error('Failed to update spending');
      console.log("res ",res)

      // Update the state with the saved spending
      setSpendings((prevSpendings) =>
        prevSpendings.map((spending) =>
          spending.id === editingId ? { ...editedSpending } : spending
        )
      );
      console.log("editedSpending: ", editedSpending)
      setIsModalOpen(false);
    } catch (err) {
      const error = err as CustomError;
      setError(error.message);
    }
  };

  

  const handleDateChange = (dates: [Date, Date]) => {
   
    setDateRange(dates);

  };
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4">
       <>
       <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <DatePicker
              selected={startDate}
              onChange={(update) => handleDateChange(update as [Date, Date])} // Cast to [Date, Date]
              startDate={startDate}
              endDate={endDate}
              dateFormat="dd/MM/yyyy"
              selectsRange
              maxDate={new Date()}
              className="border border-gray-300 rounded px-4 py-2 w-56"
              placeholderText="Select date range"
            />
          </div>
          <div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Spending
            </button>
          </div>
        </div>

          {isAddModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-lg font-bold text-gray-700 mb-4">Add Spending</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={spending.name}
                      onChange={handleInputChangeAddSpending}
                      className="block w-full border rounded px-3 py-2"
                      placeholder="Spending name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={spending.amount}
                      onChange={handleInputChangeAddSpending}
                      className="block w-full border rounded px-3 py-2"
                      placeholder="Spending amount"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={spending.date}
                      onChange={handleInputChangeAddSpending}
                      className="block w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      name="category"
                      value={spending.category}
                      onChange={handleInputChangeAddSpending}
                      className="block w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="" disabled>Select category</option>
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </form>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAddSpending}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </>

        <table className="table-auto w-full">
          <thead>
            <tr className="text-left text-gray-600 font-medium bg-gray-100">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
            </tr>
          </thead>
          <tbody>
            {spendings.map((spending) => (
              <tr key={spending.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{spending.name}</td>
                <td className="px-4 py-3 text-gray-800">€ {spending.amount}</td>
                <td className="px-4 py-3 text-gray-800">
                  {new Date(spending.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 flex justify-between items-center">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-medium rounded ${
                      spending.category === "Food"
                        ? "bg-green-100 text-green-800"
                        : spending.category === "transport"
                        ? "bg-blue-100 text-blue-800"
                        : spending.category === "Entertainment"
                        ? "bg-purple-100 text-purple-800"
                        : spending.category === "Utilities"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {spending.category}
                  </span>
                    <div className="flex space-x-3"> 
                    <button
                      onClick={() => openEditModal(spending.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 3.487a2.25 2.25 0 013.182 3.182l-12.83 12.83a4.5 4.5 0 01-1.591 1.059l-4.03 1.612a.75.75 0 01-.958-.958l1.612-4.03a4.5 4.5 0 011.059-1.591l12.83-12.83z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 6.75l6 6"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(spending.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


      {isModalOpen && editedSpending && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Update Spending</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedSpending.name}
                  onChange={handleInputChange}
                  className="block w-full border rounded px-3 py-2"
                  placeholder="Spending name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={editedSpending.amount}
                  onChange={handleInputChange}
                  className="block w-full border rounded px-3 py-2"
                  placeholder="Spending amount"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={editedSpending.date}
                  onChange={handleInputChange}
                  className="block w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={editedSpending.category}
                  onChange={handleInputChange}
                  className="block w-full border rounded px-3 py-2"
                  required
                >
                  <option value="" disabled>Select category</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </form>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySpendings;
