export interface RSVPWord {
  text: string;
  prefix: string;
  orp: string;
  suffix: string;
  delayFactor: number;
}

/**
 * Calculates the index of the Optimal Recognition Point (ORP) based on word length.
 */
export function getOrpIndex(length: number): number {
  if (length <= 1) return 0;
  if (length <= 5) return 1;
  if (length <= 9) return 2;
  if (length <= 13) return 3;
  return 4;
}

/**
 * Segments a single word into prefix, ORP, and suffix strings for alignment.
 */
export function splitWord(word: string): { prefix: string; orp: string; suffix: string } {
  if (!word) {
    return { prefix: "", orp: "", suffix: "" };
  }

  // Find the alphanumeric core of the word for ORP calculation, preserving punctuation
  const match = word.match(/^([^\w]*)(.*?)([^\w]*)$/);
  const leading = match ? match[1] : "";
  const core = match ? match[2] : word;
  const trailing = match ? match[3] : "";

  if (core.length === 0) {
    return { prefix: leading, orp: "", suffix: trailing };
  }

  const orpIdx = getOrpIndex(core.length);
  const corePrefix = core.substring(0, orpIdx);
  const orp = core.charAt(orpIdx);
  const coreSuffix = core.substring(orpIdx + 1);

  return {
    prefix: leading + corePrefix,
    orp: orp,
    suffix: coreSuffix + trailing,
  };
}

/**
 * Cleans code comment markers from text lines based on the language.
 */
export function cleanCommentLines(text: string, languageId?: string): string {
  const lines = text.split(/\r?\n/);
  const cleanedLines = lines.map((line) => {
    let trimmed = line.trim();

    // Check language-specific comment characters
    if (languageId && (languageId === "python" || languageId === "yaml" || languageId === "shellscript" || languageId === "dockerfile")) {
      if (trimmed.startsWith("#")) {
        trimmed = trimmed.replace(/^#\s*/, "");
      }
    } else {
      // Default C-style comments (JS, TS, C++, Java, etc.)
      if (trimmed.startsWith("//")) {
        trimmed = trimmed.replace(/^\/\/\s*/, "");
      }
      if (trimmed.startsWith("/*")) {
        trimmed = trimmed.replace(/^\/\*\s*/, "");
      }
      if (trimmed.endsWith("*/")) {
        trimmed = trimmed.replace(/\s*\*\/$/, "");
      }
      if (trimmed.startsWith("*")) {
        // JSDoc leading asterisks
        trimmed = trimmed.replace(/^\*\s*/, "");
      }
    }
    return trimmed;
  });
  return cleanedLines.join("\n");
}

/**
 * Processes raw text (Markdown, comments, or plain text) into a stream of RSVPWord tokens with timing pacing.
 */
export function processDocument(text: string, languageId?: string): RSVPWord[] {
  if (!text) return [];

  let cleanedText = text;

  // 1. Clean comment lines if it is a source code document and not markdown
  if (languageId && languageId !== "markdown" && languageId !== "plaintext") {
    cleanedText = cleanCommentLines(text, languageId);
  } else if (!languageId) {
    // Basic heuristic: if the selection looks like a comment block, clean comment markers
    if (/^\s*(\/\/|#|\/\*)/m.test(text)) {
      cleanedText = cleanCommentLines(text);
    }
  }

  // 2. Extract and format fenced code blocks in Markdown/comments
  cleanedText = cleanedText.replace(/```[\s\S]*?```/g, "\n\n[Code_Block]\n\n");

  // 3. Split text into blocks/paragraphs by double newlines
  const blocks = cleanedText.split(/\r?\n\r?\n/);
  const result: RSVPWord[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;

    // Check if block is a Markdown heading
    const headingMatch = block.match(/^(#+)\s+(.*)$/);
    let isHeading = false;
    let blockText = block;

    if (headingMatch) {
      isHeading = true;
      blockText = headingMatch[2];
    }

    // Process list items line by line inside this block
    const lines = blockText.split(/\r?\n/);
    const processedBlockLines: string[] = [];

    for (let line of lines) {
      let lineText = line.trim();
      if (!lineText) continue;

      // Check for Markdown list marker
      const listMatch = lineText.match(/^([-*+]\s*|\d+\.\s*)(.*)$/);
      if (listMatch) {
        const marker = listMatch[1].trim(); // e.g. "-" or "1."
        const content = listMatch[2].trim();
        processedBlockLines.push(`${marker}${content}`);
      } else {
        processedBlockLines.push(lineText);
      }
    }

    // Rejoin block lines
    const blockContent = processedBlockLines.join(" ");

    // Clean remaining Markdown formatting characters
    const cleanBlock = blockContent
      // Inline code `code`
      .replace(/`([^`]+)`/g, "$1")
      // Bold **text** or __text__
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      // Italic *text* or _text_
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      // Image ![alt](url)
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "[Image]")
      // Link [text](url)
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");

    // Split into individual word tokens
    const words = cleanBlock.split(/\s+/);
    let wordsAddedInBlock = 0;

    for (let word of words) {
      if (!word) continue;

      // Calculate trailing punctuation delay
      let delayFactor = 1.0;
      if (/[.!?]+$/.test(word)) {
        delayFactor = 2.0; // Sentence pause
      } else if (/[,,;:-]+$/.test(word)) {
        delayFactor = 1.5; // Clause pause
      }

      const split = splitWord(word);
      result.push({
        text: word,
        prefix: split.prefix,
        orp: split.orp,
        suffix: split.suffix,
        delayFactor: delayFactor,
      });
      wordsAddedInBlock++;
    }

    // Inject pause at the end of headings and paragraphs (if there are subsequent blocks)
    if (i < blocks.length - 1 && wordsAddedInBlock > 0) {
      result.push({
        text: "",
        prefix: "",
        orp: "",
        suffix: "",
        delayFactor: isHeading ? 2.5 : 2.5,
      });
    }
  }

  return result;
}
