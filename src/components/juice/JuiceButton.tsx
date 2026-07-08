import { Button } from "@/components/ui/button";

interface JuiceButtonProps {
  onClick: () => void;
  isJuiced: boolean;
  disabled?: boolean;
}

export function JuiceButton({ onClick, isJuiced, disabled }: JuiceButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isJuiced}
      variant="outline"
      className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
    >
      {isJuiced ? "Already Juiced" : "Juice It — $0.99"}
    </Button>
  );
}
