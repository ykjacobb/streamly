"use client";

import { useState } from "react";
import { VideoWatermark } from "@/components/ui/video-watermark";
import { applyWatermark } from "@/lib/ffmpeg";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function WatermarkPage() {
    const [videoFile, setVideoFile] = useState<File>();
    const [watermarkFile, setWatermarkFile] = useState<File>();
    const [videoPreview, setVideoPreview] = useState<string>("");
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [opacity, setOpacity] = useState(0.7);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedVideoUrl, setProcessedVideoUrl] = useState<string>();

    const validateVideoAspectRatio = (width: number, height: number) => {
        const aspectRatio = width / height;
        const targetRatio = 16 / 9;
        const tolerance = 0.01; // 1% tolerance
        return Math.abs(aspectRatio - targetRatio) <= tolerance;
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create video element to check dimensions
            const video = document.createElement('video');
            video.preload = 'metadata';

            video.onloadedmetadata = () => {
                URL.revokeObjectURL(video.src);
                if (validateVideoAspectRatio(video.videoWidth, video.videoHeight)) {
                    setVideoFile(file);
                    setVideoPreview(URL.createObjectURL(file));
                } else {
                    toast.error("Please upload a 16:9 aspect ratio video");
                    e.target.value = "";
                }
            };

            video.src = URL.createObjectURL(file);
        }
    };

    const handleExport = async () => {
        if (!videoFile || !watermarkFile) return;

        try {
            setIsProcessing(true);
            const processedVideo = await applyWatermark(videoFile, watermarkFile, {
                position,
                opacity,
            });

            // Create URL for the processed video
            const processedUrl = URL.createObjectURL(processedVideo);
            setProcessedVideoUrl(processedUrl);

            // Create download link
            const a = document.createElement("a");
            a.href = processedUrl;
            a.download = `watermarked_${videoFile.name}`;
            a.click();

            toast.success("Video processed successfully!");
        } catch (error) {
            console.error("Error processing video:", error);
            toast.error(error instanceof Error ? error.message : "Error processing video");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Video Watermark Tool</h1>
                <p className="text-muted-foreground mt-2">
                    Add a watermark to your 16:9 video with customizable position and opacity
                </p>
            </div>

            <div className="space-y-4">
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                />
                <label
                    htmlFor="video-upload"
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
                >
                    Upload Video
                </label>
                {videoFile && (
                    <span className="ml-4 text-sm text-muted-foreground">
                        {videoFile.name}
                    </span>
                )}
            </div>

            {videoPreview && (
                <div className="space-y-6">
                    <VideoWatermark
                        videoSrc={videoPreview}
                        watermarkFile={watermarkFile}
                        onWatermarkChange={setWatermarkFile}
                        onPositionChange={setPosition}
                        onOpacityChange={setOpacity}
                    />

                    <Button
                        onClick={handleExport}
                        disabled={!watermarkFile || isProcessing}
                        className="w-full sm:w-auto"
                    >
                        {isProcessing ? "Processing..." : "Export Video with Watermark"}
                    </Button>
                </div>
            )}

            {processedVideoUrl && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Preview</h2>
                    <video
                        src={processedVideoUrl}
                        controls
                        className="w-full aspect-video rounded-lg bg-black"
                    />
                </div>
            )}
        </div>
    );
} 