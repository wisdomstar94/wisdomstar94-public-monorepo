import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout';
import { ThemeProvider } from '@/providers/theme-provider';
import { ReactNode } from 'react';

export default function Layout(props: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AdminPanelLayout>{props.children}</AdminPanelLayout>
    </ThemeProvider>
  );
}
