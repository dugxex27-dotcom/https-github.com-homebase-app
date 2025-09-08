import { Star, MapPin, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import ContactContractorButton from "@/components/contact-contractor-button";
import type { Contractor } from "@shared/schema";

interface ContractorCardProps {
  contractor: Contractor;
}

export default function ContractorCard({ contractor }: ContractorCardProps) {
  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;
    
    return (
      <div className="flex text-yellow-400 text-sm">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
        {hasHalfStar && <Star className="h-4 w-4 fill-current opacity-50" />}
        {[...Array(5 - Math.ceil(numRating))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      <div className="flex items-start space-x-4">
        <div className="relative">
          {contractor.profileImage ? (
            <img
              src={contractor.profileImage}
              alt={`${contractor.name} profile photo`}
              className="w-20 h-20 rounded-full object-cover border-2 border-primary/10"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">
                {contractor.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}

        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-lg mb-1 truncate">{contractor.name}</h3>
              <p className="text-muted-foreground text-sm mb-2">{contractor.company}</p>
            </div>
            <div className="flex items-center ml-4 flex-shrink-0">
              {renderStars(contractor.rating)}
              <span className="ml-2 text-sm font-medium text-foreground">
                {contractor.rating}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">
                ({contractor.reviewCount})
              </span>
            </div>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2 text-primary/60" />
              <span>{contractor.distance} miles away • {contractor.location}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Shield className="w-4 h-4 mr-2 text-primary/60" />
              <span>Licensed & Insured • {contractor.experience} years experience</span>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {contractor.bio}
            </p>
          </div>

          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {contractor.services.slice(0, 3).map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                  {service}
                </Badge>
              ))}
              {contractor.services.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{contractor.services.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <ContactContractorButton 
              contractor={contractor}
              className="flex-1"
            />
            <Link href={`/contractor/${contractor.id}`}>
              <Button variant="outline" className="px-4" style={{ color: '#ffffff' }}>
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
