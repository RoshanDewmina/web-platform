"use client";

import dynamic from "next/dynamic";

export const ChatWidgetLoader = dynamic(
  () => import("./chat-widget").then((m) => m.ChatWidget),
  { ssr: false, loading: () => null }
);

export default ChatWidgetLoader;
