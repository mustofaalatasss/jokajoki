import SettingsClient from "../../(main)/settings/SettingsClient"
import { AppLayout } from "@/components/layout/AppLayout"

export default function DemoSettingsPage() {
  const initialJokiName = "Joki Demo";
  const initialJokiRole = "Jungler";
  const initialRateCard = 10000;
  const initialRateCardFT = 15000;

  return (
    <AppLayout isDemo={true}>
      <SettingsClient 
        initialJokiName={initialJokiName} 
        initialJokiRole={initialJokiRole} 
        initialRateCard={initialRateCard} 
        initialRateCardFT={initialRateCardFT} 
        isDemo={true}
      />
    </AppLayout>
  )
}
