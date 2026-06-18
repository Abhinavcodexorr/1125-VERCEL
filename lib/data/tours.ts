export interface TourItem {
  id: number;
  image: string;
  title: string;
  feature: string;
  labelType: string;  // Dynamically populates the bottom-left table cell label
  labelValue: string; // Dynamically populates the bottom-right table cell value
}

export const tours: TourItem[] = [
  {
    id: 1,
    image: "/images/hero.jpg",
    title: "Oceanfront Deck",
    feature: "Ocean View",
    labelType: "Capacity",
    labelValue: "200 Guests",
  },
  {
    id: 2,
    image: "/images/hero.jpg",
    title: "Swim-Up Pool Chalets",
    feature: "Private Terrace, Direct Swim-Up Pool Access",
    labelType: "Units",
    labelValue: "5",
  },
  {
    id: 3,
    image: "/images/hero.jpg",
    title: "The Villa",
    feature: "Private Ocean-Facing Pool, Open-Plan Living",
    labelType: "Occupancy",
    labelValue: "10",
  },
  {
    id: 4,
    image: "/images/hero.jpg",
    title: "Oceanfront Suite",
    feature: "Panoramic Views",
    labelType: "Capacity",
    labelValue: "4 Guests",
  },
];