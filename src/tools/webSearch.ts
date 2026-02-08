import { webSearch as web } from "../utils/web";
import type { ToolResult } from "../types/types";

export const webSearch = async (query: string): Promise<ToolResult> => {
  const res = await web(query);
  return { success: true, output: res };
};