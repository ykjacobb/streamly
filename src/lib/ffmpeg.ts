import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export async function getFFmpeg() {
  if (ffmpeg) {
    return ffmpeg;
  }

  ffmpeg = new FFmpeg();

  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL: await toBlobURL(
        `${window.location.protocol}//${window.location.host}/ffmpeg/ffmpeg-core.js`,
        'text/javascript',
      ),
      wasmURL: await toBlobURL(
        `${window.location.protocol}//${window.location.host}/ffmpeg/ffmpeg-core.wasm`,
        'application/wasm',
      ),
    });
  }

  return ffmpeg;
}

export async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.src = URL.createObjectURL(file);
  });
}

interface TrimOptions {
  startTime: number;
  endTime?: number;
}

export async function trimVideo(inputFile: File, options: TrimOptions): Promise<Blob> {
  const ffmpeg = await getFFmpeg();
  
  // Convert ArrayBuffer to Uint8Array
  const data = new Uint8Array(await inputFile.arrayBuffer());
  
  // Write the input file to FFmpeg's virtual file system
  await ffmpeg.writeFile('input.mp4', data);
  
  // Build FFmpeg command
  const args = [];

  // Add input options before input file
  if (options.startTime > 0) {
    args.push('-ss', options.startTime.toString());
  }
  
  // Add input file
  args.push('-i', 'input.mp4');

  // Add duration if end time is specified
  if (options.endTime) {
    const duration = options.endTime - options.startTime;
    args.push('-t', duration.toString());
  }

  // Add output options
  args.push(
    // Re-encode video (slower but more accurate than -c copy)
    '-c:v', 'libx264',  // Use H.264 codec
    '-c:a', 'aac',      // Use AAC for audio
    '-preset', 'ultrafast', // Fastest encoding
    '-crf', '23',       // Balance quality and size
    // Ensure keyframes at cut points
    '-force_key_frames', `expr:gte(t,${options.startTime})`,
    'output.mp4'
  );
  
  // Run FFmpeg command
  await ffmpeg.exec(args);
  
  // Read the output file
  const outputData = await ffmpeg.readFile('output.mp4');
  
  // Clean up
  await ffmpeg.deleteFile('input.mp4');
  await ffmpeg.deleteFile('output.mp4');
  
  // Convert the output to a Blob
  return new Blob([outputData], { type: 'video/mp4' });
} 