import { supabase } from "./supabase";

/** Reads attending guests' names from the public `attendees` view. */
export async function fetchAttendees(): Promise<string[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("attendees").select("name");
  if (error || !data) return [];
  return data.map((r: { name: string }) => r.name).filter(Boolean);
}
