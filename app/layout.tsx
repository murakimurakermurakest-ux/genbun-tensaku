import './styles.css';

export const metadata = {
  title: '現代文記述添削アプリ 試作版',
  description: '本文非表示の現代文自学用添削アプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
