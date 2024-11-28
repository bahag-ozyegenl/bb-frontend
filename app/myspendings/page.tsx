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

  

  // Fetch all spendings on page load
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
      console.log(response)
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

  const handleInputChange = (id: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log("e val ", e.target.value)
    const { name, value } = e.target;
    setSpendings((prevSpendings) =>
    prevSpendings.map((spending: any) =>
    spending.id === id
     ? { ...spending, [name]: value } // Update the specific spending being edited
     : spending
   )
  );
};

  const handleSave = async (id: number) => {
    // console.log("edited spending saved: ", spending);
    const spendingToSave = spendings.find((spending) => spending.id === id);
    setIsModalOpen(false);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/spending/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spendingToSave),
      });

      if (!res.ok) throw new Error('Failed to add spending');
      
    } catch (err: any) {
        setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const openEditModal = (id: number) => {
    setEditingId(id); // Set the ID of the spending being edited
    setIsModalOpen(true);
   };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">My Spendings</h1>
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
                  onClick={() => 
                    openEditModal(spending.id)}
                  className="mr-2 text-blue-500 hover:underline"
                >
                  Edit
                </button>
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-bold text-gray-700 mb-4">Update Spending</h2>
                        <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                            type="text"
                            name="name"
                            value={spending.name}
                            onChange={(e) => handleInputChange(spending.id, e)}
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
                            onChange={(e) => handleInputChange(spending.id, e)}
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
                            onChange={(e) => handleInputChange(spending.id, e)}
                            className="block w-full border rounded px-3 py-2"
                            required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                            name="category"
                            value={spending.category}
                            onChange={(e) => handleInputChange(spending.id, e)}
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
                            onClick={() => handleSave(spending.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Save
                        </button>
                        </div>
                    </div>
                    </div>
                )}
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
    </div>
  );
};

export default MySpendings;
