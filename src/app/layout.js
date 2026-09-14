import './globals.css';

export const metadata = {
  title: 'MD Browser',
  description: 'A premium markdown file browser',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
