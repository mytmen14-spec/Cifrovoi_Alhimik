import { renderFrame, W, H } from './videoRenderer';

export type ExportStatus = {
  state: 'idle' | 'rendering' | 'encoding' | 'done' | 'error';
  progress: number; // 0-100
  message: string;
  format: 'mp4' | 'webm';
};

export type StatusCallback = (status: ExportStatus) => void;

const FPS = 30;
const DURATION = 60; // seconds
const TOTAL_FRAMES = FPS * DURATION;

function checkWebCodecsSupport(): boolean {
  return typeof (window as any).VideoEncoder !== 'undefined';
}

// ============ MP4 EXPORT (WebCodecs + mp4-muxer) ============

async function exportMP4(onStatus: StatusCallback): Promise<Blob> {
  const { Muxer, ArrayBufferTarget } = await import('mp4-muxer');
  
  const target = new ArrayBufferTarget();
  const muxer = new Muxer({
    target,
    video: {
      codec: 'avc',
      width: W,
      height: H,
    },
    fastStart: 'in-memory',
  });

  const encoder = new (window as any).VideoEncoder({
    output: (chunk: any, meta: any) => muxer.addVideoChunk(chunk, meta),
    error: (e: any) => {
      onStatus({ state: 'error', progress: 0, message: `Encoder error: ${e.message}`, format: 'mp4' });
    },
  });

  encoder.configure({
    codec: 'avc1.42001f',
    width: W,
    height: H,
    bitrate: 4_000_000,
    framerate: FPS,
  });

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  onStatus({ state: 'rendering', progress: 0, message: 'Рендеринг кадров...', format: 'mp4' });

  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const time = frame / FPS;
    renderFrame(ctx, time);

    const timestamp = Math.round((frame / FPS) * 1_000_000);
    const videoFrame = new VideoFrame(canvas, { timestamp });
    
    const keyFrame = frame % (FPS * 2) === 0; // Keyframe every 2 seconds
    encoder.encode(videoFrame, { keyFrame });
    videoFrame.close();

    if (frame % 30 === 0) {
      const progress = Math.round((frame / TOTAL_FRAMES) * 80);
      onStatus({ state: 'rendering', progress, message: `Кадр ${frame}/${TOTAL_FRAMES}`, format: 'mp4' });
      // Yield to main thread
      await new Promise(r => setTimeout(r, 0));
    }
  }

  onStatus({ state: 'encoding', progress: 85, message: 'Кодирование MP4...', format: 'mp4' });
  
  await encoder.flush();
  encoder.close();
  muxer.finalize();

  const buffer = target.buffer;
  const blob = new Blob([buffer], { type: 'video/mp4' });
  
  onStatus({ state: 'done', progress: 100, message: 'Готово!', format: 'mp4' });
  return blob;
}

// ============ WEBM EXPORT (MediaRecorder fallback) ============

async function exportWebM(onStatus: StatusCallback): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const stream = canvas.captureStream(FPS);
  
  // Try to find best supported mime type
  const mimeTypes = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  let mimeType = '';
  for (const mt of mimeTypes) {
    if (MediaRecorder.isTypeSupported(mt)) {
      mimeType = mt;
      break;
    }
  }

  const recorder = new MediaRecorder(stream, {
    mimeType: mimeType || undefined,
    videoBitsPerSecond: 4_000_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const recordingDone = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
      resolve(blob);
    };
  });

  recorder.start(1000); // Collect data every second

  onStatus({ state: 'rendering', progress: 0, message: 'Рендеринг кадров...', format: 'webm' });

  const startTime = performance.now();
  const frameDuration = 1000 / FPS;

  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const time = frame / FPS;
    renderFrame(ctx, time);

    if (frame % 30 === 0) {
      const progress = Math.round((frame / TOTAL_FRAMES) * 90);
      onStatus({ state: 'rendering', progress, message: `Кадр ${frame}/${TOTAL_FRAMES}`, format: 'webm' });
      // Yield to main thread
      await new Promise(r => setTimeout(r, 0));
    }

    // Pace rendering to match real-time for MediaRecorder
    const expectedTime = startTime + frame * frameDuration;
    const now = performance.now();
    if (expectedTime > now) {
      await new Promise(r => setTimeout(r, expectedTime - now));
    }
  }

  onStatus({ state: 'encoding', progress: 95, message: 'Финализация...', format: 'webm' });
  
  recorder.stop();
  stream.getTracks().forEach(t => t.stop());
  
  const blob = await recordingDone;
  onStatus({ state: 'done', progress: 100, message: 'Готово!', format: 'webm' });
  return blob;
}

// ============ MAIN EXPORT FUNCTION ============

export async function exportVideo(onStatus: StatusCallback): Promise<void> {
  try {
    let blob: Blob;
    
    if (checkWebCodecsSupport()) {
      blob = await exportMP4(onStatus);
    } else {
      onStatus({ state: 'rendering', progress: 0, message: 'WebCodecs не поддерживается, используем WebM...', format: 'webm' });
      blob = await exportWebM(onStatus);
    }

    // Download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
    a.download = `cyber_alchemy_intro.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (err: any) {
    onStatus({
      state: 'error',
      progress: 0,
      message: `Ошибка: ${err.message || 'Неизвестная ошибка'}`,
      format: 'mp4',
    });
  }
}

export function isExportSupported(): boolean {
  return checkWebCodecsSupport() || typeof MediaRecorder !== 'undefined';
}

export function getExportFormat(): 'mp4' | 'webm' {
  return checkWebCodecsSupport() ? 'mp4' : 'webm';
}
