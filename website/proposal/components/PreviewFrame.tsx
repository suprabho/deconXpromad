'use client';

import { useState } from 'react';

const SIZES = [
  { label: 'Desktop', width: '100%' },
  { label: 'Tablet', width: '834px' },
  { label: 'Mobile', width: '390px' },
] as const;

export default function PreviewFrame({ src, title }: { src: string; title: string }) {
  const [width, setWidth] = useState<string>(SIZES[0].width);

  return (
    <div className="preview-shell">
      <div className="preview-bar">
        <span className="addr">{src}</span>
        <div className="preview-controls">
          {SIZES.map((s) => (
            <button
              key={s.label}
              className={width === s.width ? 'active' : ''}
              onClick={() => setWidth(s.width)}
              type="button"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div className="preview-stage">
        <iframe src={src} title={title} style={{ width, maxWidth: '100%' }} loading="lazy" />
      </div>
    </div>
  );
}
