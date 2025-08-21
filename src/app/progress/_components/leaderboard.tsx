"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, TrendingUp } from "lucide-react";

type Row = {
  id: string;
  username: string | null;
  xp: number;
  level: number;
  avatarUrl: string | null;
};

export function LeaderboardCard() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/gamification/leaderboard?limit=50");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setItems(data.leaderboard || []);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Leaderboard</CardTitle>
        <CardDescription>Top performers</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {items.map((u, idx) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8">
                      {idx === 0 && (
                        <Crown className="h-6 w-6 text-yellow-500" />
                      )}
                      {idx === 1 && <Medal className="h-6 w-6 text-gray-400" />}
                      {idx === 2 && (
                        <Medal className="h-6 w-6 text-orange-600" />
                      )}
                      {idx > 2 && (
                        <span className="text-lg font-bold text-muted-foreground">
                          #{idx + 1}
                        </span>
                      )}
                    </div>
                    <Avatar>
                      <AvatarImage src={u.avatarUrl || undefined} />
                      <AvatarFallback>{(u.username || "U")[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{u.username || "User"}</p>
                      <p className="text-sm text-muted-foreground">
                        Level {u.level}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-bold">
                      {u.xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
