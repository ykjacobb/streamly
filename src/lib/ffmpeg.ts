import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

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
                "text/javascript"
            ),
            wasmURL: await toBlobURL(
                `${window.location.protocol}//${window.location.host}/ffmpeg/ffmpeg-core.wasm`,
                "application/wasm"
            )
        });
    }

    return ffmpeg;
}

export async function getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
        const video = document.createElement("video");
        video.preload = "metadata";

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
    await ffmpeg.writeFile("input.mp4", data);

    // Build FFmpeg command
    const args = [];

    // Add input options before input file
    if (options.startTime > 0) {
        args.push("-ss", options.startTime.toString());
    }

    // Add input file
    args.push("-i", "input.mp4");

    // Add duration if end time is specified
    if (options.endTime) {
        const duration = options.endTime - options.startTime;
        args.push("-t", duration.toString());
    }

    // Add output options
    args.push(
        // Re-encode video (slower but more accurate than -c copy)
        "-c:v",
        "libx264", // Use H.264 codec
        "-c:a",
        "aac", // Use AAC for audio
        "-preset",
        "ultrafast", // Fastest encoding
        "-crf",
        "23", // Balance quality and size
        // Ensure keyframes at cut points
        "-force_key_frames",
        `expr:gte(t,${options.startTime})`,
        "output.mp4"
    );

    // Run FFmpeg command
    await ffmpeg.exec(args);

    // Read the output file
    const outputData = await ffmpeg.readFile("output.mp4");

    // Clean up
    await ffmpeg.deleteFile("input.mp4");
    await ffmpeg.deleteFile("output.mp4");

    // Convert the output to a Blob
    return new Blob([outputData], { type: "video/mp4" });
}

interface WatermarkOptions {
    position: {
        x: number;
        y: number;
    };
    opacity: number;
}

export async function applyWatermark(
    videoFile: File,
    watermarkFile: File,
    options: WatermarkOptions
): Promise<Blob> {
    const ffmpeg = await getFFmpeg();

    try {
        // Write input files to FFmpeg's virtual filesystem
        await ffmpeg.writeFile("input.mp4", new Uint8Array(await videoFile.arrayBuffer()));
        await ffmpeg.writeFile("watermark.png", new Uint8Array(await watermarkFile.arrayBuffer()));

        // Get video dimensions first
        const args1 = [
            "-i", "input.mp4",
            "-v", "error",
            "-select_streams", "v:0",
            "-show_entries", "stream=width,height",
            "-of", "csv=s=x:p=0",
        ];
        
        await ffmpeg.exec(args1);
        const dimensionsData = await ffmpeg.readFile("out.txt");
        const dimensions = new TextDecoder().decode(dimensionsData).trim().split('x');
        const videoWidth = parseInt(dimensions[0]);
        const videoHeight = parseInt(dimensions[1]);

        // Validate 16:9 aspect ratio
        const aspectRatio = videoWidth / videoHeight;
        const targetRatio = 16 / 9;
        const tolerance = 0.01; // 1% tolerance

        if (Math.abs(aspectRatio - targetRatio) > tolerance) {
            throw new Error("Video must have a 16:9 aspect ratio");
        }

        // Calculate watermark size and position
        const watermarkWidth = Math.round(videoWidth * 0.3); // 30% of video width
        const xPos = Math.round((videoWidth * options.position.x / 100) - (watermarkWidth / 2));
        const yPos = Math.round((videoHeight * options.position.y / 100) - (watermarkWidth * 9/16 / 2));

        // Build FFmpeg command for watermark overlay
        const args2 = [
            // Input video
            "-i", "input.mp4",
            // Input watermark
            "-i", "watermark.png",
            // Filter complex for watermark overlay
            "-filter_complex",
            [
                // Scale watermark maintaining aspect ratio
                `[1:v]scale=${watermarkWidth}:-1`,
                // Apply opacity
                `[watermark];[watermark]format=rgba,colorchannelmixer=aa=${options.opacity}`,
                // Overlay with exact pixel positions
                `[watermark1];[0:v][watermark1]overlay=${xPos}:${yPos}`
            ].join(","),
            // Video codec
            "-c:v", "libx264",
            // Audio codec (copy from input)
            "-c:a", "aac",
            // Preset for encoding speed
            "-preset", "ultrafast",
            // Output quality
            "-crf", "23",
            // Output file
            "output.mp4"
        ];

        // Execute FFmpeg command
        await ffmpeg.exec(args2);

        // Read the output file
        const outputData = await ffmpeg.readFile("output.mp4");

        // Clean up
        await ffmpeg.deleteFile("input.mp4");
        await ffmpeg.deleteFile("watermark.png");
        await ffmpeg.deleteFile("output.mp4");
        await ffmpeg.deleteFile("out.txt");

        // Return the processed video as a Blob
        return new Blob([outputData], { type: "video/mp4" });
    } catch (error) {
        // Clean up on error
        try {
            await ffmpeg.deleteFile("input.mp4");
            await ffmpeg.deleteFile("watermark.png");
            await ffmpeg.deleteFile("output.mp4");
            await ffmpeg.deleteFile("out.txt");
        } catch {} // Ignore cleanup errors
        
        throw error; // Re-throw the original error
    }
}
