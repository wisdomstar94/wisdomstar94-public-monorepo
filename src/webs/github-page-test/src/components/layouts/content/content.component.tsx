import { IContent } from './content.type';

export function Content(props: IContent.Props) {
  const { children } = props;

  return <main>{children}</main>;
}
