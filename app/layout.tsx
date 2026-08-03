import type { Metadata } from "next";
import "./globals.css";
import { sitePath } from "./site-path";

export const metadata: Metadata = {
  title: "TW Issues｜台灣議題脈絡",
  description: "公開證據、事件進展與各方說法的可查閱讀入口。",
  openGraph: { title: "TW Issues｜台灣議題脈絡", description: "公開證據、事件進展與各方說法的可查閱讀入口。", images: [sitePath("/og.png")] },
  icons: { icon: sitePath("/favicon.svg"), shortcut: sitePath("/favicon.svg") },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
