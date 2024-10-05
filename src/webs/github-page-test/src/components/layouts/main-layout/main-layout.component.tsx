import { Content } from '../content/content.component';
import { Header } from '../header/header.component';
import { Sidebar } from '../sidebar/sidebar.component';
import { IMainLayout } from './main-layout.type';

export function MainLayout(props: IMainLayout.Props) {
  const { children } = props;

  return (
    <>
      <Header />
      <Sidebar />
      <Content>{children}</Content>
    </>
  );
}
