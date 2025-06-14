import { Trefoil } from "ldrs/react";
import "ldrs/react/Trefoil.css";

function Loader() {
  return (
    <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black/10 flex items-center justify-center z-[10000]">
      <Trefoil
        size="40"
        stroke="4"
        strokeLength="0.15"
        bgOpacity="0.1"
        speed="1.4"
        color="orange"
      />
    </div>
  );
}

export default Loader;
