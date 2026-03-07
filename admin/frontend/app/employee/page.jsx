import React from 'react'
import TicketDashboard from "../components/ticket/TicketDashboard";
import ProtectedRoute from "../components/route/ProtectedRoute";

const page = () => {
  return (
    <ProtectedRoute roles={["employee"]}>
      <TicketDashboard />
    </ProtectedRoute>
  )
}

export default page
