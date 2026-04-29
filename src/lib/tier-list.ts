type SerializedItem = {
  id: string;
  imageUrl: string;
  order: number;
  tierId: string | null;
};

export type TierWithItems = {
  id: string;
  name: string;
  bgColor?: string;
  textColor?: string;
  order: number;
  tierListId: string;
  items: Item[];
};

type Item = SerializedItem;

export type TierListWithRelations = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  publicSlug: string | null;
  tiers: TierWithItems[];
  items: Item[];
};

export type TierListDTO = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  publicSlug: string | null;
  tiers: Array<{
    id: string;
    name: string;
    bgColor: string;
    textColor: string;
    order: number;
    items: Array<{
      id: string;
      imageUrl: string;
      order: number;
      tierId: string | null;
    }>;
  }>;
  poolItems: Array<{
    id: string;
    imageUrl: string;
    order: number;
    tierId: null;
  }>;
};

export function serializeTierList(
  tierList: TierListWithRelations,
): TierListDTO {
  const poolItems = tierList.items
    .filter((item) => item.tierId === null)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      id: item.id,
      imageUrl: item.imageUrl,
      order: item.order,
      tierId: null,
    }));

  const tiers = tierList.tiers
    .sort((a, b) => a.order - b.order)
    .map((tier) => ({
      id: tier.id,
      name: tier.name,
      bgColor: tier.bgColor ?? "#3f3f46",
      textColor: tier.textColor ?? "#f4f4f5",
      order: tier.order,
      items: [...tier.items]
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          id: item.id,
          imageUrl: item.imageUrl,
          order: item.order,
          tierId: item.tierId,
        })),
    }));

  return {
    id: tierList.id,
    title: tierList.title,
    createdAt: tierList.createdAt.toISOString(),
    updatedAt: tierList.updatedAt.toISOString(),
    isPublic: tierList.isPublic,
    publicSlug: tierList.publicSlug,
    tiers,
    poolItems,
  };
}
