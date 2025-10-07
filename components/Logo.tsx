import { Play } from "lucide-react";

export function CreafloLogoSmall() {
  return (
    <span className="flex items-center text-primary">
      CRE
      <Play
        className="mx-[2px] h-5 w-5 -rotate-[90deg] translate-y-[1px]"
        fill="currentColor"
        stroke="currentColor"
      />
      FLO
    </span>
  );
}

export function CreafloLogoBig() {
  return (
    <span className="flex items-center text-5xl font-semibold text-primary sm:text-6xl">
      CRE
      <Play
        className="mx-[2px] h-16 w-16 -rotate-[90deg] translate-y-[1px]"
        fill="currentColor"
        stroke="currentColor"
      />
      FLO
    </span>
  );
}
