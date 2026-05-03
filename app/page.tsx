import PageFrame from "@/components/PageFrame";
import LiveHomePage from "@/components/LiveHomePage";
import { getPortfolioData } from "@/lib/portfolio";

export default function Home() {
  const data = getPortfolioData();

  return (
    <PageFrame>
      <LiveHomePage initialData={data} />
    </PageFrame>
  );
}
