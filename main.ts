// One Line, One Laugh: The Office Joke Open.
//
// One line about office life. The office printer is the most honest
// machine in the building: it only works when nobody needs it. The
// joke is HR's response — rebranding the refusal as "setting
// boundaries", wellness language applied to a machine that simply
// will not print. Everyone who has waited by a printer has met this
// machine; everyone who has sat through a wellness talk has heard
// that phrase. Read it flat, like an IT ticket.
import fs from "node:fs";
import path from "node:path";

const LINE =
  "Our office printer only works when nobody needs it, which HR calls 'setting boundaries.'";

function problems(text: string): string[] {
  const found: string[] = [];
  const chars = [...text].length;
  if (chars < 1 || chars > 200) found.push(`length ${chars} is outside 1-200`);
  if (text.trim().length === 0) found.push("line is only white space");
  if (text.includes("\n")) found.push("line spans more than one line");
  if (text.includes("  ")) found.push("line has a double space");
  // The punchline sits inside a closing quote ("boundaries.'"), so a
  // trailing quote is stripped before checking the final full stop.
  const bare = text.trimEnd().replace(/['"]$/, "");
  if (!bare.endsWith(".")) found.push("line does not end on a full stop");
  const sentences = bare.split(/[.!?]/).filter((part) => part.trim().length > 0).length;
  if (sentences !== 1) found.push(`line has ${sentences} sentences, want 1`);
  if (!text.includes("printer")) found.push("the printer is missing");
  return found;
}

function main(): void {
  const bad = problems(LINE);
  if (bad.length > 0) {
    throw new Error(`office joke is not valid: ${bad.join("; ")}`);
  }
  const outDir = path.resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "entry.txt"), LINE, { encoding: "utf8", mode: 0o644 });
}

main();
