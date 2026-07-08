import { Button } from "@/components/ui/button";

interface RageBuyButtonProps {
  onClick: () => void;
  isActive: boolean;
  price: number;
}

export function RageBuyButton({ onClick, isActive, price }: RageBuyButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isActive}
      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg"
    >
      {isActive ? "RAGE BUY ACTIVE" : `RAGE BUY — $${price}`}
    </Button>
  );
}
