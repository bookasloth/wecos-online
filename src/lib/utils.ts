import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** ₹1,50,000 — Indian digit grouping, no decimals. */
export function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`
}
