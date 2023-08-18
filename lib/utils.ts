import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function LL(...inputs: any[]) {
  console.log(":: ", ...inputs);
}

export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const waitAll = (promises: Promise<any>[]) => Promise.all(promises);
