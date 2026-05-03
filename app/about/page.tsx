import LiveAboutPage from "@/components/LiveAboutPage";
import PageFrame from "@/components/PageFrame";
import { getPortfolioData } from "@/lib/portfolio";

export default function AboutPage() {
  const data = getPortfolioData();

  return (
    <PageFrame>
      <LiveAboutPage initialData={data} />
    </PageFrame>
  );
}
