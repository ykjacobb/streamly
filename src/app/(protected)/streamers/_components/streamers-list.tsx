"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addStreamer, removeStreamer, getStreamers } from "@/lib/actions/streamer";
import { ExternalLink } from "lucide-react";
import { SocialIcon } from "react-social-icons";
import { cn } from "@/lib/utils";
import { TrashSolid } from "iconoir-react";

const PLATFORMS = [
  { value: "twitch", label: "Twitch" },
] as const;

type Platform = typeof PLATFORMS[number]["value"];

type StreamFilter = "all" | "live" | "offline";

type Streamer = {
  id: string;
  platform: string;
  username: string;
  isLive: boolean;
};

interface StreamersListProps {
  initialStreamers: Streamer[];
  userId: string;
}

function getStreamUrl(platform: string, username: string) {
  switch (platform.toLowerCase()) {
    case 'twitch':
      return `https://twitch.tv/${username}`;
    default:
      return '';
  }
}

function StreamEmbed({ platform, username }: { platform: string; username: string }) {
  switch (platform.toLowerCase()) {
    case 'twitch':
      return (
        <div className="aspect-video w-full">
          <iframe
            src={`https://player.twitch.tv/?channel=${username}&parent=${window.location.hostname}&muted=true`}
            height="100%"
            width="100%"
            allowFullScreen
          />
        </div>
      );
    default:
      return null;
  }
}

export default function StreamersList({ initialStreamers, userId }: StreamersListProps) {
  const [streamers, setStreamers] = useState(initialStreamers);
  const [newStreamer, setNewStreamer] = useState({
    platform: "twitch" as Platform,
    username: "",
  });
  const [streamFilter, setStreamFilter] = useState<StreamFilter>("all");

  // Update streamers list every minute
  useEffect(() => {
    const updateInterval = setInterval(async () => {
      try {
        const updatedStreamers = await getStreamers(userId);
        setStreamers(updatedStreamers);
      } catch (error) {
        console.error("Error updating streamers:", error);
      }
    }, 60000); // 1 minute

    return () => clearInterval(updateInterval);
  }, [userId]);

  const handleAddStreamer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addStreamer(userId, newStreamer.platform, newStreamer.username);
      // Get fresh data after adding
      const updatedStreamers = await getStreamers(userId);
      setStreamers(updatedStreamers);
      setNewStreamer({ ...newStreamer, username: "" });
    } catch (error) {
      console.error("Error adding streamer:", error);
    }
  };

  const handleRemoveStreamer = async (streamerId: string) => {
    try {
      await removeStreamer(streamerId, userId);
      // Optimistically remove the streamer
      setStreamers((prev) => prev.filter((s) => s.id !== streamerId));
    } catch (error) {
      console.error("Error removing streamer:", error);
      // If error, refresh the list
      const updatedStreamers = await getStreamers(userId);
      setStreamers(updatedStreamers);
    }
  };

  const liveStreamers = streamers.filter((s) => s.isLive);

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList className="bg-gray-100 dark:bg-zinc-900">
        <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-400/20">All Streamers</TabsTrigger>
        <TabsTrigger value="live" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-400/20">Live Now ({liveStreamers.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {/* Add Streamer Form */}
        <form onSubmit={handleAddStreamer} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <Select
                value={newStreamer.platform}
                onValueChange={(value: Platform) =>
                  setNewStreamer({ ...newStreamer, platform: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <div className="flex gap-2">
                <Input
                  value={newStreamer.username}
                  onChange={(e) =>
                    setNewStreamer({ ...newStreamer, username: e.target.value })
                  }
                  placeholder="Enter username"
                />
                <Button type="submit">Add</Button>
              </div>
            </div>
          </div>
        </form>

        {/* Streamers List */}
        <div className="space-y-2">
          {streamers.map((streamer) => (
            <div
              key={streamer.id}
              className={cn(
                "flex items-center justify-between p-3 border rounded-lg",
                streamer.isLive ? "bg-white dark:bg-zinc-900" : "bg-gray-50 dark:bg-zinc-900/50"
              )}
            >
              <div className="flex items-center gap-3">
                <SocialIcon
                  network={streamer.platform}
                  style={{ width: 32, height: 32 }}
                />
                <div>
                  <div className="font-medium">{streamer.username}</div>
                  <div className="text-sm text-gray-500">
                    {streamer.platform}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className={cn(
                      "w-2 h-2 rounded-full animate-pulse",
                      streamer.isLive ? "bg-emerald-500" : "bg-red-500"
                    )}
                  />
                  <span 
                    className={cn(
                      "text-sm",
                      streamer.isLive ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {streamer.isLive ? "Live" : "Offline"}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveStreamer(streamer.id)}
              >
                <TrashSolid className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {streamers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No streamers added yet
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="live" className="space-y-4">
        {/* Filter Select */}
        <div className="flex justify-end">
          <Select
            value={streamFilter}
            onValueChange={(value: StreamFilter) => setStreamFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter streams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Show All</SelectItem>
              <SelectItem value="live">Show Live Only</SelectItem>
              <SelectItem value="offline">Show Offline Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Live Streamers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {streamers
            .filter(streamer => {
              switch (streamFilter) {
                case "live":
                  return streamer.isLive;
                case "offline":
                  return !streamer.isLive;
                default:
                  return true;
              }
            })
            .map((streamer) => (
              <div
                key={streamer.id}
                className={cn(
                  "border rounded-lg overflow-hidden",
                  streamer.isLive ? "bg-white dark:bg-zinc-900" : "bg-gray-50 dark:bg-zinc-900/50"
                )}
              >
                {/* Stream header */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <SocialIcon
                      network={streamer.platform}
                      style={{ width: 32, height: 32 }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{streamer.username}</div>
                      <div className="text-sm text-gray-500 truncate">
                        {streamer.platform}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div 
                        className={cn(
                          "w-2 h-2 rounded-full animate-pulse",
                          streamer.isLive ? "bg-emerald-500" : "bg-red-500"
                        )}
                      />
                      <span 
                        className={cn(
                          "text-sm",
                          streamer.isLive ? "text-emerald-500" : "text-red-500"
                        )}
                      >
                        {streamer.isLive ? "Live" : "Offline"}
                      </span>
                    </div>
                  </div>
                  <a
                    href={getStreamUrl(streamer.platform, streamer.username)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 ml-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                {/* Stream embed or offline state */}
                {streamer.isLive ? (
                  <StreamEmbed
                    platform={streamer.platform}
                    username={streamer.username}
                  />
                ) : (
                  <div className="aspect-video w-full bg-gray-100 dark:bg-zinc-900/50 flex items-center justify-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      Stream is offline
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
        {streamers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No streamers added yet
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
