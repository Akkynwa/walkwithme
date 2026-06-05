export const SacredRibbon = ({ 
  color1 = "#D4AF37", 
  color2 = "#AA8A2E", 
  className = "" 
}) => (
  <div className={`relative flex gap-1 ${className}`}>
    <div 
      style={{ backgroundColor: color1 }} 
      className="w-4 h-24 rounded-b-md shadow-lg transition-all duration-300" 
    />
    <div 
      style={{ backgroundColor: color2 }} 
      className="w-4 h-16 rounded-b-md shadow-md transition-all duration-300" 
    />
  </div>
);