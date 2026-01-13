import { Layout } from "@/components/Layout";
import { useLocation } from "react-router-dom";

interface PlaceholderPageProps {
  userRole?: "admin" | "client";
  title?: string;
}

export function PlaceholderPage({ userRole = "admin", title }: PlaceholderPageProps) {
  const location = useLocation();

  return (
    <Layout userRole={userRole}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
          <span className="text-2xl">🔧</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          {title || "Coming Soon"}
        </h1>
        <p className="text-muted-foreground max-w-md">
          This page ({location.pathname}) is ready for implementation. Continue building out this section!
        </p>
        <div className="mt-8 text-xs text-muted-foreground bg-secondary rounded-lg p-4 max-w-md">
          <p>
            This is a placeholder. Once you're ready to fill in the content for this page, just ask!
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default PlaceholderPage;
