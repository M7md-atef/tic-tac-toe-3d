import type { Metadata } from "next";
import { SettingsProvider } from "@/features/customization/context/SettingsContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Tic Tac Toe Pro | Unbeatable Minimax AI",
  description: "A gorgeous, modern 3D Tic Tac Toe web app with customizable themes, Web Audio synthesizer, and an unbeatable AI opponent.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="dark h-full antialiased">
      <head>
        {/* Anti-FOUC Blocking Script for Theme & Direction */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('app-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  var savedLang = localStorage.getItem('app-locale') || 'en';
                  document.documentElement.setAttribute('lang', savedLang);
                  document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white">
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
