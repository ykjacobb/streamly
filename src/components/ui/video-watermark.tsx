import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "./slider";
import { Input } from "./input";
import { Button } from "./button";
import { toast } from "sonner";

interface Position {
  x: number;
  y: number;
}

interface VideoWatermarkProps {
  videoSrc: string;
  watermarkFile?: File;
  onWatermarkChange: (file: File | undefined) => void;
  onPositionChange: (position: Position) => void;
  onOpacityChange: (opacity: number) => void;
}

export function VideoWatermark({
  videoSrc,
  watermarkFile,
  onWatermarkChange,
  onPositionChange,
  onOpacityChange,
}: VideoWatermarkProps) {
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [opacity, setOpacity] = useState(0.7);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [watermarkPreview, setWatermarkPreview] = useState<string>("");

  useEffect(() => {
    if (watermarkFile) {
      const url = URL.createObjectURL(watermarkFile);
      setWatermarkPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watermarkFile]);

  const validateAspectRatio = (width: number, height: number) => {
    // Allow small deviation from exact 16:9 due to potential rounding
    const aspectRatio = width / height;
    const targetRatio = 16 / 9;
    const tolerance = 0.01; // 1% tolerance
    
    return Math.abs(aspectRatio - targetRatio) <= tolerance;
  };

  const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        if (validateAspectRatio(img.width, img.height)) {
          onWatermarkChange(file);
        } else {
          toast.error("Please upload a 16:9 aspect ratio image");
          e.target.value = "";
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleDrag = (event: any, info: any) => {
    if (containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const newX = (info.point.x - container.left) / container.width * 100;
      const newY = (info.point.y - container.top) / container.height * 100;
      
      const boundedX = Math.max(0, Math.min(100, newX));
      const boundedY = Math.max(0, Math.min(100, newY));
      
      updatePosition(boundedX, boundedY);
    }
  };

  const handleOpacityChange = (value: number[]) => {
    const newOpacity = value[0];
    setOpacity(newOpacity);
    onOpacityChange(newOpacity);
  };

  const updatePosition = (x: number, y: number) => {
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));
    
    setPosition({ x: boundedX, y: boundedY });
    onPositionChange({ x: boundedX, y: boundedY });
  };

  const handleManualPositionChange = (axis: 'x' | 'y', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updatePosition(
        axis === 'x' ? numValue : position.x,
        axis === 'y' ? numValue : position.y
      );
    }
  };

  const centerHorizontally = () => {
    updatePosition(50, position.y);
  };

  const centerVertically = () => {
    updatePosition(position.x, 50);
  };

  const centerBoth = () => {
    updatePosition(50, 50);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleWatermarkUpload}
          className="hidden"
          id="watermark-upload"
        />
        <label
          htmlFor="watermark-upload"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
        >
          Upload Watermark
        </label>
        {watermarkFile && (
          <span className="text-sm text-muted-foreground">
            {watermarkFile.name}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Opacity</label>
          <Slider
            defaultValue={[0.7]}
            max={1}
            step={0.1}
            value={[opacity]}
            onValueChange={handleOpacityChange}
          />
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">X Position (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={position.x.toFixed(1)}
                onChange={(e) => handleManualPositionChange('x', e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Y Position (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={position.y.toFixed(1)}
                onChange={(e) => handleManualPositionChange('y', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={centerHorizontally}
            >
              Center X
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={centerVertically}
            >
              Center Y
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={centerBoth}
            >
              Center Both
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-contain"
          controls
        />
        
        <AnimatePresence>
          {watermarkPreview && (
            <motion.div
              drag
              dragMomentum={false}
              dragElastic={0}
              onDrag={handleDrag}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: opacity }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: "translate(-50%, -50%)",
                cursor: isDragging ? "grabbing" : "grab",
                maxWidth: "30%",
                maxHeight: "30%",
              }}
            >
              <img
                src={watermarkPreview}
                alt="Watermark"
                className="w-full h-full object-contain pointer-events-none"
                style={{ opacity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 