import { ReactElement } from "react";

type Props = {
  windows: Array<ReactElement>;
};

export default function SideWindow({ windows }: Props) {
  return (
    <div>
      {windows.map((element) => (
        <SideWindowElement>{element}</SideWindowElement>
      ))}
    </div>
  );
}
