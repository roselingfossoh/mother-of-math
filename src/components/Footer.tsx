
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-4 px-4 mt-auto">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          &copy; 2025 Mothers for Mathematics. All rights reserved.
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <Button variant="link" size="sm" className="bg-mama-mustard text-black hover:bg-mama-mustard/90">
            Terms of Service
          </Button>
          <Button variant="link" size="sm" className="bg-mama-mustard text-black hover:bg-mama-mustard/90">
            Privacy Policy
          </Button>
          <Button variant="link" size="sm" className="bg-mama-mustard text-black hover:bg-mama-mustard/90">
            Contact Us
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
