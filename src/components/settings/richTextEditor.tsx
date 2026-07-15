// src/components/settings/richTextEditor.tsx
//
// Minimal WYSIWYG editor for admin-managed rich text (currently just Terms &
// Policies). Deliberately built on a plain contentEditable surface +
// document.execCommand rather than pulling in a full editor framework --
// the formatting needs here are modest (bold/italic/headings/lists/links)
// and this keeps the admin bundle light. execCommand is deprecated but
// still broadly supported for exactly these basic commands in every
// evergreen browser, which is all this internal tool needs.
//
// Output is sanitized down to a fixed safe-tag allowlist on every keystroke
// (see sanitizeRichText) so what's shown while editing always matches what
// will actually render publicly -- no surprise stripped tags after save.
"use client";
import { useCallback, useEffect, useRef } from "react";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdInsertLink,
  MdFormatClear,
} from "react-icons/md";
import { sanitizeRichText } from "@/lib/richText/sanitizeRichText";
import {
  RichTextEditorWrap,
  RichTextToolbar,
  RichTextSurface,
} from "./settings.styles";

interface RichTextEditorProps {
  id?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ id, value, onChange, placeholder }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  // Tracks the last value we ourselves produced, so the sync effect below
  // only pushes `value` into the DOM when it changed from OUTSIDE this
  // component (e.g. the async content load finishing) -- never on our own
  // keystrokes, which would otherwise reset the cursor to the start on
  // every character typed.
  const lastEmittedRef = useRef<string | null>(null);

  useEffect(() => {
    if (editorRef.current && value !== lastEmittedRef.current) {
      editorRef.current.innerHTML = value || "";
      lastEmittedRef.current = value;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const clean = sanitizeRichText(editorRef.current.innerHTML);
    // Re-sync the DOM to the sanitized version if execCommand inserted
    // anything outside the allowlist, so what's on screen never drifts
    // from what will actually be saved/rendered.
    if (clean !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = clean;
    }
    lastEmittedRef.current = clean;
    onChange(clean);
  }, [onChange]);

  function exec(command: string, arg?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  }

  function handleLink() {
    const url = window.prompt("Link URL (must start with http:// or https://)");
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      window.alert("Links must start with http:// or https://");
      return;
    }
    exec("createLink", url);
  }

  return (
    <RichTextEditorWrap>
      <RichTextToolbar>
        <button type="button" onClick={() => exec("bold")} aria-label="Bold" title="Bold">
          <MdFormatBold />
        </button>
        <button type="button" onClick={() => exec("italic")} aria-label="Italic" title="Italic">
          <MdFormatItalic />
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          aria-label="Underline"
          title="Underline"
        >
          <MdFormatUnderlined />
        </button>

        <span className="divider" />

        <button
          type="button"
          className="text-btn"
          onClick={() => exec("formatBlock", "h2")}
          aria-label="Heading"
          title="Heading"
        >
          H2
        </button>
        <button
          type="button"
          className="text-btn"
          onClick={() => exec("formatBlock", "h3")}
          aria-label="Subheading"
          title="Subheading"
        >
          H3
        </button>
        <button
          type="button"
          className="text-btn"
          onClick={() => exec("formatBlock", "p")}
          aria-label="Paragraph"
          title="Paragraph"
        >
          ¶
        </button>

        <span className="divider" />

        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          aria-label="Bullet list"
          title="Bullet list"
        >
          <MdFormatListBulleted />
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          aria-label="Numbered list"
          title="Numbered list"
        >
          <MdFormatListNumbered />
        </button>
        <button
          type="button"
          onClick={() => exec("formatBlock", "blockquote")}
          aria-label="Quote"
          title="Quote"
        >
          <MdFormatQuote />
        </button>
        <button type="button" onClick={handleLink} aria-label="Insert link" title="Insert link">
          <MdInsertLink />
        </button>

        <span className="divider" />

        <button
          type="button"
          onClick={() => exec("removeFormat")}
          aria-label="Clear formatting"
          title="Clear formatting"
        >
          <MdFormatClear />
        </button>
      </RichTextToolbar>

      <RichTextSurface
        id={id}
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={handleInput}
        onBlur={handleInput}
      />
    </RichTextEditorWrap>
  );
};

export default RichTextEditor;
