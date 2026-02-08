import { readFile } from "../tools/readFile";
import { writeFile } from "../tools/writeFile";
import { execMany } from "../tools/execMany";
import { webSearch } from "../tools/webSearch";
import { addTool } from "../tools/addTool";
import { fixError } from "../tools/fixError";
import { listTools } from "../tools/listTools";

export const tools = {
  readFile,
  writeFile,
  execMany,
  webSearch,
  addTool,
  fixError,
  listTools,
};

export { isToolAllowed } from "../tools/utils";