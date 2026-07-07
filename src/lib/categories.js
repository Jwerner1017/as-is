export const CATEGORIES = [
  {
    name: "Electronics",
    icon: "Smartphone",
    subcategories: [
      { name: "Cell Phones & Accessories", subs: ["iPhones", "Android Phones", "Cases & Covers", "Chargers & Cables"] },
      { name: "Computers & Tablets", subs: ["Laptops", "Desktops", "Tablets", "Monitors", "Components"] },
      { name: "Video Games & Consoles", subs: ["PlayStation", "Xbox", "Nintendo", "PC Gaming", "Retro"] },
      { name: "Cameras", subs: ["DSLR", "Mirrorless", "Action Cameras", "Lenses", "Accessories"] },
      { name: "Audio", subs: ["Headphones", "Speakers", "Earbuds", "Turntables", "Microphones"] },
      { name: "TV & Home Theater", subs: ["TVs", "Soundbars", "Projectors", "Streaming Devices"] }
    ]
  },
  {
    name: "Fashion & Apparel",
    icon: "Shirt",
    subcategories: [
      { name: "Men's Clothing", subs: ["Shirts", "Pants", "Jackets", "Suits", "Activewear"] },
      { name: "Women's Clothing", subs: ["Dresses", "Tops", "Pants", "Jackets", "Activewear"] },
      { name: "Shoes", subs: ["Sneakers", "Boots", "Heels", "Sandals", "Athletic"] },
      { name: "Jewelry & Watches", subs: ["Rings", "Necklaces", "Watches", "Bracelets", "Earrings"] },
      { name: "Handbags & Accessories", subs: ["Handbags", "Wallets", "Belts", "Sunglasses", "Hats"] },
      { name: "Vintage & Streetwear", subs: ["Vintage Tees", "Streetwear", "Designer", "Thrift Finds"] }
    ]
  },
  {
    name: "Home & Garden",
    icon: "Home",
    subcategories: [
      { name: "Furniture", subs: ["Living Room", "Bedroom", "Office", "Outdoor"] },
      { name: "Kitchen & Dining", subs: ["Cookware", "Appliances", "Utensils", "Storage"] },
      { name: "Home Decor", subs: ["Wall Art", "Rugs", "Mirrors", "Candles"] },
      { name: "Bedding & Bath", subs: ["Sheets", "Towels", "Pillows", "Blankets"] },
      { name: "Lawn & Garden", subs: ["Tools", "Plants", "Patio", "Planters"] },
      { name: "Lighting", subs: ["Lamps", "Ceiling", "Outdoor", "LED"] }
    ]
  },
  {
    name: "Automotive",
    icon: "Car",
    subcategories: [
      { name: "Car Parts & Accessories", subs: ["Engine", "Brakes", "Suspension", "Electrical"] },
      { name: "Motorcycle Parts", subs: ["Engine", "Body", "Exhaust", "Accessories"] },
      { name: "Car Audio", subs: ["Speakers", "Head Units", "Amps", "Subwoofers"] },
      { name: "Tires & Wheels", subs: ["Tires", "Wheels", "Rims", "Wheel Covers"] },
      { name: "Exterior & Interior Accessories", subs: ["Floor Mats", "Seat Covers", "Dash Cams", "Decals"] }
    ]
  },
  {
    name: "Sports & Outdoors",
    icon: "Dumbbell",
    subcategories: [
      { name: "Exercise Equipment", subs: ["Weights", "Machines", "Yoga", "Resistance Bands"] },
      { name: "Camping & Hiking", subs: ["Tents", "Sleeping Bags", "Backpacks", "Cooking Gear"] },
      { name: "Fishing & Hunting", subs: ["Rods & Reels", "Tackle", "Bows", "Optics"] },
      { name: "Bikes & Cycling", subs: ["Mountain", "Road", "BMX", "Accessories"] },
      { name: "Team Sports", subs: ["Basketball", "Football", "Soccer", "Baseball"] },
      { name: "Outdoor Apparel", subs: ["Jackets", "Boots", "Base Layers", "Rain Gear"] }
    ]
  },
  {
    name: "Collectibles",
    icon: "Trophy",
    subcategories: [
      { name: "Trading Cards", subs: ["Pokémon", "Yu-Gi-Oh!", "Magic: The Gathering", "Baseball", "Basketball", "Football", "Hockey"] },
      { name: "Action Figures", subs: ["Marvel", "DC", "Anime", "Star Wars", "Vintage"] },
      { name: "Funko & Pop Culture", subs: ["Funko Pop", "Loungefly", "Statues", "Replicas"] },
      { name: "Coins & Currency", subs: ["US Coins", "World Coins", "Banknotes", "Bullion"] },
      { name: "Model Sets & LEGO", subs: ["LEGO Sets", "Model Cars", "Model Trains", "Diecast"] }
    ]
  },
  {
    name: "Tools & Equipment",
    icon: "Wrench",
    subcategories: [
      { name: "Power Tools", subs: ["Drills", "Saws", "Sanders", "Grinders"] },
      { name: "Hand Tools", subs: ["Wrenches", "Screwdrivers", "Pliers", "Hammers"] },
      { name: "Tool Storage", subs: ["Tool Boxes", "Chests", "Carts", "Bags"] },
      { name: "Hardware & Fasteners", subs: ["Screws", "Bolts", "Nails", "Anchors"] },
      { name: "Automotive Tools", subs: ["Jacks", "Diagnostic", "Air Tools", "Specialty"] },
      { name: "Workshop Equipment", subs: ["Compressors", "Welders", "Workbenches", "Vises"] }
    ]
  },
  {
    name: "Beauty & Personal Wellness",
    icon: "Sparkles",
    subcategories: [
      { name: "Makeup", subs: ["Face", "Eyes", "Lips", "Palettes"] },
      { name: "Skincare", subs: ["Cleansers", "Moisturizers", "Serums", "Masks"] },
      { name: "Hair Care", subs: ["Shampoo", "Styling", "Tools", "Extensions"] },
      { name: "Fragrances", subs: ["Women's", "Men's", "Unisex", "Sets"] },
      { name: "Vitamins & Supplements", subs: ["Vitamins", "Protein", "Pre-Workout", "Wellness"] },
      { name: "Personal Care", subs: ["Oral Care", "Body Care", "Deodorant", "Shaving"] },
      { name: "Beauty Tools", subs: ["Brushes", "Sponges", "Mirrors", "Organizers"] }
    ]
  },
  {
    name: "Toys & Hobbies",
    icon: "Gamepad2",
    subcategories: [
      { name: "Action Figures", subs: ["Marvel", "DC", "Anime", "GI Joe", "Transformers"] },
      { name: "Board Games & Puzzles", subs: ["Strategy", "Party Games", "Puzzles", "Classic"] },
      { name: "Building Sets", subs: ["LEGO", "Mega Bloks", "K'NEX", "Magnetic"] },
      { name: "Dolls & Plush", subs: ["Barbie", "Squishmallows", "Build-A-Bear", "Stuffed Animals"] },
      { name: "Model Kits", subs: ["Cars", "Planes", "Ships", "Gundam"] }
    ]
  },
  {
    name: "Miscellaneous",
    icon: "Package",
    subcategories: [
      { name: "Pet Supplies", subs: ["Dogs", "Cats", "Fish", "Reptiles"] },
      { name: "Office Supplies", subs: ["Pens", "Paper", "Organization", "Printers"] },
      { name: "Party Supplies", subs: ["Decorations", "Tableware", "Balloons", "Costumes"] },
      { name: "Holiday & Seasonal", subs: ["Christmas", "Halloween", "Easter", "4th of July"] },
      { name: "Other", subs: ["Everything Else"] }
    ]
  }
];

export const CONDITIONS = ["New", "Like New", "Used", "For Parts", "Refurbished"];
export const SELLING_FORMATS = ["Buy It Now", "Auction", "Live"];
export const SHIPPING_TYPES = ["Free Shipping", "Flat Rate", "Calculated"];
export const SELLER_LEVELS = ["New", "Up & Coming", "Trusted Seller", "Top Seller"];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "ending_soon", label: "Ending Soonest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "most_juiced", label: "Most Juiced" }
];