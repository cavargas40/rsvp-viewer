import { expect } from "chai";
import { getOrpIndex, splitWord, cleanCommentLines, processDocument } from "../../documentProcessor";

describe("Document Processor & ORP Engine", () => {
  describe("getOrpIndex", () => {
    it("should calculate correct ORP index based on length", () => {
      // Length 0-1 -> Index 0
      expect(getOrpIndex(0)).to.equal(0);
      expect(getOrpIndex(1)).to.equal(0);

      // Length 2-5 -> Index 1
      expect(getOrpIndex(2)).to.equal(1);
      expect(getOrpIndex(5)).to.equal(1);

      // Length 6-9 -> Index 2
      expect(getOrpIndex(6)).to.equal(2);
      expect(getOrpIndex(9)).to.equal(2);

      // Length 10-13 -> Index 3
      expect(getOrpIndex(10)).to.equal(3);
      expect(getOrpIndex(13)).to.equal(3);

      // Length > 13 -> Index 4
      expect(getOrpIndex(14)).to.equal(4);
      expect(getOrpIndex(20)).to.equal(4);
    });
  });

  describe("splitWord", () => {
    it("should split regular words correctly", () => {
      // Visual (len 6) -> ORP index 2 ('s')
      const r1 = splitWord("Visual");
      expect(r1.prefix).to.equal("Vi");
      expect(r1.orp).to.equal("s");
      expect(r1.suffix).to.equal("ual");

      // a (len 1) -> ORP index 0 ('a')
      const r2 = splitWord("a");
      expect(r2.prefix).to.equal("");
      expect(r2.orp).to.equal("a");
      expect(r2.suffix).to.equal("");

      // in (len 2) -> ORP index 1 ('n')
      const r3 = splitWord("in");
      expect(r3.prefix).to.equal("i");
      expect(r3.orp).to.equal("n");
      expect(r3.suffix).to.equal("");
    });

    it("should preserve leading/trailing non-word characters", () => {
      // (hello) -> len 5 -> ORP index 1 ('e')
      const r1 = splitWord("(hello)");
      expect(r1.prefix).to.equal("(h");
      expect(r1.orp).to.equal("e");
      expect(r1.suffix).to.equal("llo)");

      // exciting, -> len 8 -> ORP index 2 ('c')
      const r2 = splitWord("exciting,");
      expect(r2.prefix).to.equal("ex");
      expect(r2.orp).to.equal("c");
      expect(r2.suffix).to.equal("iting,");
    });
  });

  describe("cleanCommentLines", () => {
    it("should strip C-style comment markers", () => {
      const input = "// This is a comment\n/* Block comment */\n* JSDoc line";
      const output = cleanCommentLines(input, "typescript");
      expect(output).to.equal("This is a comment\nBlock comment\nJSDoc line");
    });

    it("should strip python comment markers", () => {
      const input = "# Python comment line\n# another line";
      const output = cleanCommentLines(input, "python");
      expect(output).to.equal("Python comment line\nanother line");
    });
  });

  describe("processDocument", () => {
    it("should strip markdown bold and italic formatting", () => {
      const input = "This is **bold** and *italic* text.";
      const result = processDocument(input, "markdown");
      const textArray = result.filter(w => w.text).map(w => w.text);
      expect(textArray).to.deep.equal(["This", "is", "bold", "and", "italic", "text."]);
    });

    it("should strip links and images", () => {
      const input = "Check [Google](https://google.com) and ![alt](image.png)";
      const result = processDocument(input, "markdown");
      const textArray = result.filter(w => w.text).map(w => w.text);
      expect(textArray).to.deep.equal(["Check", "Google", "and", "[Image]"]);
    });

    it("should handle punctuation delays", () => {
      const input = "Hello world. This is exciting, isn't it?";
      const result = processDocument(input, "markdown");
      const words = result.filter(w => w.text);

      expect(words[1].text).to.equal("world.");
      expect(words[1].delayFactor).to.equal(2.0); // Sentence end

      expect(words[4].text).to.equal("exciting,");
      expect(words[4].delayFactor).to.equal(1.5); // Clause pause

      expect(words[6].text).to.equal("it?");
      expect(words[6].delayFactor).to.equal(2.0); // Sentence end
    });

    it("should collapse fenced code blocks into [Code_Block]", () => {
      const input = "Before code:\n```javascript\nconst x = 1;\n```\nAfter code.";
      const result = processDocument(input, "markdown");
      const textArray = result.filter(w => w.text).map(w => w.text);
      expect(textArray).to.include("[Code_Block]");
    });

    it("should keep markdown list markers prepended to the first word of list items", () => {
      const input = "- First item\n- Second item";
      const result = processDocument(input, "markdown");
      const textArray = result.filter(w => w.text).map(w => w.text);
      expect(textArray).to.deep.equal(["-First", "item", "-Second", "item"]);
    });
  });
});
