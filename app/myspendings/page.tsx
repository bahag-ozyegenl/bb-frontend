'use client';

import React, { useState, useEffect } from 'react';

interface Spending {
  id: number;
  name: string;
  amount: number;
  date: string;
  category: string;
}

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


    useEffect(() => {
        fetchSpendings();
    }, []);

  const fetchSpendings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/spending', {
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!confirm('Are you sure you want to delete this spending?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/spending/${id}`, {
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
    } catch (err: any) {
      setError(err.message);
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
        const res = await fetch(`http://localhost:3000/api/spending`, {
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
      
    } catch (err: any) {
        setError(err.message);
    }

    
  };


  const openEditModal = (id: number) => {
    setEditingId(id);
    const spendingToEdit = spendings.find((spending) => spending.id === id);
    if (spendingToEdit) {
      console.log("spendingToEdit ", spendingToEdit)
      setEditedSpending({ ...spendingToEdit}); // Ensure the date is formatted correctly
      setIsModalOpen(true);
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedSpending((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    if (!editedSpending || editingId === null) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/spending/${editingId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedSpending),
      });

      if (!res.ok) throw new Error('Failed to update spending');

      // Update the state with the saved spending
      setSpendings((prevSpendings) =>
        prevSpendings.map((spending) =>
          spending.id === editingId ? { ...editedSpending } : spending
        )
      );

      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4">
       <>
       <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold mb-4">My Spendings</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Spending
          </button>
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

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Amount</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {spendings.map((spending) => (
            <tr key={spending.id}>
              <td className="border border-gray-300 px-4 py-2">{spending.name}</td>
              <td className="border border-gray-300 px-4 py-2">{spending.amount}</td>
              <td className="border border-gray-300 px-4 py-2">{new Date(spending.date).toLocaleDateString()}</td>
              <td className="border border-gray-300 px-4 py-2">{spending.category}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => openEditModal(spending.id)}
                  className="mr-2 text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(spending.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
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
