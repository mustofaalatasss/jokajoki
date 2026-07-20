import { getJoki } from "../dashboard/actions"
import SettingsClient from "./SettingsClient"

import { redirect } from "next/navigation"

export default async function SettingsPage() {
  let joki;
  try {
    joki = await getJoki()
  } catch (err) {
    redirect("/login")
  }
  const initialJokiName = joki?.nickname || "Host Joki"
  const initialJokiRole = joki?.jokiRole || "Jungler"
  const initialRateCard = joki?.rateCardPrice || 10000
  const initialRateCardFT = joki?.rateCardFastTrack || 15000

  return <SettingsClient initialJokiName={initialJokiName} initialJokiRole={initialJokiRole} initialRateCard={initialRateCard} initialRateCardFT={initialRateCardFT} />
}
