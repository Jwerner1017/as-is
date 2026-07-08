import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ListingCardProps {
  title: string;
  price: number;
  image: string;
  isJuiced?: boolean;
  sellerLevel?: string;
  onClick?: () => void;
}

export function ListingCard({ 
  title, 
  price, 
  image, 
  isJuiced = false, 
  sellerLevel,
  onClick 
}: ListingCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition-shadow bg-zinc-900 border-zinc-800"
    >
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover rounded-t-lg" 
        />
        {isJuiced && (
          <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
            Juiced
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
        <p className="text-2xl font-bold mt-2">${price}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between text-sm text-zinc-400">
        <span>{sellerLevel}</span>
      </CardFooter>
    </Card>
  );
}
