import logoIcon from '@assets/homebase-app-icon-final_1764468561488.png';

export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <img 
      src={logoIcon} 
      alt="HomeBase" 
      className={`${className} object-contain`}
    />
  );
}
