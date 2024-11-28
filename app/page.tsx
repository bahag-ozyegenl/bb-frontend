'use client'
import { useAuth } from "./context/AuthContext";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

interface CustomError {
  message: string
}

export default function Home() {
  const authContext = useAuth()
  const { user, loading, isAuthenticated } = authContext || {}

  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spending, setSpending] = useState({
    name: '',
    amount: '',
    date: '',
    category: '',
  });
  
  

  useEffect(() => {
    // Only check for redirection once loading is complete
    console.log("loading ", loading)
    console.log("isAuthenticated ", isAuthenticated)
    if (!loading && !isAuthenticated) {
      router.push('/register')
    }
    else if (!loading && isAuthenticated) {
      //fetchSpendings()
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Redirecting...</p>;
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSpending({ ...spending, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    console.log("Spending saved: ", spending);
    setIsModalOpen(false);

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
      
    } catch (err) {
      const error = err as CustomError;
      console.error('Error adding spending:', error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Redirecting...</p>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      {!loading && isAuthenticated && user && (
        <>
          <h1 className="text-center text-2xl font-bold text-blue-600 mt-4 mb-6">
            Hey {user.email}, Welcome to BudgetBuddy!
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Spending
          </button>

          {isModalOpen && (
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
                      value={spending.amount}
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
                      value={spending.date}
                      onChange={handleInputChange}
                      className="block w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      name="category"
                      value={spending.category}
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
        </>
      )}
    </div>
  );
}