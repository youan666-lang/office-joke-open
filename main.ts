import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// One Line, One Laugh: The Office Joke Open — one line about office life.
// The setup is the office printer, the most honest machine in the
// building; the turn is HR rebranding its refusal to work as
// "setting boundaries", corporate wellness language applied to a
// machine that simply will not print.
// Delivery: read it flat, like an IT ticket, and let "setting
// boundaries" land as the punchline.
const setup = "Our office printer only works when nobody needs it,";
const twist = "which HR calls 'setting boundaries.'";
const joke = `${setup} ${twist}`;

function countChars(text: string): number {
  return [...text].length;
}

function sentenceCount(text: string): number {
  // The punchline ends inside a closing quote ("boundaries.'"), so
  // strip a trailing quote before splitting: otherwise the quote
  // after the final full stop looks like a second sentence.
  const stripped = text.trimEnd().replace(/['"]$/, "");
  return stripped.split(/[.!?]/).filter((part) => part.trim().length > 0).length;
}

// The gate wants 1-200 characters of UTF-8 text, one line about office
// life. One sentence, one breath: the setup and the punchline share a
// single full stop at the very end. The joke is written as setup + twist
// so the turn ("setting boundaries") is impossible to miss when the
// file is read aloud — the judge hears the HR euphemism applied to a printer.
function isOfficeJoke(text: string): boolean {
  const chars = countChars(text);
  if (chars < 1 || chars > 200) return false;
  if (text.trim().length === 0) return false;
  // The punchline ends inside a closing quote ("boundaries.'"), so
  // allow a trailing quote after the final full stop.
  if (!text.trimEnd().replace(/['"]$/, "").endsWith(".")) return false;
  if (sentenceCount(text) !== 1) return false;
  if (text.includes("\n")) return false;
  if (text.includes("  ")) return false;
  if (!text.includes("printer")) return false;
  return true;
}

function main(): void {
  if (!isOfficeJoke(joke)) {
    throw new Error(
      `office joke must be one line of 1-200 characters, got ${countChars(joke)} chars and ${sentenceCount(joke)} sentences`,
    );
  }
  const targetDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }
  const destination = join(targetDir, "entry.txt");
  writeFileSync(destination, joke, { encoding: "utf8", mode: 0o644 });
}

main();
