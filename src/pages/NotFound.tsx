import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-6 mx-auto">
          <span className="text-6xl">🎮</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Упс! Страницата не е намерена</p>
        <Button 
          onClick={() => window.location.href = '/'}
          className="gradient-primary"
        >
          Обратно към игрите
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
