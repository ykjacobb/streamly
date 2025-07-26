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
import { Trash2 } from "lucide-react";
import { SocialIcon } from "react-social-icons";

const PLATFORMS = [
  { value: "twitch", label: "Twitch" },
] as const;

type Platform = typeof PLATFORMS[number]["value"];

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

export default function StreamersList({ initialStreamers, userId }: StreamersListProps) {
  const [streamers, setStreamers] = useState(initialStreamers);
  const [newStreamer, setNewStreamer] = useState({
    platform: "twitch" as Platform,
    username: "",
  });

  // Poll for updates every 30 seconds
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const updatedStreamers = await getStreamers(userId);
        // Update only the streamers that have changed
        setStreamers(prev => {
          const hasChanges = updatedStreamers.some((updated: Streamer, index: number) => {
            const current = prev[index];
            return !current || 
              current.id !== updated.id || 
              current.isLive !== updated.isLive;
          });
          
          return hasChanges ? updatedStreamers : prev;
        });
      } catch (error) {
        console.error("Error polling streamers:", error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(pollInterval);
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
    }
  };

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">All Streamers</TabsTrigger>
        <TabsTrigger value="live">Live Now</TabsTrigger>
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
              className="flex items-center justify-between p-3 border rounded-lg"
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
                {streamer.isLive && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm text-red-500">Live</span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveStreamer(streamer.id)}
              >
                <Trash2 className="h-4 w-4" />
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
        {/* Live Streamers */}
        <div className="space-y-2">
          {streamers
            .filter((s) => s.isLive)
            .map((streamer) => (
              <div
                key={streamer.id}
                className="flex items-center justify-between p-3 border rounded-lg"
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
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm text-red-500">Live</span>
                </div>
              </div>
            ))}
          {streamers.filter((s) => s.isLive).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No streamers are currently live
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
} 