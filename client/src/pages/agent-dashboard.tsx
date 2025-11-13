import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { Users, DollarSign, TrendingUp, Copy, Share2, CheckCircle, Clock, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";
import type { User as UserType } from "@shared/schema";

interface AgentProfile {
  id: string;
  userId: string;
  commissionRate: number;
  stripeAccountId: string | null;
}

interface AgentReferral {
  id: string;
  agentId: string;
  referredUserId: string;
  status: string;
  consecutiveMonthsPaid: number;
  signupDate: string;
  trialEndDate: string;
  refereeName: string;
  refereeEmail: string;
}

interface AgentStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
}

export default function AgentDashboard() {
  const { user } = useAuth();
  const typedUser = user as UserType | undefined;
  const { toast } = useToast();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const { data: profile } = useQuery<AgentProfile>({
    queryKey: ["/api/agent/profile"],
    enabled: !!typedUser,
  });

  const { data: referrals = [] } = useQuery<AgentReferral[]>({
    queryKey: ["/api/agent/referrals"],
    enabled: !!typedUser,
  });

  const { data: stats } = useQuery<AgentStats>({
    queryKey: ["/api/agent/stats"],
    enabled: !!typedUser,
  });

  const { data: verificationStatus } = useQuery<{ verificationStatus: string; reviewNotes?: string }>({
    queryKey: ["/api/agent/verification-status"],
    enabled: !!typedUser,
  });

  if (!typedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-2">Loading...</div>
        </div>
      </div>
    );
  }

  const referralUrl = `${window.location.origin}/signin?ref=${typedUser.referralCode || ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Home Base",
          text: "Use my referral code to join Home Base!",
          url: referralUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopyLink();
    }
  };

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(referralUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#059669',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case 'trial':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Trial
          </span>
        );
      case 'voided':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Voided
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #059669 0%, #047857 100%)' }}>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#ffffff' }}>Agent Dashboard</h1>
          <p className="text-lg" style={{ color: '#a7f3d0' }}>Track your referrals and earnings</p>
        </div>

        {/* Verification Status Banner */}
        {verificationStatus?.verificationStatus !== 'approved' && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Verification Required</AlertTitle>
            <AlertDescription className="text-yellow-700">
              {verificationStatus?.verificationStatus === 'pending_review' ? (
                <span>Your verification is under review. You'll be able to earn commissions once approved.</span>
              ) : verificationStatus?.verificationStatus === 'rejected' || verificationStatus?.verificationStatus === 'resubmit_required' ? (
                <span>Your verification was rejected. Please resubmit your information.</span>
              ) : (
                <span>You must verify your real estate license to start earning referral commissions.</span>
              )}
              <Link href="/agent-account">
                <Button variant="link" className="h-auto p-0 ml-2 text-yellow-800 hover:text-yellow-900">
                  {verificationStatus?.verificationStatus === 'pending_review' ? 'View Status' : 'Get Verified'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-emerald-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Total Referrals</CardTitle>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#059669' }}>
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalReferrals || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-emerald-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Active Subscribers</CardTitle>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#059669' }}>
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.activeReferrals || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Paying customers</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-emerald-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Total Earnings</CardTitle>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#059669' }}>
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">${(stats?.totalEarnings || 0).toFixed(2)}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Paid out</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-emerald-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Pending Earnings</CardTitle>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#059669' }}>
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">${(stats?.pendingEarnings || 0).toFixed(2)}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">In progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link Section */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border-emerald-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Your Referral Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  data-testid="input-referral-link"
                />
                <Button onClick={handleCopyLink} variant="outline" data-testid="button-copy-link">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={handleShareLink} variant="outline" data-testid="button-share-link">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateQRCode} variant="secondary" data-testid="button-generate-qr">
                  Generate QR Code
                </Button>
                {qrCodeUrl && (
                  <a
                    href={qrCodeUrl}
                    download={`homebase-referral-${typedUser.referralCode}.png`}
                    data-testid="link-download-qr"
                  >
                    <Button variant="outline">Download QR Code</Button>
                  </a>
                )}
              </div>

              {qrCodeUrl && (
                <div className="flex justify-center mt-4">
                  <img src={qrCodeUrl} alt="Referral QR Code" className="border rounded-lg p-4" />
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Your referral code: <span className="font-mono font-bold">{typedUser.referralCode}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Share this link with homeowners and contractors. You'll earn $10 after they maintain an active subscription for 4 consecutive months.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Referrals List */}
        <Card className="bg-white dark:bg-gray-800 border-emerald-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Your Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No referrals yet. Start sharing your link!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    data-testid={`referral-${referral.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold" data-testid={`text-referral-name-${referral.id}`}>
                          {referral.refereeName}
                        </h3>
                        {getStatusBadge(referral.status)}
                      </div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-referral-email-${referral.id}`}>
                        {referral.refereeEmail}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Signed up: {new Date(referral.signupDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {referral.consecutiveMonthsPaid} / 4 months
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {referral.consecutiveMonthsPaid >= 4 ? (
                          <span className="text-green-600 font-medium">Eligible for payout</span>
                        ) : (
                          `${4 - referral.consecutiveMonthsPaid} months until payout`
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stripe Connect Notice */}
        {!profile?.stripeAccountId && (
          <Card className="mt-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-sm text-yellow-800">
                <strong>Action Required:</strong> Connect your Stripe account to receive payouts. Set up will be available soon.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
