import { isDev } from "./helpers";

export const pricingPlans = [
  {
    name: "Basic",
    price: 9,
    description: "Perfect for occasional use",
    items: [
      "5 PDF summaries per month",
      "Standard processing speed",
      "Email support",
    ],
    id: "basic",
    paymentLink: isDev
      ? "https://buy.stripe.com/test_dRmaEWfFI9Pcfim0mLgrS02"
      : "",
    priceId: isDev ? "price_1RTnSbBAhpaVG70rv7CYyLws" : "",
  },
  {
    name: "Pro",
    price: 19,
    description: "For professionals and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown Export",
    ],
    id: "pro",
    paymentLink: isDev
      ? "https://buy.stripe.com/test_9B628qeBEgdA6LQ2uTgrS03"
      : "",
    priceId: isDev ? "price_1RTnOpBAhpaVG70rkatsCVJY" : "",
  },
];

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 50,
      duration: 0.8,
    },
  },
};
