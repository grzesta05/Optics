import { ReactElement, useState } from "react";

type Props = {
  children: ReactElement;
  headerText: string;
};

export default function SideWindowElement({ children, headerText }: Props) {
  const [isHidden, setIsHidden] = useState(false);
  return (
    <div>
      <div className="toolbar">
        <button onClick={() => setIsHidden((v) => !v)}></button>
        <h2>{headerText}</h2>
      </div>
      <div className="element">{element}</div>
    </div>
  );
}
