"use server";

import { revalidatePath } from 'next/cache';

export async function revalidateTransactions() {
  "use server";
  revalidatePath('/');
}