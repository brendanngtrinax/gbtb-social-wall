export type Card = {
  type: "short" | "long";
  status: "hidden" | "free" | "claimed";
};

export type ShortCard = Card & {
  name: string;
  pledge: string;
  avatarIndex: number;
  backgroundIndex: number;
};

export type LongCard = Card & {
  name: string;
  pledge: string;
  avatarIndex: number;
  backgroundIndex: number;
};
