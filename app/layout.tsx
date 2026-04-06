import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AV Search Lab",
  description: "女優検索・ランキング・ジャンル別に探せるAVデータベースサイト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
        {/* ページ本体 */}
        {children}

        {/* フッター */}
        <footer
          style={{
            marginTop: "40px",
            padding: "16px",
            textAlign: "center",
            borderTop: "1px solid #eee",
            fontSize: "14px",
          }}
        >
          <p style={{ marginBottom: "8px" }}>
            © 2026 AV Search Lab
          </p>

          <a href="/privacy">プライバシーポリシー</a>
        </footer>

      </body>
    </html>
  );
}