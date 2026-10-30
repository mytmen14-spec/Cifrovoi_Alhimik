import { saveAs } from 'file-saver';
import { renderFrame, W, H } from './videoRenderer';

export type ExportStatus = {
  state: 'idle' | 'rendering' | 'encoding' | 'done' | 'error';
  progress: number;
  message: string;
  format: 'webm';
  blobUrl?: string; // For fallback download methods
  blob?: Blob; // Direct blob reference for most reliable download
};

export type StatusCallback = (status: ExportStatus) => void;

const FPS = 30;
const DURATION = 60;
const TOTAL_FRAMES = FPS * DURATION;

// ============ MAIN EXPORT FUNCTION ============

export async function exportVideo(onStatus: StatusCallback): Promise<void> {
  let blobUrl: string | null = null;

  try {
    onStatus({ state: 'rendering', progress: 0, message: 'Инициализация...', format: 'webm' });

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    canvas.style.position = 'fixed';
    canvas.style.top = '-9999px';
    canvas.style.left = '-9999px';
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d', { alpha: false })!;
    
    // Fill first frame
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, W, H);
    renderFrame(ctx, 0);

    // Get stream from canvas
    const stream = canvas.captureStream(FPS);
    
    // Find supported mime type
    const mimeTypes = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];
    
    let mimeType = '';
    for (const mt of mimeTypes) {
      try {
        if (MediaRecorder.isTypeSupported(mt)) {
          mimeType = mt;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!mimeType) {
      throw new Error('Ваш браузер не поддерживает запись видео');
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
    recorder.start(100);

    // Render all frames
    onStatus({ state: 'rendering', progress: 10, message: 'Рендеринг кадров (~60 сек)...', format: 'webm' });

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

      // Yield to browser every 10 frames
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

    onStatus({ state: 'encoding', progress: 95, message: 'Сохранение файла...', format: 'webm' });

    // Create blob URL for fallback methods
    blobUrl = URL.createObjectURL(blob);

    // Try multiple download methods
    let downloadSuccess = false;

    // Method 1: file-saver (most reliable)
    try {
      saveAs(blob, 'cyber_alchemy_intro.webm');
      downloadSuccess = true;
      console.log('✅ Method 1 (file-saver): Success');
    } catch (err) {
      console.warn('⚠️ Method 1 (file-saver) failed:', err);
    }

    // Method 2: Standard anchor download
    if (!downloadSuccess) {
      try {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'cyber_alchemy_intro.webm';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
        }, 100);
        downloadSuccess = true;
        console.log('✅ Method 2 (anchor download): Success');
      } catch (err) {
        console.warn('⚠️ Method 2 (anchor download) failed:', err);
      }
    }

    // Method 3: Open in new tab (fallback)
    if (!downloadSuccess) {
      try {
        const newWindow = window.open(blobUrl, '_blank');
        if (newWindow) {
          downloadSuccess = true;
          console.log('✅ Method 3 (new tab): Opened. User can right-click and save.');
          onStatus({ 
            state: 'done', 
            progress: 100, 
            message: 'Видео открыто в новой вкладке. Нажмите ПКМ → "Сохранить видео как..."', 
            format: 'webm',
            blobUrl: blobUrl
          });
          return;
        }
      } catch (err) {
        console.warn('⚠️ Method 3 (new tab) failed:', err);
      }
    }

    // Store blob for later download attempts
    const finalStatus: ExportStatus = {
      state: 'done',
      progress: 100,
      message: downloadSuccess ? 'Готово! Файл скачивается...' : 'Нажмите кнопку чтобы скачать',
      format: 'webm',
      blobUrl: blobUrl || undefined,
      blob: blob
    };
    
    onStatus(finalStatus);

  } catch (err: any) {
    console.error('❌ Export error:', err);
    
    // Cleanup blob URL if exists
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }
    
    onStatus({
      state: 'error',
      progress: 0,
      message: `Ошибка: ${err.message || 'Неизвестная ошибка'}`,
      format: 'webm',
    });
  }
}

// Fallback download function - can be called manually
export function downloadFromUrl(blobUrl: string, filename: string = 'cyber_alchemy_intro.webm'): void {
  console.log('📥 Attempting download from URL:', blobUrl.substring(0, 50) + '...');
  
  try {
    // Method 1: file-saver
    fetch(blobUrl)
      .then(response => response.blob())
      .then(blob => {
        console.log('✅ Got blob, size:', blob.size, 'bytes');
        try {
          saveAs(blob, filename);
          console.log('✅ file-saver: Success');
        } catch (saveErr) {
          console.warn('⚠️ file-saver failed, trying anchor:', saveErr);
          // Method 2: anchor with download attribute
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename;
          a.target = '_blank';
          a.rel = 'noopener';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      })
      .catch((err) => {
        console.error('❌ Fetch failed:', err);
        // Method 3: open in new tab
        window.open(blobUrl, '_blank');
      });
  } catch (err) {
    console.error('❌ Download failed:', err);
    window.open(blobUrl, '_blank');
  }
}

// Direct blob download - most reliable method
export function downloadBlob(blob: Blob, filename: string = 'cyber_alchemy_intro.webm'): void {
  console.log('📥 Direct blob download, size:', blob.size, 'bytes');
  
  try {
    saveAs(blob, filename);
    console.log('✅ saveAs: Success');
  } catch (err) {
    console.warn('⚠️ saveAs failed, trying alternatives:', err);
    
    // Try anchor method
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    
    // Try click
    try {
      a.click();
      console.log('✅ Anchor click: Success');
    } catch (clickErr) {
      console.warn('⚠️ Anchor click failed, opening in new tab');
      window.open(url, '_blank');
    }
    
    // Cleanup after delay
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 5000);
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

export function getExportFormat(): 'webm' {
  return 'webm';
}
