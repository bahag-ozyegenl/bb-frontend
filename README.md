# BudgetBuddy 

The frontend of **BudgetBuddy**, a powerful application to track and manage your expenses. BudgetBuddy offers visual insights, detailed tracking, and collaborative features to make budgeting easier and more intuitive.

## Features

- **Store Expenses**: Securely save your expense data in the database.
- **Visual Insights**: View your spending breakdown in a pie chart.
  - Click on a pie slice to see detailed information about spending in a specific category.
- **Email Summaries**: Receive detailed summaries of your expenses via email.
- **Export Data**: Download your spending data in CSV format.
- **Custom Date Filters**: Select specific date ranges to analyze your expenses.
- **Collaborative Splitting**: Split expenses with other users to track shared spending.

---
## Technologies Used

### Core Frontend Technologies
- **Next.js**: A React framework for server-side rendering and static site generation.
- **React**: A JavaScript library for building interactive user interfaces.
- **TypeScript**: Adds strong typing for safer and more maintainable code.
- **Tailwind CSS**: A utility-first CSS framework for styling.

### UI Libraries and Tools
- **@mui/material**: Material-UI components for building responsive, beautiful designs.
- **@emotion/react & @emotion/styled**: CSS-in-JS library for styling components.
- **@heroicons/react**: SVG icons for UI components.
- **@mui/x-charts**: Charting library for visualizing spending data.
- **react-datepicker**: Date picker component for selecting date ranges.


---

## Getting Started


## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/bahag-ozyegenl/bb-frontend.git
   cd bb-frontend

2. Install dependencies
    ```bash
    npm install --legacy-peer-deps

    ```

3. Run the backend server
    ```bash
    npm run dev
    ```
4. Access the application at:
    ```ardunio
    http://localhost:3001/
    ```


## Environment Variables

Set the following environment variables in a `.env.local` file:

```plaintext
GCP_REGION=
GCP_SA_KEY=
NEXT_PUBLIC_API_KEY=
PROJECT_ID=
```

## Deployment

The frontend is deployed and accessible at:
[https://budget-buddy-frontend-630243095989.europe-west1.run.app](https://budget-buddy-frontend-630243095989.europe-west1.run.app)

The backend of the application can be accessed at:
[https://budget-buddy-backend-630243095989.europe-west1.run.app](https://budget-buddy-backend-630243095989.europe-west1.run.app)

---


## Contribution Guidelines

1. Fork the repository and create a new branch for your feature or bug fix.
2. Ensure your code is clean and adheres to the project's coding standards.
3. Submit a pull request with a detailed explanation of your changes.

---

## License

This project is licensed under the **ISC License**.

---

## Support

If you encounter any issues or have questions, feel free to [open an issue](https://github.com/bahag-ozyegenl/bb-frontend/issues) or contact the project maintainers.


