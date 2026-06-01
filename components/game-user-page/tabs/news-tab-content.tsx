"use client";

import { Clock, Gamepad2, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";

type NewsTabContentProps = {
  isNewsLoading: boolean;
  newsData: Array<{ content: string; id: string; publishTime: string; title: string }>;
  translateGameTerms: (value: string) => string;
};

export function NewsTabContent({
  isNewsLoading,
  newsData,
  translateGameTerms,
}: NewsTabContentProps) {
  return (
    <TabsContent value="events" className="mt-0 focus-visible:outline-none pb-28">
      <Card className="glass-card mb-4 overflow-hidden border-0 shadow-sm">
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 to-blue-500" />
        <CardHeader className="border-b border-slate-100 bg-white pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
            <div className="rounded-lg border border-cyan-200 bg-cyan-100 p-2">
              <Gamepad2 className="h-6 w-6 text-cyan-600" />
            </div>
            Tin tức
          </CardTitle>
          <CardDescription className="text-base text-slate-500">
            Theo dõi thông báo mới từ Yostar, nội dung event, banner, outfit và pack
            đang mở trong game.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 gap-4">
        {newsData.map((news, idx) => (
          <Card
            key={news.id}
            className="glass-card group overflow-hidden border-0 shadow-sm hover:shadow-md"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 to-blue-500" />
            <CardHeader className="border-b border-slate-100/50 pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="mb-1 text-xl font-bold leading-tight text-slate-800 transition-colors group-hover:text-cyan-600">
                  {translateGameTerms(news.title)}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="ml-4 whitespace-nowrap border-slate-200 bg-white font-medium text-slate-600"
                >
                  <Clock className="mr-1.5 h-3 w-3 text-slate-400" />
                  {new Date(news.publishTime).toLocaleDateString("vi-VN")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div
                className="prose prose-sm mb-6 max-w-none overflow-hidden text-slate-600 prose-a:text-cyan-600 prose-img:rounded-xl"
                dangerouslySetInnerHTML={{
                  __html: translateGameTerms(news.content),
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {isNewsLoading ? (
        <div className="flex justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      ) : null}
    </TabsContent>
  );
}
