'use client';

import { useRef, useState } from 'react';

type Props = {
  name: string;
  defaultValue: string;
  placeholders: string[];
};

function normalizeHtml(html: string) {
  return html
    .replace(/<span class="variable-chip"[^>]*data-variable="([^"]+)"[^>]*>.*?<\/span>/g, '$1')
    .trim();
}

function htmlWithChips(html: string) {
  return html.replace(/\{\{[a-zA-Z0-9_]+\}\}/g, (match) => {
    return `<span class="variable-chip" contenteditable="false" data-variable="${match}">${match}</span>`;
  });
}

function removeChips(html: string) {
  return html.replace(/<span class="variable-chip"[^>]*data-variable="([^"]+)"[^>]*>.*?<\/span>/g, '$1');
}

export default function ContractTemplateEditor({ name, defaultValue, placeholders }: Props) {
  const hiddenRef = useRef<HTMLInputElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'visual' | 'code'>('visual');
  const [codeValue, setCodeValue] = useState(normalizeHtml(defaultValue));
  const [zoom, setZoom] = useState(0.78);
  const [visualKey, setVisualKey] = useState(1);
  const [selectedVariable, setSelectedVariable] = useState(placeholders[0] || '{{client_name}}');

  function syncHidden(nextHtml: string) {
    const clean = normalizeHtml(removeChips(nextHtml));
    if (hiddenRef.current) hiddenRef.current.value = clean;
    return clean;
  }

  function syncFromVisual() {
    const next = syncHidden(visualRef.current?.innerHTML || codeValue);
    setCodeValue(next);
    return next;
  }

  function switchToCode() {
    syncFromVisual();
    setMode('code');
  }

  function switchToVisual() {
    const clean = syncHidden(codeValue);
    setCodeValue(clean);
    setVisualKey((current) => current + 1);
    setMode('visual');
  }

  function onVisualInput() {
    syncHidden(visualRef.current?.innerHTML || '');
  }

  function updateCode(next: string) {
    setCodeValue(next);
    if (hiddenRef.current) hiddenRef.current.value = next;
  }

  function focusVisual() {
    setMode('visual');
    setTimeout(() => visualRef.current?.focus(), 0);
  }

  function runCommand(command: string, value?: string) {
    focusVisual();
    setTimeout(() => {
      document.execCommand(command, false, value);
      onVisualInput();
    }, 0);
  }

  function insertHtml(html: string) {
    focusVisual();
    setTimeout(() => {
      document.execCommand('insertHTML', false, html);
      onVisualInput();
    }, 0);
  }

  function insertVariable() {
    insertHtml(`<span class="variable-chip" contenteditable="false" data-variable="${selectedVariable}">${selectedVariable}</span>`);
  }

  function insertPageBreak() {
    insertHtml('<div class="manual-page-break" contenteditable="false"><span>QUEBRA DE PÁGINA MANUAL</span></div>');
  }

  return (
    <div className="template-builder">
      <input ref={hiddenRef} type="hidden" name={name} defaultValue={codeValue} />

      <div className="template-builder-header">
        <div>
          <h2>Editor visual do contrato</h2>
          <p>Edite o contrato como texto normal. As linhas vermelhas mostram aproximadamente onde cada página A4 termina.</p>
        </div>
        <div className="template-mode-actions">
          <button type="button" className={mode === 'visual' ? 'primary-button small' : 'secondary-button small'} onClick={switchToVisual}>Visual</button>
          <button type="button" className={mode === 'code' ? 'primary-button small' : 'secondary-button small'} onClick={switchToCode}>Código avançado</button>
        </div>
      </div>

      {mode === 'visual' ? (
        <>
          <div className="template-toolbar">
            <button type="button" className="secondary-button small" onClick={() => runCommand('bold')}>Negrito</button>
            <button type="button" className="secondary-button small" onClick={() => runCommand('formatBlock', 'p')}>Parágrafo</button>
            <button type="button" className="secondary-button small" onClick={() => runCommand('formatBlock', 'h2')}>Título de cláusula</button>
            <button type="button" className="secondary-button small" onClick={insertPageBreak}>Inserir quebra de página</button>

            <div className="toolbar-variable-group">
              <select className="select compact" value={selectedVariable} onChange={(event) => setSelectedVariable(event.target.value)}>
                {placeholders.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <button type="button" className="secondary-button small" onClick={insertVariable}>Inserir variável</button>
            </div>

            <div className="toolbar-zoom-group">
              <span>Zoom</span>
              <button type="button" className="secondary-button small" onClick={() => setZoom(0.62)}>62%</button>
              <button type="button" className="secondary-button small" onClick={() => setZoom(0.78)}>78%</button>
              <button type="button" className="secondary-button small" onClick={() => setZoom(1)}>100%</button>
            </div>
          </div>

          <div className="a4-preview-shell">
            <div className="a4-preview-ruler">
              Formato A4 • margem aproximada igual à exportação • role para ver o contrato inteiro
            </div>
            <div className="a4-preview-viewport">
              <div className="a4-scale-wrap" style={{ width: `${794 * zoom}px` }}>
                <div
                  key={visualKey}
                  ref={visualRef}
                  className="a4-editable-paper"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={onVisualInput}
                  style={{ transform: `scale(${zoom})` }}
                  dangerouslySetInnerHTML={{ __html: htmlWithChips(codeValue) }}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="code-editor-panel">
          <p>Use este campo apenas se quiser mexer diretamente no HTML. Para edição normal, volte para a aba Visual.</p>
          <textarea
            className="textarea"
            value={codeValue}
            onChange={(event) => updateCode(event.target.value)}
            style={{ minHeight: 760, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.45 }}
          />
        </div>
      )}

      <div className="template-help-card">
        <h2>Variáveis automáticas</h2>
        <p>Esses campos são preenchidos pelo sistema quando o contrato é gerado. Use o botão “Inserir variável” para colocar no texto sem precisar programar.</p>
        <div className="placeholder-list">
          {placeholders.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
