'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type DragEvent,
} from 'react';

/**
 * A drag-and-drop upload zone with simulated, watchable progress.
 *
 * Real uploads can't happen in a catalogue demo, so the progress is theatre with
 * honest mechanics: each queued file is advanced by one fixed-timestep interval
 * that runs only while something is in flight, so the bar fills at a rate the eye
 * can read (0 → 100% over ~1.5s) rather than jumping. When the queue drains the
 * interval is torn down, and it is torn down again on unmount, so nothing ticks
 * against a component that has left the page.
 *
 * `compact` is the catalogue card: the same dashed zone and the same file rows,
 * frozen at their finished state with every control taken out of the tab order,
 * because a focusable node inside an aria-hidden card frame is a trap with no label.
 */

/** Interval between progress ticks, ms. Fixed so the fill rate never depends on
 *  frame timing — the same fifty ticks land whatever the display is doing. */
const TICK = 30;
/** Simulated upload duration, ms. Long enough to watch, short enough not to wait. */
const DURATION = 1500;
/** Percentage points added per tick, so progress reaches 100 in DURATION. */
const STEP = (100 * TICK) / DURATION;

type Kind = 'image' | 'doc' | 'zip' | 'generic';

interface DropFile {
  id: number;
  name: string;
  size: number;
  kind: Kind;
  /** 0…100. Written only by the tick loop (or seeded at 100 for samples). */
  progress: number;
  done: boolean;
}

