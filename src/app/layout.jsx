import localFont from "next/font/local";
import "./globals.css";


const fontOne = localFont({
  src: "./fonts/GeistMonoVF.woff",
});

const fontTwo = localFont({
  src: "./fonts/GeistVF.woff",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fontOne.className} ${fontTwo.className}`}>
        {children}
      </body>
    </html>
  );
}
