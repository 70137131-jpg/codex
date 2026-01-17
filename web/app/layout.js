import "./globals.css";

export const metadata = {
  title: "Snippet Manager",
  description: "A front end for the Code Snippet Manager API."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
