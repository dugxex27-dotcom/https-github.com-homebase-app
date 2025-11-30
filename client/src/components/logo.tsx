import logoIcon from '@assets/homebase-app-logo_1764513182226.png';

export default function Logo({ className = "h-[28px] sm:h-[32px] w-auto" }: { className?: string }) {
  return (
    <img 
      src={logoIcon} 
      alt="HomeBase" 
      className={`${className} object-contain`}
    />
  );
}
