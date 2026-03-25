export const PAYMONGO_BASE = "https://api.paymongo.com/v1";

export function paymongoAuth(secretKey: string) {
  return "Basic " + Buffer.from(secretKey + ":").toString("base64");
}

export const PACKS = {
  starter: {
    credits: 5,
    amount: 150, // PHP
    label: "Starter Pack",
    description: "5 credits ",
    displayPrice: "$3",
  },
  pro: {
    credits: 20,
    amount: 450, // PHP
    label: "Pro Pack",
    description: "20 credits",
    displayPrice: "$9",
  },
} as const;

export type PackId = keyof typeof PACKS;
