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

// add function toFirstLetterUpperCase to String
declare global {
  interface String {
    toFirstLetterUpperCase(): string;
  }
}

String.prototype.toFirstLetterUpperCase = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
