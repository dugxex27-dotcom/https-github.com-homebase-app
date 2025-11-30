import logoIcon from '@assets/homebase-app-logo-white_1764510973197.png';

export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <img 
      src={logoIcon} 
      alt="HomeBase" 
      className={`${className} object-contain`}
    />
  );
}
