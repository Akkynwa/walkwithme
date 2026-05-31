// page.tsx or AIChatPage.tsx
import SpiritualWalker from '../../../components/ai/SpiritualWalker'; // If this is a default export

export default function AIChatPage() {
  return (
    <div>
       <SpiritualWalker /> 
       {/* If SpiritualWalker was imported incorrectly, this fails */}
    </div>
  );
}