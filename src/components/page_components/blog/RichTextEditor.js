'use client';

import { useEffect, useId, useRef, useState } from 'react';

let quillModulesRegistered = false;

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'blockquote',
  'code-block',
  'list',
  'bullet',
  'link',
  'image',
];

function normalizeHtml(html) {
  return (html || '').trim().replace(/^<p><br><\/p>$/i, '');
}

export default function RichTextEditor({ value, onChange }) {
  const editorHostRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const savedRangeRef = useRef(null);
  const selectedImageRef = useRef(null);
  const lastHtmlRef = useRef('');
  const toolbarId = useId();

  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [dialogMode, setDialogMode] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageSelected, setImageSelected] = useState(false);

  function rememberSelection() {
    const editor = quillInstanceRef.current;
    if (!editor) {
      return { index: 0, length: 0 };
    }

    const range = editor.getSelection(true) || { index: editor.getLength(), length: 0 };
    savedRangeRef.current = range;
    return range;
  }

  function syncEditorHtml(editor) {
    const html = normalizeHtml(editor.root.innerHTML);
    lastHtmlRef.current = html;
    onChange(html);
  }

  function openImageDialog() {
    rememberSelection();
    setImageUrl('');
    setDialogMode('image');
  }

  function openLinkDialog() {
    const editor = quillInstanceRef.current;
    const range = rememberSelection();
    const selectedText = editor && range.length > 0
      ? editor.getText(range.index, range.length)
      : '';

    setLinkText(selectedText);
    setLinkUrl('');
    setDialogMode('link');
  }

  function insertImage() {
    const editor = quillInstanceRef.current;
    if (!editor || !imageUrl.trim()) {
      return;
    }

    const range = savedRangeRef.current || rememberSelection();
    editor.focus();
    editor.setSelection(range.index, range.length, 'user');
    editor.insertEmbed(range.index, 'image', imageUrl.trim(), 'user');
    editor.insertText(range.index + 1, '\n', 'user');
    syncEditorHtml(editor);
    setDialogMode(null);
    setImageUrl('');
  }

  function insertLink() {
    const editor = quillInstanceRef.current;
    if (!editor || !linkUrl.trim()) {
      return;
    }

    const range = savedRangeRef.current || rememberSelection();
    const textToInsert = linkText.trim() || linkUrl.trim();

    editor.focus();
    editor.setSelection(range.index, range.length, 'user');

    if (range.length > 0) {
      editor.deleteText(range.index, range.length, 'user');
    }

    editor.insertText(range.index, textToInsert, 'link', linkUrl.trim(), 'user');
    editor.setSelection(range.index + textToInsert.length, 0, 'user');
    syncEditorHtml(editor);
    setDialogMode(null);
    setLinkText('');
    setLinkUrl('');
  }

  function alignSelectedImage(alignment) {
    const editor = quillInstanceRef.current;
    const image = selectedImageRef.current;
    if (!editor || !image) {
      return;
    }

    image.style.display = 'block';
    image.style.float = 'none';
    image.style.marginTop = '1.5rem';
    image.style.marginBottom = '1.5rem';

    if (alignment === 'left') {
      image.style.marginLeft = '0';
      image.style.marginRight = 'auto';
    }

    if (alignment === 'center') {
      image.style.marginLeft = 'auto';
      image.style.marginRight = 'auto';
    }

    if (alignment === 'right') {
      image.style.marginLeft = 'auto';
      image.style.marginRight = '0';
    }

    image.setAttribute('data-align', alignment);
    syncEditorHtml(editor);
  }

  useEffect(() => {
    let isMounted = true;
    let detachClickHandler = null;

    async function loadEditor() {
      try {
        const quillModule = await import('quill');
        const Quill = quillModule.default || quillModule;

        if (typeof window !== 'undefined') {
          window.Quill = Quill;
        }
        if (typeof globalThis !== 'undefined') {
          globalThis.Quill = Quill;
        }

        let resizeEnabled = false;
        try {
          const resizeModule = await import('quill-image-resize-module');
          const resolvedResizeModule =
            resizeModule?.ImageResize ||
            resizeModule?.default ||
            resizeModule;

          if (resolvedResizeModule && !Quill.imports['modules/imageResize']) {
            Quill.register('modules/imageResize', resolvedResizeModule);
            resizeEnabled = true;
          } else if (Quill.imports['modules/imageResize']) {
            resizeEnabled = true;
          }
        } catch (error) {
          console.warn('Image resize module failed to load. Continuing without resize support.', error);
        }

        if (!quillModulesRegistered) {
          const BaseLink = Quill.import('formats/link');

          class ExternalLinkBlot extends BaseLink {
            static create(value) {
              const node = super.create(value);
              node.setAttribute('target', '_blank');
              node.setAttribute('rel', 'noopener noreferrer');
              return node;
            }
          }

          Quill.register('formats/link', ExternalLinkBlot, true);
          quillModulesRegistered = true;
        }

        if (!editorHostRef.current || !isMounted) {
          return;
        }

        const modules = {
          toolbar: {
            container: `#${toolbarId}`,
            handlers: {
              image: openImageDialog,
              link: openLinkDialog,
            },
          },
          clipboard: {
            matchVisual: false,
          },
        };

        if (resizeEnabled) {
          modules.imageResize = {
            parchment: Quill.import('parchment'),
          };
        }

        const editor = new Quill(editorHostRef.current, {
          theme: 'snow',
          placeholder: 'Write your post here...',
          modules,
          formats,
        });

        quillInstanceRef.current = editor;

        const initialHtml = normalizeHtml(value);
        if (initialHtml) {
          editor.clipboard.dangerouslyPasteHTML(initialHtml);
          lastHtmlRef.current = initialHtml;
        }

        editor.on('text-change', () => {
          syncEditorHtml(editor);
        });

        const handleClick = (event) => {
          if (event.target instanceof HTMLImageElement) {
            selectedImageRef.current = event.target;
            setImageSelected(true);
            return;
          }

          selectedImageRef.current = null;
          setImageSelected(false);
        };

        editor.root.addEventListener('click', handleClick);
        detachClickHandler = () => editor.root.removeEventListener('click', handleClick);

        setLoadError('');
        setIsReady(true);
      } catch (error) {
        console.error('Failed to load rich text editor', error);
        if (isMounted) {
          setLoadError('The editor failed to load. Refresh the page and try again.');
          setIsReady(false);
        }
      }
    }

    loadEditor();

    return () => {
      isMounted = false;
      if (detachClickHandler) {
        detachClickHandler();
      }
      quillInstanceRef.current = null;
      selectedImageRef.current = null;
    };
  }, [toolbarId]);

  useEffect(() => {
    const editor = quillInstanceRef.current;
    if (!editor || !isReady) {
      return;
    }

    const nextHtml = normalizeHtml(value);
    const currentHtml = normalizeHtml(editor.root.innerHTML);

    if (nextHtml === lastHtmlRef.current || nextHtml === currentHtml) {
      return;
    }

    const selection = editor.getSelection();
    if (!nextHtml) {
      editor.setText('');
      lastHtmlRef.current = '';
    } else {
      editor.clipboard.dangerouslyPasteHTML(nextHtml);
      lastHtmlRef.current = nextHtml;
    }

    if (selection) {
      editor.setSelection(selection.index, selection.length, 'silent');
    }
  }, [isReady, value]);

  return (
    <div className="blog-editor-shell overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div id={toolbarId} className="blog-editor-toolbar border-b border-slate-200 bg-slate-50 px-3 py-2">
        <span className="ql-formats">
          <select className="ql-header" defaultValue="">
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="">Paragraph</option>
          </select>
        </span>
        <span className="ql-formats">
          <button type="button" className="ql-bold" aria-label="Bold" />
          <button type="button" className="ql-italic" aria-label="Italic" />
          <button type="button" className="ql-underline" aria-label="Underline" />
        </span>
        <span className="ql-formats">
          <button type="button" className="ql-list" value="ordered" aria-label="Ordered list" />
          <button type="button" className="ql-list" value="bullet" aria-label="Bullet list" />
          <button type="button" className="ql-blockquote" aria-label="Blockquote" />
          <button type="button" className="ql-code-block" aria-label="Code block" />
        </span>
        <span className="ql-formats">
          <button type="button" className="ql-link" aria-label="Insert link" />
          <button type="button" className="ql-image" aria-label="Insert image" />
        </span>
        <span className="ql-formats">
          <button
            type="button"
            className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => alignSelectedImage('left')}
            disabled={!imageSelected}
          >
            Img Left
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => alignSelectedImage('center')}
            disabled={!imageSelected}
          >
            Img Center
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => alignSelectedImage('right')}
            disabled={!imageSelected}
          >
            Img Right
          </button>
        </span>
      </div>

      {dialogMode && (
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          {dialogMode === 'image' ? (
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#ff761b]"
                />
              </div>
              <button
                type="button"
                onClick={insertImage}
                className="rounded-lg bg-[#ff761b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e86814]"
              >
                Insert Image
              </button>
              <button
                type="button"
                onClick={() => setDialogMode(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] md:items-end">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(event) => setLinkText(event.target.value)}
                  placeholder="Read more about cybersecurity"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#ff761b]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  URL
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(event) => setLinkUrl(event.target.value)}
                  placeholder="/insights/cybersecurity-basics"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#ff761b]"
                />
              </div>
              <button
                type="button"
                onClick={insertLink}
                className="rounded-lg bg-[#003366] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d4d86]"
              >
                Insert Link
              </button>
              <button
                type="button"
                onClick={() => setDialogMode(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {loadError ? (
        <div className="min-h-72 bg-white px-4 py-6 text-sm text-red-600">
          {loadError}
        </div>
      ) : (
        <div className="blog-editor">
          <div ref={editorHostRef} />
          {!isReady && (
            <div className="min-h-72 bg-white px-4 py-6 text-sm text-slate-500">
              Loading editor...
            </div>
          )}
        </div>
      )}
    </div>
  );
}