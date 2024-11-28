// import React, { useState, useEffect } from 'react';

// interface SpendingModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (spending: any) => void;
//   initialData?: {
//     name: string;
//     amount: number;
//     date: string;
//     category: string;
//   };
// }

// const SpendingModal: React.FC<SpendingModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
//   const [spending, setSpending] = useState({
//     name: '',
//     amount: '',
//     date: '',
//     category: '',
//   });

//   // Populate initialData when editing
//   useEffect(() => {
//     if (initialData) {
//       setSpending(initialData);
//     }
//   }, [initialData]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setSpending((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = () => {
//     onSave(spending);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded shadow-lg w-96">
//         <h2 className="text-lg font-bold text-gray-700 mb-4">
//           {initialData ? 'Edit Spending' : 'Add Spending'}
//         </h2>
//         <form className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={spending.name}
//               onChange={handleInputChange}
//               className="block w-full border rounded px-3 py-2"
//               placeholder="Spending name"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Amount</label>
//             <input
//               type="number"
//               name="amount"
//               value={spending.amount}
//               onChange={handleInputChange}
//               className="block w-full border rounded px-3 py-2"
//               placeholder="Spending amount"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Date</label>
//             <input
//               type="date"
//               name="date"
//               value={spending.date}
//               onChange={handleInputChange}
//               className="block w-full border rounded px-3 py-2"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Category</label>
//             <select
//               name="category"
//               value={spending.category}
//               onChange={handleInputChange}
//               className="block w-full border rounded px-3 py-2"
//               required
//             >
//               <option value="" disabled>
//                 Select category
//               </option>
//               <option value="Food">Food</option>
//               <option value="Transport">Transport</option>
//               <option value="Entertainment">Entertainment</option>
//               <option value="Utilities">Utilities</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>
//         </form>
//         <div className="flex justify-end space-x-4 mt-6">
//           <button
//             onClick={onClose}
//             className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SpendingModal;
