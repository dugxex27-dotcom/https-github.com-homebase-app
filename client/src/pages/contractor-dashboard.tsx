import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Proposals } from "@/components/proposals";
import { ContractorCodeEntry } from "@/components/ConnectionCodes";

import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { FileText, User, Star, Briefcase, Gift } from "lucide-react";
import type { User as UserType } from "@shared/schema";

export default function ContractorDashboard() {
  const { user } = useAuth();
  const typedUser = user as UserType | undefined;
  
  // Referral data query
  const { data: referralData, isLoading: isLoadingReferral } = useQuery({
    queryKey: ['/api/user/referral-code'],
    enabled: !!typedUser,
  });
  
  const referralCount = (referralData as any)?.referralCount || 0;
  
  // Contractors have a $20/month subscription
  const subscriptionCost = 20;
  const referralsNeeded = subscriptionCost;
  const referralsRemaining = Math.max(0, referralsNeeded - referralCount);
  const progressPercentage = Math.min(100, (referralCount / referralsNeeded) * 100);
  
  if (!typedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1560a2' }}>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-2">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen" style={{ background: '#1560a2' }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#1560a2]">
        <div className="mb-8 p-6 rounded-lg" style={{ background: '#f2f2f2' }}>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1560a2' }}>Contractor Dashboard</h1>
          <p className="text-lg" style={{ color: '#000000' }}>Manage your contracting business and grow your client base</p>
        </div>

        {/* Referral Progress Card */}
        <Card className="mb-8" style={{ backgroundColor: '#f2f2f2' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#1560a2' }}>
              <Gift className="w-5 h-5" style={{ color: '#1560a2' }} />
              Progress to Free Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: '#1560a2' }}>
                  Referral Progress
                </span>
                <span className="text-sm font-bold" style={{ color: '#1560a2' }}>
                  {isLoadingReferral ? '...' : `${referralCount}/${referralsNeeded}`}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3 mb-2" />
              <p className="text-center text-[32px]" style={{ color: referralsRemaining === 0 ? '#10b981' : '#dc2626' }}>
                {referralsRemaining === 0 ? (
                  <span className="font-bold">🎉 You've earned a free subscription!</span>
                ) : (
                  <>
                    <span className="font-bold">{referralsRemaining} more referral{referralsRemaining !== 1 ? 's' : ''}</span> until your subscription is free!
                  </>
                )}
              </p>
              <p className="text-center text-sm text-gray-600 mt-3">
                Share your referral code from the Account page to earn $1 off per signup!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Proposals Section */}
        <div className="mb-8">
          <Proposals contractorId={typedUser.id} />
        </div>

        {/* Connection Code Entry */}
        <div className="mb-8">
          <ContractorCodeEntry />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Button 
                  className="h-20 flex flex-col items-center justify-center space-y-2 text-white hover:opacity-90" 
                  style={{ backgroundColor: '#1560a2' }}
                  onClick={() => window.location.href = "/crm"}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.color = '#afd6f9'; 
                    e.currentTarget.querySelectorAll('svg').forEach(svg => svg.style.color = '#afd6f9'); 
                  }} 
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.color = 'white'; 
                    e.currentTarget.querySelectorAll('svg').forEach(svg => svg.style.color = 'white'); 
                  }}
                  data-testid="button-crm"
                >
                  <Briefcase className="h-6 w-6" />
                  <span>CRM</span>
                </Button>
                <Button 
                  className="h-20 flex flex-col items-center justify-center space-y-2 text-white hover:opacity-90"
                  style={{ backgroundColor: '#1560a2', border: 'none' }}
                  onClick={() => window.location.href = "/service-records"}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#afd6f9'; e.currentTarget.querySelectorAll('svg').forEach(svg => svg.style.color = '#afd6f9'); }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.querySelectorAll('svg').forEach(svg => svg.style.color = 'white'); }}
                >
                  <FileText className="h-6 w-6 text-white" />
                  <span>Service Records</span>
                </Button>
                <Button 
                  className="h-20 flex flex-col items-center justify-center space-y-2 text-white hover:opacity-90"
                  style={{ backgroundColor: '#1560a2', border: 'none' }}
                  onClick={() => window.location.href = "/contractor-profile"}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#afd6f9'; e.currentTarget.querySelectorAll('svg').forEach(svg => svg.style.color = '#afd6f9'); }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.querySelectorAll('svg').forEach(svg => svg.style.color = 'white'); }}
                >
                  <User className="h-6 w-6 text-white" />
                  <span>Edit Profile</span>
                </Button>
                <Button 
                  className="h-20 flex flex-col items-center justify-center space-y-2 text-white hover:opacity-90" 
                  style={{ backgroundColor: '#1560a2' }}
                  onClick={() => window.location.href = "/contractor-profile"}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#afd6f9'; e.currentTarget.querySelectorAll('svg').forEach(svg => svg.style.color = '#afd6f9'); }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.querySelectorAll('svg').forEach(svg => svg.style.color = 'white'); }}
                  data-testid="button-reviews"
                >
                  <Star className="h-6 w-6 text-white" />
                  <span>View Reviews</span>
                </Button>
              </div>
            </CardContent>
          </Card>


        </div>
      </main>
    </div>
  );
}