import Header from "./Header";
import Footer from "./Footer";

export default function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
