import logoImage from '@assets/homebase-logo-white_1756771612688.png';

export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <img 
      src={logoImage} 
      alt="HomeBase" 
      className={`${className} object-contain`}
    />
  );
}