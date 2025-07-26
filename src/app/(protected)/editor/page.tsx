"use client";

import { useState, useRef } from "react";
import { trimVideo, getVideoDuration } from "@/lib/ffmpeg";
import { Loader2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function EditorPage() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [output, setOutput] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [trimValues, setTrimValues] = useState({
        start: "0",
        end: "0"
    });
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const url = URL.createObjectURL(file);
            setPreview(url);
            setOutput(null);

            try {
                const duration = await getVideoDuration(file);
                setDuration(duration);
                setTrimValues({
                    start: "0",
                    end: duration.toString()
                });
            } catch (error) {
                console.error("Error getting video duration:", error);
            }
        }
    };

    const handleTrim = async () => {
        if (!file) return;

        try {
            setProcessing(true);
            const trimmedVideo = await trimVideo(file, {
                startTime: parseFloat(trimValues.start) || 0,
                endTime: parseFloat(trimValues.end) || duration
            });
            const url = URL.createObjectURL(trimmedVideo);
            setOutput(url);
        } catch (error) {
            console.error("Error trimming video:", error);
        } finally {
            setProcessing(false);
        }
    };

    const handleInputChange = (type: "start" | "end", value: string) => {
        // Only allow numbers and decimal points
        if (!/^\d*\.?\d*$/.test(value)) return;

        const numValue = parseFloat(value);

        // Validate the range
        if (
            type === "start" &&
            !isNaN(numValue) && numValue >= 0 &&
            numValue < parseFloat(trimValues.end)
        ) {
            setTrimValues((prev) => ({ ...prev, start: value }));
            if (videoRef.current) {
                videoRef.current.currentTime = numValue;
            }
        } else if (
            type === "end" &&
            !isNaN(numValue) && numValue > parseFloat(trimValues.start) &&
            numValue <= duration
        ) {
            setTrimValues((prev) => ({ ...prev, end: value }));
            if (videoRef.current) {
                videoRef.current.currentTime = numValue;
            }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Video Editor</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Upload a video and trim it to your desired length.
                </p>
            </div>

            {/* Upload area */}
            <div className="border-2 border-dashed rounded-xl p-8 text-center">
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="video-upload"
                />
                <label
                    htmlFor="video-upload"
                    className="flex flex-col items-center gap-2 cursor-pointer"
                >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                        Click to upload a video
                    </span>
                    <span className="text-sm text-gray-500">MP4, WebM, or OGG</span>
                </label>
            </div>

            {/* Preview */}
            {preview && (
                <div className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                        <video
                            ref={videoRef}
                            src={preview}
                            controls
                            className="w-full h-full"
                        />
                    </div>

                    {/* Trim controls */}
                    <div className="space-y-6 p-6 border rounded-lg bg-white dark:bg-black">
                        <h3 className="font-semibold text-lg">Trim Video</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Start Time (seconds)</label>
                                <Input
                                    type="text"
                                    value={trimValues.start}
                                    onChange={(e) => handleInputChange("start", e.target.value)}
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">End Time (seconds)</label>
                                <Input
                                    type="text"
                                    value={trimValues.end}
                                    onChange={(e) => handleInputChange("end", e.target.value)}
                                    placeholder={duration.toString()}
                                />
                            </div>
                        </div>

                        <div className="text-sm text-gray-500">
                            Video duration: {duration.toFixed(2)} seconds
                        </div>

                        <button
                            onClick={handleTrim}
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Trim Video"
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Output */}
            {output && (
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Trimmed Video</h2>
                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                        <video
                            src={output}
                            controls
                            className="w-full h-full"
                        />
                    </div>
                    <a
                        href={output}
                        download="trimmed-video.mp4"
                        className="block w-full bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 text-center"
                    >
                        Download
                    </a>
                </div>
            )}
        </div>
    );
}
