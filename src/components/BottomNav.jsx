import { Home, Video, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 w-full bg-white border-t shadow-md flex justify-around py-2 z-50">
      <Link to="/"><Home size={24} /></Link>
      <Link to="/videos"><Video size={24} /></Link>
      <Link to="/menu"><Menu size={24} /></Link>
    </div>
  );
}
