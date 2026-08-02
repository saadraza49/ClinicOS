import './globals.css';

export const metadata = {
  title: 'ClinicOS',
  description: 'Clinic Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
}

