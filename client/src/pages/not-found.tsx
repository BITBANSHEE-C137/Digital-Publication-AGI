import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="max-w-md text-center space-y-6">
        <h1 className="font-display text-9xl font-bold text-accent/20">404</h1>
        <h2 className="font-display text-3xl font-bold text-primary">Page Not Found</h2>
        <p className="font-serif text-muted-foreground leading-relaxed">
          The page you are looking for does not exist or has been moved. 
          Perhaps it was outsourced to the void.
        </p>
        
        <Link href="/">
          <button className="inline-flex items-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-background transition-colors duration-300 font-sans font-medium rounded-md mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Cover
          </button>
        </Link>
      </div>
    </div>
  );
}
