import { cn } from "@/lib/utils";

const GLYPHS: Record<string, string> = {
  pedimento: "A1",
  invoice: "$",
  bl: "BL",
  packing_list: "PL",
  mve: "MV",
  cfdi: "CF",
  carta_porte: "CP",
  coo: "CO",
  guide: "IN",
};

const SIZE_CLASS = {
  mini: "h-[18px] w-[14px] rounded-[3px] text-[7px]",
  sm: "h-8 w-6 rounded-[4px] text-[9px]",
  md: "h-10 w-8 rounded-md text-[10px]",
  lg: "h-14 w-11 rounded-lg text-xs",
};

interface DocumentIconProps {
  type?: string;
  classified?: boolean;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
}

export function DocumentIcon({ type = "guide", classified = true, size = "md", className }: DocumentIconProps) {
  const glyph = GLYPHS[type] ?? type.slice(0, 2).toUpperCase();

  return (
    <span className={cn("document-icon", SIZE_CLASS[size], classified && "is-classified", className)}>
      {classified ? glyph : ""}
    </span>
  );
}
