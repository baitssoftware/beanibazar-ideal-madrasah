import TanStackQueryProvider from '@/provider/TanStackQueryProvider';
import localFont from 'next/font/local';
import './globals.css';

// Configure Anek Bangla font
const anekBangla = localFont({
  src: [
    {
      path: './fonts/Anek-Bangla-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './fonts/Anek-Bangla-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Anek-Bangla-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/Anek-Bangla-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Anek-Bangla-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Anek-Bangla-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Anek-Bangla-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Anek-Bangla-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/FoundersGrotesk-Semibold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-anek-bangla',
});

export const metadata = {
  title: 'Beanibazar Ideal Madrasah',
  description:
    'Bangladesh Associate of IT Solution is your trusted partner for comprehensive digital solutions. We specialize in creating tailored websites, managing domains, and providing expert IT services to help businesses grow in the digital world. Sabbir Mohammad Sami',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={anekBangla.variable}>
        <TanStackQueryProvider>{children}</TanStackQueryProvider>
      </body>
    </html>
  );
}
