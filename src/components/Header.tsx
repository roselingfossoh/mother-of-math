
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-white border-b py-3 px-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#4CAF50" strokeWidth="2" />
            <path d="M7 12L10 15L17 8" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <h1 className="font-bold text-lg">Math Mama Mentor</h1>
            <p className="text-xs text-muted-foreground">AI-powered mathematics support</p>
          </div>
        </div>
        
        <nav>
          <Button variant="outline" size="sm" className="mr-2 bg-mama-mustard hover:bg-mama-mustard/90 text-black border-none">
            About
          </Button> 
          <Button variant="ghost" size="sm" className="mr-2 bg-mama-mustard hover:bg-mama-mustard/90 text-black border-none">
            Contact
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
