import Logo from "@/components/logo";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-accent to-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="bg-card rounded-2xl shadow-lg p-12 border border-border max-w-4xl mx-auto">
            <Logo className="h-32 w-full text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}
