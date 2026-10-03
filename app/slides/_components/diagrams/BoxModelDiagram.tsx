import { BoxModelWidget } from "./BoxModelWidget";
import DiagramFrame from "./DiagramFrame";

export default function BoxModelDiagram() {
  return (
    <DiagramFrame label="Box model — four layers">
      <BoxModelWidget />
    </DiagramFrame>
  );
}
