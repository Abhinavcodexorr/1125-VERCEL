export interface TourItem {
  id: number;
  image: string;
  title: string;
  feature: string;
  labelType: string;
  labelValue: string;
  /** Gallery category hash to scroll to on /gallery. */
  gallerySection: string;
}

export const tours: TourItem[] = [
  {
    id: 1,
    image: "/images/b553da9d39aaf4186d3f57e3f82ed60f4c45a3f0.jpg",
    title: "Oceanfront Deck",
    feature: "Ocean View",
    labelType: "Capacity",
    labelValue: "200 Guests",
    gallerySection: "deck-events",
  },
  {
    id: 2,
    image: "/images/91b428e900ee79b561738fbbfb9a4e11b59e4411.jpg",
    title: "Swim-Up Pool Chalets",
    feature: "Private Terrace, Direct Swim-Up Pool Access",
    labelType: "Units",
    labelValue: "5",
    gallerySection: "pool-beach",
  },
  {
    id: 3,
    image: "/images/7a361a3c8514b960f5f200f9a2102e517c94bc4e.jpg",
    title: "The Villa",
    feature: "Private Ocean-Facing Pool, Open-Plan Living",
    labelType: "Occupancy",
    labelValue: "10",
    gallerySection: "interiors",
  },
  {
    id: 4,
    image: "/images/hero.jpg",
    title: "Oceanfront Suite",
    feature: "Panoramic Views",
    labelType: "Capacity",
    labelValue: "4 Guests",
    gallerySection: "outdoor-pergola",
  },
];