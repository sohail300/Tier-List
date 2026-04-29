export type TierItem = {
  id: string;
  imageUrl: string;
  order: number;
  tierId: string | null;
};

export type TierData = {
  id: string;
  name: string;
  order: number;
  bgColor?: string;
  textColor?: string;
  items: TierItem[];
};

export type TierListData = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  publicSlug: string | null;
  tiers: TierData[];
  poolItems: TierItem[];
};
