interface DashboardLayoutProps {
  children: React.ReactNode;
  params: {
    brandId: string;
  };
}

export const dynamic = "force-dynamic";

const BrandLayout: React.FC<DashboardLayoutProps> = async ({ children }) => {
  return (
    <main className="flex flex-col">
      <div className="py-10">{children}</div>
    </main>
  );
};

export default BrandLayout;
