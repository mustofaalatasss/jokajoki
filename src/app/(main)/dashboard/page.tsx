import { getDashboardStats, getQueueList, getJoki } from "./actions"
import DashboardClient from "./DashboardClient"

import { redirect } from "next/navigation"

export default async function DashboardPage() {
  let stats, queueData, joki;
  try {
    [stats, queueData, joki] = await Promise.all([
      getDashboardStats(),
      getQueueList(100),
      getJoki(),
    ])
  } catch (error) {
    // If not authenticated or error fetching, redirect to login
    redirect("/login")
  }

  return (
    <DashboardClient
      stats={stats}
      queueData={queueData}
      joki={joki}
    />
  )
}
