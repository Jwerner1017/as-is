import { Badge } from "@/components/ui/badge";

interface SellerLevelBadgeProps {
  level: 'new' | 'upcoming' | 'trusted' | 'top';
}

export function SellerLevelBadge({ level }: SellerLevelBadgeProps) {
  const config = {
    new: { label: "New Seller", color: "bg-red-600" },
    upcoming: { label: "Up & Coming", color: "bg-purple-600" },
    trusted: { label: "Trusted Seller", color: "bg-blue-600" },
    top: { label: "Top Seller", color: "bg-yellow-500 text-black" },
  };

  const { label, color } = config[level];

  return (
    <Badge className={`${color} px-3 py-1 text-sm font-medium`}>
      {label}
    </Badge>
  );
}
