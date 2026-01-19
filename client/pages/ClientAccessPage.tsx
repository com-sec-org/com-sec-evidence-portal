import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ClientAccessPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid access link.");
      return;
    }

    async function exchangeToken() {
      try {
        const res = await fetch(
          `http://localhost:3001/api/client-access/${token}`,
          {
            method: "POST",
          }
        );

        if (!res.ok) {
          throw new Error("Access link expired or invalid.");
        }

        const data = await res.json();

        // ✅ Redirect client to their portal
        navigate(`/client/${data.slug}/controls`, { replace: true });
      } catch (err) {
        alert("This access link is invalid or has expired.");
        navigate("/", { replace: true });
      }
    }
    exchangeToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full text-center space-y-4">
        {!error ? (
          <>
            <h1 className="text-xl font-semibold">
              Validating secure access…
            </h1>
            <p className="text-sm text-muted-foreground">
              Please wait while we verify your access link.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-red-600">
              Access Error
            </h1>
            <p className="text-sm text-muted-foreground">{error}</p>
          </>
        )}
      </div>
    </div>
  );
}
