import { renderFrame, W, H } from './videoRenderer';

export type ExportStatus = {
  state: 'idle' | 'rendering' | 'encoding' | 'done' | 'error';
  progress: number; // 0-100
  message: string;
  format: 'mp4' | 'webm';
};

export type StatusCallback = (status: ExportStatus) => void;

const FPS = 30;
const DURATION = 60;
const TOTAL_FRAMES = FPS * DURATION;

// ============ SIMPLIFIED EXPORT VIA MediaRecorder ============

export async function exportVideo(onStatus: StatusCallback): Promise<void> {
  try {
    onStatus({ state: 'rendering', progress: 0, message: 'Инициализация...', format: 'webm' });

    // Create canvas and add to DOM (required for captureStream to work reliably)
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    canvas.style.position = 'fixed';
    canvas.style.top = '-9999px';
    canvas.style.left = '-9999px';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d', { alpha: false })!;
    
    // Fill first frame
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, W, H);

    // Get stream from canvas
    const stream = canvas.captureStream(FPS);
    
    // Find supported mime type
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
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

    if (!mimeType) {
      throw new Error('MediaRecorder не поддерживает видео');
    }

    onStatus({ state: 'rendering', progress: 5, message: 'Запуск записи...', format: 'webm' });

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 5_000_000,
    });

    const chunks: Blob[] = [];
    
    const recordingPromise = new Promise<Blob>((resolve, reject) => {
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        try {
          const blob = new Blob(chunks, { type: mimeType });
          resolve(blob);
        } catch (err) {
          reject(err);
        }
      };

      recorder.onerror = (e) => {
        reject(new Error('Ошибка записи'));
      };
    });

    // Start recording
    recorder.start(100); // Collect data every 100ms

    // Render all frames
    onStatus({ state: 'rendering', progress: 10, message: 'Рендеринг кадров (это займёт ~60 сек)...', format: 'webm' });

    for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
      const time = frame / FPS;
      renderFrame(ctx, time);

      // Update progress every 30 frames (1 second of video)
      if (frame % 30 === 0) {
        const progress = 10 + Math.round((frame / TOTAL_FRAMES) * 80);
        const seconds = Math.floor(frame / FPS);
        onStatus({ 
          state: 'rendering', 
          progress, 
          message: `Рендеринг: ${seconds}/${DURATION} сек`, 
          format: 'webm' 
        });
      }

      // Yield to browser every 10 frames to keep UI responsive
      if (frame % 10 === 0) {
        await new Promise(r => setTimeout(r, 0));
      }
    }

    onStatus({ state: 'encoding', progress: 92, message: 'Финализация видео...', format: 'webm' });

    // Stop recording
    recorder.stop();
    stream.getTracks().forEach(t => t.stop());

    // Wait for recording to finish
    const blob = await recordingPromise;

    // Clean up canvas
    document.body.removeChild(canvas);

    onStatus({ state: 'encoding', progress: 96, message: 'Сохранение файла...', format: 'webm' });

    // Download the file
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cyber_alchemy_intro.webm';
    a.style.display = 'none';
    document.body.appendChild(a);
    
    // Trigger download
    setTimeout(() => {
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
    }, 100);

    onStatus({ state: 'done', progress: 100, message: 'Готово! Файл скачивается...', format: 'webm' });

  } catch (err: any) {
    console.error('Export error:', err);
    onStatus({
      state: 'error',
      progress: 0,
      message: `Ошибка: ${err.message || 'Неизвестная ошибка'}`,
      format: 'webm',
    });
  }
}

export function isExportSupported(): boolean {
  const hasMediaRecorder = typeof MediaRecorder !== 'undefined';
  const hasCaptureStream = typeof HTMLCanvasElement.prototype.captureStream === 'function';
  const supported = hasMediaRecorder && hasCaptureStream;
  
  if (!supported) {
    console.warn('⚠️ Video export not supported:', {
      MediaRecorder: hasMediaRecorder,
      captureStream: hasCaptureStream,
    });
  }
  
  return supported;
}

export function getExportFormat(): 'mp4' | 'webm' {
  return 'webm';
}
