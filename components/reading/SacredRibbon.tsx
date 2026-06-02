export const SacredRibbon = ({ color1 = "#8B0000", color2 = "#B22222", className = "" }) => (
  <div className={`relative flex gap-0.5 ${className}`}>
    <div style={{ backgroundColor: color1 }} className="w-2.5 h-16 rounded-b-sm shadow-md" />
    <div style={{ backgroundColor: color2 }} className="w-2.5 h-12 rounded-b-sm shadow-sm" />
  </div>
);