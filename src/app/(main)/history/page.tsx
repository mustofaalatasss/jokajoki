import { getSessionHistory } from "../dashboard/actions"
import HistoryClient from "./HistoryClient"

import { redirect } from "next/navigation"

export default async function HistoryPage() {
  let sessions;
  try {
    sessions = await getSessionHistory()
  } catch (err) {
    redirect("/login")
  }

  return <HistoryClient sessions={sessions} />
}