/** Bytes as a human reads them: three significant figures, binary units. */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unit]}`;
}

/** The row icon follows the extension, so a demo file needs no MIME type to be
 *  sorted. Anything unrecognised falls through to the generic sheet. */
function kindOf(name: string): Kind {
  const ext = name.slice(name.lastIndexOf('.') + 1).toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif', 'bmp'].includes(ext)) {
    return 'image';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz', 'tgz'].includes(ext)) return 'zip';
  if (['pdf', 'doc', 'docx', 'txt', 'md', 'rtf', 'pages', 'odt'].includes(ext)) {
    return 'doc';
  }
  return 'generic';
}

/** The two files the card mounts with, already finished — so the zone is never an
 *  empty rectangle and the finished state is visible without dropping anything. */
const SAMPLES: readonly Omit<DropFile, 'id'>[] = [
  { name: 'brand-guidelines.pdf', size: 2_411_724, kind: 'doc', progress: 100, done: true },
  { name: 'hero-render.png', size: 5_882_030, kind: 'image', progress: 100, done: true },
];

/* --- Icons. Inline SVG, currentColor, sized by the caller via className. --- */

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 15V4" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function KindIcon({ kind, className }: { kind: Kind; className?: string }) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (kind === 'image') {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="m4 16 4.5-4 4 3.5L16 12l4 4" />
      </svg>
    );
  }
  if (kind === 'zip') {
    return (
      <svg {...common}>
        <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <path d="M12 4v3M12 9v2M12 13v2" />
        <rect x="10.5" y="15" width="3" height="3.5" rx="0.75" />
      </svg>
    );
  }
  if (kind === 'doc') {
    return (
      <svg {...common}>
        <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
        <path d="M14 3v4h4" />
        <path d="M8.5 13h7M8.5 16.5h7" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

/** Tracks `prefers-reduced-motion`. Under it the bar shows its final state at once
 *  and nothing scales or pulses. Starts false so server and first client paint agree. */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/** One file in the list: rounded type icon, name, size, and a bar that is either
 *  filling or crowned with a check. `onRemove` is omitted in the card, where the
 *  row is not interactive. */
function FileRow({
  file,
  labelId,
  onRemove,
  interactive,
}: {
  file: DropFile;
  labelId: string;
  onRemove?: (id: number) => void;
  interactive: boolean;
}) {
  const rounded = Math.round(file.progress);
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 px-3 py-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-300">
        <KindIcon kind={file.kind} className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span
            id={labelId}
            className="truncate text-sm font-medium text-foreground"
            title={file.name}
          >
            {file.name}
          </span>
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {formatSize(file.size)}
          </span>
        </span>
        <span className="mt-1.5 flex items-center gap-2">
          <span
            className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-labelledby={labelId}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={rounded}
          >
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-[width] duration-150 ease-out motion-reduce:transition-none"
              style={{ width: `${file.progress}%` }}
            />
          </span>
          <span className="w-9 shrink-0 text-right text-[0.7rem] tabular-nums text-muted-foreground">
            {file.done ? (
              <CheckIcon className="ml-auto size-4 text-violet-600 dark:text-violet-300" />
            ) : (
              `${rounded}%`
            )}
          </span>
        </span>
      </span>
      {interactive && onRemove ? (
        <button
          type="button"
          onClick={() => onRemove(file.id)}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          aria-label={`Remove ${file.name}`}
        >
          <CloseIcon className="size-4" />
        </button>
      ) : (
        <span aria-hidden="true" className="size-7 shrink-0" />
      )}
    </li>
  );
}

export function FileDropzone({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const uid = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const nextId = useRef(0);
  const [files, setFiles] = useState<DropFile[]>([]);
  const [dragging, setDragging] = useState(false);
  /** DnD fires enter/leave on every child too, so a raw leave flickers the tint.
   *  Counting enters against leaves means the zone only cools when the last one
   *  actually crosses the border. */
  const dragDepth = useRef(0);

  // Seeded here rather than in useState's initialiser so the two samples share the
  // same id counter as dropped files and no two rows ever collide on a key.
  useEffect(() => {
    setFiles(SAMPLES.map((sample) => ({ ...sample, id: nextId.current++ })));
  }, []);

  const addFiles = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) return;
      const added: DropFile[] = Array.from(list).map((file) => ({
        id: nextId.current++,
        name: file.name,
        size: file.size,
        kind: kindOf(file.name),
        // Under reduced motion there is no loop to fill the bar, so a new file is
        // seated at its finished state the way the samples already are.
        progress: reduced ? 100 : 0,
        done: reduced,
      }));
      setFiles((current) => [...current, ...added]);
    },
    [reduced],
  );

  const removeFile = useCallback((id: number) => {
    setFiles((current) => current.filter((file) => file.id !== id));
  }, []);

  const hasActive = files.some((file) => !file.done);

  // One interval for the whole queue, running only while something is unfinished and
  // motion is allowed. Every tick advances each in-flight file by a fixed step and
  // caps it at 100; when the queue drains the effect re-runs and tears the timer down.
  useEffect(() => {
    if (compact || reduced || !hasActive) return;
    const timer = window.setInterval(() => {
      setFiles((current) =>
        current.map((file) => {
          if (file.done) return file;
          const progress = Math.min(100, file.progress + STEP);
          return { ...file, progress, done: progress >= 100 };
        }),
      );
    }, TICK);
    return () => window.clearInterval(timer);
  }, [compact, reduced, hasActive]);

  const openPicker = useCallback(() => inputRef.current?.click(), []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      addFiles(event.dataTransfer.files);
    },
    [addFiles],
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current += 1;
    setDragging(true);
  }, []);

  const onDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  }, []);

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  const zoneTone = dragging
    ? 'border-violet-500 bg-violet-500/10 ' +
      (reduced ? '' : 'scale-[1.01] ')
    : 'border-border hover:border-violet-500/50 hover:bg-muted/40';

  // --- Compact card: static, nothing tabbable, no drop handlers. ---
  if (compact) {
    const sample: DropFile = { ...SAMPLES[0], id: 0 };
    return (
      <div className={'flex h-full w-full items-center justify-center p-3 ' + (className ?? '')}>
        <div
          className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-card-foreground [touch-action:pan-y]"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-5 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-300">
            <UploadIcon className="size-5" />
          </span>
          <p className="text-sm font-medium text-foreground">
            Drop files, or{' '}
            <span className="text-violet-600 dark:text-violet-300">browse</span>
          </p>
          <p className="text-xs text-muted-foreground">PNG, PDF, ZIP up to 25 MB</p>
        </div>
          <ul className="flex flex-col gap-2">
            <FileRow
              file={sample}
              labelId={`${uid}-card`}
              interactive={false}
            />
          </ul>
        </div>
      </div>
    );
  }

  // --- Full interactive dropzone. ---
  return (
    <section
      className={
        'mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm ' +
        (className ?? '')
      }
      aria-label="File upload"
    >
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload files: drop them here, or activate to browse"
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPicker();
          }
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        className={
          'group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-9 text-center transition-all duration-200 ease-out ' +
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-card ' +
          'motion-reduce:transition-none motion-reduce:transform-none ' +
          zoneTone
        }
      >
        <span
          className={
            'flex size-12 items-center justify-center rounded-full bg-violet-500/10 text-violet-600 transition-transform duration-200 dark:text-violet-300 ' +
            (dragging && !reduced ? 'scale-110' : '') +
            ' motion-reduce:transform-none'
          }
        >
          <UploadIcon className="size-6" />
        </span>
        <span>
          <span className="block text-sm font-semibold text-foreground">
            {dragging ? 'Release to upload' : 'Drag and drop files here'}
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">
            or{' '}
            <span className="font-medium text-violet-600 underline-offset-2 group-hover:underline dark:text-violet-300">
              browse
            </span>{' '}
            to choose
          </span>
        </span>
        <span className="text-xs text-muted-foreground">PNG, PDF, ZIP up to 25 MB</span>
        <label htmlFor={`${uid}-input`} className="sr-only">
          Choose files to upload
        </label>
        <input
          ref={inputRef}
          id={`${uid}-input`}
          type="file"
          multiple
          className="sr-only"
          // The label and the zone both open the picker; the native control stays
          // out of the click path so a drop on the zone is not intercepted by it.
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => {
            addFiles(event.target.files);
            // Let the same file be chosen twice in a row.
            event.target.value = '';
          }}
        />
      </div>

      {files.length > 0 && (
        <>
          <ul className="flex flex-col gap-2">
            {files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                labelId={`${uid}-file-${file.id}`}
                onRemove={removeFile}
                interactive
              />
            ))}
          </ul>
          <p className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
            <span>
              {files.length} {files.length === 1 ? 'file' : 'files'}
            </span>
            <span className="tabular-nums">{formatSize(totalSize)} total</span>
          </p>
        </>
      )}
    </section>
  );
}

export default FileDropzone;
