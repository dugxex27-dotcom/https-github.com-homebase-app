import logoImage from '@assets/homebase-logo-black-text2_1763334854521.png';

export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <img 
      src={logoImage} 
      alt="HomeBase" 
      className={`${className} object-contain`}
    />
  );
}