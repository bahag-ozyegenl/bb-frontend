'use client';

import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Spending} from "../types/Spending";
import {CustomError} from "../types/CustomError";
import Spinner from '../components/Spinner';

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

  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [splitSpendingId, setSplitSpendingId] = useState<number | null>(null);
  const [splitEmail, setSplitEmail] = useState(""); // State for the email input
  

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
      console.log("data.spendings: ", data.spendings)
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

  const sendEmail = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('https://budget-buddy-backend-630243095989.europe-west1.run.app/api/send-mail', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      const result = await response.text(); // Retrieve the text response from the backend
      if (result === 'Email sent successfully') {
        alert('Email sent successfully');
      }
     
    } catch (err) {
      const error = err as CustomError;
      setError(error.message);
    } 
  };

  const downloadFile = async () => {
    try {
      const token = localStorage.getItem('token');
  
      // Fetch the CSV file from the backend
      const response = await fetch('https://budget-buddy-backend-630243095989.europe-west1.run.app/api/download-file', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
  
      // Get the file as a Blob
      const blob = await response.blob();
  
      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);
  
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'spendings.csv'; // Set the default file name
      document.body.appendChild(a);
      a.click(); // Trigger the download
      document.body.removeChild(a); // Remove the element after the download
      window.URL.revokeObjectURL(url); // Clean up the URL
  
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('An error occurred while downloading the file.');
    }
  };
  

 

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

  // edit spending
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

  // Split Spending
  const handleSplitSave = async () => {
    if (splitSpendingId === null || !splitEmail) return;
  
    const token = localStorage.getItem("token");
    const spendingToSplit = spendings.find(
      (spending) => spending.id === splitSpendingId
    );
  
    if (!spendingToSplit) {
      setError("Spending not found.");
      return;
    }

    if (!splitEmail || !/\S+@\S+\.\S+/.test(splitEmail)) {
      setError("Please provide a valid email address.");
      return;
    }
  
    try {
      // Step 1: Fetch user_id for the given email
      const userRes = await fetch(`https://budget-buddy-backend-630243095989.europe-west1.run.app/api/users/getIdByEmail`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: splitEmail }),
      });
    
      if (!userRes.ok) {
        if (userRes.status === 404) {
          throw new Error("User not found for the provided email.");
        } else if (userRes.status === 400) {
          throw new Error("Invalid email address.");
        } else {
          throw new Error("Failed to fetch user ID for email.");
        }
      }
    
      const { user_id } = await userRes.json(); // Assuming backend returns { user_id }
    
      if (!user_id) {
        setError("User not found for the provided email.");
        return;
      }
      console.log("Fetched user_id:", user_id);
  
      // Step 2: Calculate the new amount (split in half)
      const updatedAmount = spendingToSplit.amount / 2;
  
      // Step 3: Update the spending with split_user_id and updated amount
      const res = await fetch(
        `https://budget-buddy-backend-630243095989.europe-west1.run.app/api/spending/${splitSpendingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: updatedAmount, // Updated amount
            split_user_id: user_id, // User ID of the person to share with
          }),
        }
      );
  
      if (!res.ok) throw new Error("Failed to update spending");
  
      // Step 4: Update the state with the saved spending
      setSpendings((prevSpendings) =>
        prevSpendings.map((spending) =>
          spending.id === splitSpendingId
            ? { ...spending, amount: updatedAmount, split_user_id: user_id } // Update amount and split_user_id
            : spending
        )
      );
      
      const addSplitRes = await fetch(`https://budget-buddy-backend-630243095989.europe-west1.run.app/api/spending-split`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: spendingToSplit.name,
          amount: spendingToSplit.amount / 2, // Split the amount in half
          date: spendingToSplit.date,
          category: spendingToSplit.category,
          user_id: user_id, //we will create the spending for this user_id
        }),
      });
  

      if (!addSplitRes.ok) throw new Error(`Failed to add spending to user ${splitEmail}`);

      setSplitModalOpen(false);
    } catch (err) {
      const error = err as CustomError;
      setError(error.message);
    }
  };
  
  

  const handleDateChange = (dates: [Date, Date]) => {
    setDateRange(dates);
  };

  const openSplitModal = (spendingId: number) => {
    setSplitSpendingId(spendingId);
    setSplitModalOpen(true);
    setSplitEmail(""); // Reset the email field each time modal opens
  };

  const closeSplitModal = () => {
    setSplitModalOpen(false);
    setSplitSpendingId(null);
    setSplitEmail("");
  };
  
  if (loading) return  <Spinner />;;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 mt-6">
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
          <div className="flex items-center space-x-4">
             {/* Download Icon */}
              <svg
                className="w-6 h-6 text-gray-400 dark:text-green-500 cursor-pointer hover:text-green-600 hover:scale-110 transition-transform duration-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                onClick={() => downloadFile()}
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"
                />
              </svg>




              {/* Email Icon */}
              <svg
                className="w-6 h-6 text-gray-400 dark:text-green-500 cursor-pointer hover:text-green-600 hover:scale-110 transition-transform duration-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
                onClick={() => sendEmail()}
              >
                <path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z" />
                <path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z" />
              </svg>


              {/* Add Expense Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Expense
              </button>
          </div>
        </div>

        {isAddModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
             <div className="bg-white p-6 rounded shadow-lg w-96 relative">
              {/* Close Button */}
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 text-red-500 hover:text-red-700"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
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
                      onClick={handleSaveAddSpending}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
                <td className="px-4 py-3 text-gray-800">€ {spending.amount} 
                {spending.split_user_id && (
                    <div className="text-sm text-gray-500">shared spending</div>
                  )}
                </td>
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
                      {/* Split Button */}
                      <button
                        onClick={() => openSplitModal(spending.id)}
                        className="text-green-500 hover:text-green-700"
                      >
                     <div className="h-6 w-6 flex items-center justify-center rounded-full border-2 border-yellow-500 text-yellow-500 font-bold">
                        S
                      </div>

                      </button>

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
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
          {/* Close Button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-5 right-5 text-red-500 hover:text-red-700"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
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
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

       {/* Split Modal */}
       {splitModalOpen && splitSpendingId && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
         <div className="bg-white p-6 rounded shadow-lg w-96 relative">
          {/* Close Button */}
          <button
            onClick={() => closeSplitModal()}
            className="absolute top-5 right-5 text-red-500 hover:text-red-700"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
            <h2 className="text-lg font-bold mb-4">Split Your Spending</h2>
            <p className="mb-4">Enter the email address of the person to split with:</p>
            <input
              type="email"
              value={splitEmail}
              onChange={(e) => setSplitEmail(e.target.value)} // Update state on input
              placeholder="Enter email address"
              className="border border-gray-300 p-2 w-full mb-4 rounded"
            />
            <div className="flex justify-end">
             
              <button
                onClick={handleSplitSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Split
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySpendings;
