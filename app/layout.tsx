import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "College Decision Portal",
  description: "A customizable applicant portal experience.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
