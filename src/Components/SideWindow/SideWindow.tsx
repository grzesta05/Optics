import { ReactElement } from "react";
import SideWindowElement from "./SideWindowElement";

type Props = {
  windows: Array<ReactElement>;
};

export default function SideWindow({ windows }: Props) {
  return (
    <div className="SideWindow">
      {windows.map((element) => (
        <SideWindowElement headerText="">{element}</SideWindowElement>
      ))}
    </div>
  );
}
