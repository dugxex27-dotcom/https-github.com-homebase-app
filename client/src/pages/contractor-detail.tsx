import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ContactContractorButton from "@/components/contact-contractor-button";
import { ContractorReviews } from "@/components/contractor-reviews";
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Shield, 
  Wrench, 
  Globe,
  Star
} from "lucide-react";
import type { Contractor } from "@shared/schema";

export default function ContractorDetail() {
  const [match, params] = useRoute("/contractor/:id");
  const contractorId = params?.id;

  const { data: contractor, isLoading, error } = useQuery<Contractor>({
    queryKey: ['/api/contractors', contractorId],
    enabled: !!contractorId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading contractor details...</div>
        </main>
      </div>
    );
  }

  if (error || !contractor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Contractor Not Found</h2>
                <p className="text-muted-foreground">The contractor you're looking for doesn't exist or has been removed.</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-current" />
        ))}
        {hasHalfStar && <Star className="h-5 w-5 fill-current opacity-50" />}
        {[...Array(5 - Math.ceil(numRating))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Contractor Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-6">
                <div className="relative">
                  {contractor.profileImage ? (
                    <img
                      src={contractor.profileImage}
                      alt={`${contractor.name} profile photo`}
                      className="w-24 h-24 rounded-full object-cover border-2 border-primary/10"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-xl font-semibold text-primary">
                        {contractor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground mb-1">{contractor.name}</h1>
                      <p className="text-lg text-muted-foreground mb-2">{contractor.company}</p>
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center">
                          {renderStars(contractor.rating)}
                          <span className="ml-2 font-medium">{contractor.rating}</span>
                          <span className="ml-1 text-sm text-muted-foreground">
                            ({contractor.reviewCount} review{contractor.reviewCount !== 1 ? 's' : ''})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <ContactContractorButton contractor={contractor} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2 text-primary/60" />
                      <span>{contractor.distance} miles away • {contractor.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Shield className="w-4 h-4 mr-2 text-primary/60" />
                      <span>Licensed & Insured • {contractor.experience} years experience</span>
                    </div>
                    {contractor.phone && (
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="w-4 h-4 mr-2 text-primary/60" />
                        <span>{contractor.phone}</span>
                      </div>
                    )}
                    {contractor.email && (
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="w-4 h-4 mr-2 text-primary/60" />
                        <span>{contractor.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {contractor.bio || "No description provided."}
              </p>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Services Offered</h4>
                <div className="flex flex-wrap gap-2">
                  {contractor.services.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {(contractor as any).website && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Globe className="w-4 h-4 mr-2" />
                  <a 
                    href={(contractor as any).website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardContent className="pt-6">
              <ContractorReviews 
                contractorId={contractor.id} 
                contractorName={contractor.name}
              />
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}