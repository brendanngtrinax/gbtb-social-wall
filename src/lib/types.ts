export type CardType = {
  type: "short" | "long";
  status: "transition" | "hidden" | "free" | "claimed";
};

export type ShortCardType = CardType & {
  name: string;
  pledge: string;
  avatarIndex: number;
  backgroundIndex: number;
};

export type LongCardType = CardType & {
  name: string;
  pledge: string;
  avatarIndex: number;
  backgroundIndex: number;
};
