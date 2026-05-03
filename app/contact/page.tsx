import LiveContactPage from "@/components/LiveContactPage";
import PageFrame from "@/components/PageFrame";
import { getPortfolioData } from "@/lib/portfolio";

export default function ContactPage() {
  const data = getPortfolioData();

  return (
    <PageFrame>
      <LiveContactPage initialData={data} />
    </PageFrame>
  );
}
