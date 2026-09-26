import "@/app/labs/lab2/index.css";
import { BoxModelWidget } from "@/app/labs/lab2/BoxModel";
import DiagramFrame from "./DiagramFrame";

export default function BoxModelDiagram() {
  return (
    <DiagramFrame label="Box model — four layers">
      <BoxModelWidget />
    </DiagramFrame>
  );
}
