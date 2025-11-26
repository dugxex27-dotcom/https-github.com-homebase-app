import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Proposals } from "@/components/proposals";
import { ContractorCodeEntry } from "@/components/ConnectionCodes";

import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  Bell, 
  Menu, 
  Gift, 
  FileText, 
  Calendar, 
  DollarSign, 
  Users, 
  User,
  Star,
  Briefcase,
  Clock,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import type { User as UserType, Proposal, ContractorAppointment } from "@shared/schema";
import { Link } from "wouter";

export default function ContractorDashboard() {
  const { user } = useAuth();
  const typedUser = user as UserType | undefined;
  
  const { data: referralData, isLoading: isLoadingReferral } = useQuery({
    queryKey: ['/api/user/referral-code'],
    enabled: !!typedUser,
  });
  
  const { data: proposals = [], isLoading: isLoadingProposals } = useQuery<Proposal[]>({
    queryKey: ["/api/proposals", typedUser?.id],
    queryFn: async () => {
      const response = await fetch(`/api/proposals?contractorId=${typedUser?.id}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch proposals');
      return response.json();
    },
    enabled: !!typedUser?.id,
  });

  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery<ContractorAppointment[]>({
    queryKey: ["/api/appointments", typedUser?.id],
    queryFn: async () => {
      const response = await fetch(`/api/appointments?contractorId=${typedUser?.id}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch appointments');
      return response.json();
    },
    enabled: !!typedUser?.id,
  });
  
  const referralCount = (referralData as any)?.referralCount || 0;
  
  const subscriptionCost = 20;
  const referralsNeeded = subscriptionCost;
  const referralsRemaining = Math.max(0, referralsNeeded - referralCount);
  const progressPercentage = Math.min(100, (referralCount / referralsNeeded) * 100);

  const pendingProposals = proposals.filter(p => p.status === 'sent' || p.status === 'draft');
  const acceptedProposals = proposals.filter(p => p.status === 'accepted');

  const totalEarnings = acceptedProposals.reduce((sum, p) => sum + parseFloat(p.estimatedCost || '0'), 0);

  const upcomingAppointments = appointments
    .filter(a => new Date(a.scheduledDateTime) >= new Date())
    .sort((a, b) => new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime());
  const nextAppointment = upcomingAppointments[0];
  
  if (!typedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-700 mb-2">Loading...</div>
        </div>
      </div>
    );
  }

  const firstName = typedUser.firstName || typedUser.email?.split('@')[0] || 'Contractor';
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left column / sidebar */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold mb-3" data-testid="text-overview-title">Overview</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <DollarSign size={18} className="text-blue-600" />
                  <div>
                    <div className="text-xs text-slate-400">This month</div>
                    <div className="font-medium" data-testid="text-monthly-earnings">${totalEarnings.toLocaleString()}</div>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Users size={18} className="text-emerald-600" />
                  <div>
                    <div className="text-xs text-slate-400">New leads</div>
                    <div className="font-medium" data-testid="text-new-leads">{referralCount}</div>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <FileText size={18} className="text-amber-500" />
                  <div>
                    <div className="text-xs text-slate-400">Proposals</div>
                    <div className="font-medium" data-testid="text-pending-proposals">{pendingProposals.length} pending</div>
                  </div>
                </li>
              </ul>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link href="/messages">
                  <Button 
                    className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-lg font-semibold hover:opacity-90"
                    data-testid="button-create-proposal"
                  >
                    Create Proposal
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h4 className="text-sm font-semibold mb-2">Quick Actions</h4>
                <div className="grid grid-cols-1 gap-2">
                  <Link href="/messages">
                    <button 
                      className="w-full text-sm text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2"
                      data-testid="button-message-client"
                    >
                      <MessageSquare size={16} className="text-blue-600" />
                      Message Client
                    </button>
                  </Link>
                  <Link href="/calendar">
                    <button 
                      className="w-full text-sm text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2"
                      data-testid="button-schedule-visit"
                    >
                      <Calendar size={16} className="text-blue-600" />
                      Schedule Visit
                    </button>
                  </Link>
                  <Link href="/service-records">
                    <button 
                      className="w-full text-sm text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2"
                      data-testid="button-mark-complete"
                    >
                      <CheckCircle size={16} className="text-emerald-600" />
                      Mark Job Complete
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Connection Code Entry */}
            <div className="mt-6">
              <ContractorCodeEntry />
            </div>
          </aside>

          {/* Main content */}
          <section className="col-span-12 lg:col-span-9">
            {/* Welcome banner */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold" data-testid="text-welcome-message">Welcome back, {firstName}</h2>
                <p className="text-slate-500 mt-1">Quick snapshot of your business. Keep doing great work — we'll handle the busywork.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-slate-400">Subscription</div>
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-2 rounded-lg font-semibold" data-testid="badge-subscription">
                  Pro
                </div>
              </div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="text-xs text-slate-400">Earnings (30d)</div>
                <div className="text-xl font-semibold mt-2" data-testid="text-earnings-30d">${totalEarnings.toLocaleString()}</div>
                <div className="text-sm text-slate-500 mt-1">From accepted proposals</div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="text-xs text-slate-400">Active Jobs</div>
                <div className="text-xl font-semibold mt-2" data-testid="text-active-jobs">{acceptedProposals.length}</div>
                <div className="text-sm text-slate-500 mt-1">{upcomingAppointments.length} scheduled this week</div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="text-xs text-slate-400">Avg Response Time</div>
                <div className="text-xl font-semibold mt-2" data-testid="text-response-time">2h 12m</div>
                <div className="text-sm text-slate-500 mt-1">Keep response rate high to win more leads</div>
              </div>
            </div>

            {/* Referral / Progress Card */}
            <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50 rounded-2xl p-6 shadow-sm mb-6 border border-emerald-100">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-100">
                    <Gift size={22} className="text-emerald-700" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 font-semibold">Get your subscription FREE</div>
                    <div className="mt-1 text-slate-700 font-bold text-lg" data-testid="text-referrals-remaining">
                      {referralsRemaining === 0 
                        ? "🎉 You've earned a free subscription!" 
                        : `Just ${referralsRemaining} referral${referralsRemaining !== 1 ? 's' : ''} to go`}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Share your referral code to earn $1 per signup.</div>
                  </div>
                </div>
                <div className="w-full md:w-56">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{referralCount} referrals</span>
                    <span>{referralsNeeded} needed</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 rounded-full bg-emerald-400 transition-all duration-500" 
                      style={{ width: `${progressPercentage}%` }}
                      data-testid="progress-referrals"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Proposals + Calendar row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Proposals</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {proposals.length === 0 
                        ? "No proposals yet. Create your first proposal to get started." 
                        : `${pendingProposals.length} pending, ${acceptedProposals.length} accepted`}
                    </p>
                  </div>
                  <Link href="/messages">
                    <Button 
                      className="text-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-2 rounded-lg hover:opacity-90"
                      data-testid="button-new-proposal"
                    >
                      New Proposal
                    </Button>
                  </Link>
                </div>

                {proposals.length > 0 && (
                  <div className="mt-4 border-t pt-4 text-sm text-slate-600 space-y-2">
                    {proposals.slice(0, 3).map((proposal) => (
                      <div key={proposal.id} className="py-2 flex justify-between items-center">
                        <div>
                          <div className="font-medium">{proposal.title}</div>
                          <div className="text-xs text-slate-400">{proposal.status} • ${parseFloat(proposal.estimatedCost || '0').toLocaleString()}</div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          proposal.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                          proposal.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                          proposal.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {proposal.status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Calendar</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {nextAppointment 
                        ? `Next: ${new Date(nextAppointment.scheduledDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • ${new Date(nextAppointment.scheduledDateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
                        : 'No upcoming appointments'}
                    </p>
                  </div>
                  <Link href="/calendar">
                    <Button 
                      variant="outline" 
                      className="text-sm px-3 py-2 rounded-lg border"
                      data-testid="button-view-calendar"
                    >
                      View Calendar
                    </Button>
                  </Link>
                </div>

                {upcomingAppointments.length > 0 && (
                  <div className="mt-4">
                    {upcomingAppointments.slice(0, 2).map((appointment) => (
                      <div key={appointment.id} className="mb-2">
                        <div className="text-sm text-slate-600">
                          {new Date(appointment.scheduledDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="mt-1 bg-slate-50 p-3 rounded-lg text-sm">
                          {appointment.serviceType || 'Service appointment'} • {new Date(appointment.scheduledDateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} • {appointment.estimatedDuration || 2} hrs
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {upcomingAppointments.length === 0 && (
                  <div className="mt-4 text-center py-6 text-slate-400">
                    <Calendar className="mx-auto mb-2" size={24} />
                    <p className="text-sm">No upcoming appointments</p>
                  </div>
                )}
              </div>
            </div>

            {/* Jobs list */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Jobs</h3>
                <Link href="/crm">
                  <Button 
                    variant="outline" 
                    size="sm"
                    data-testid="button-view-all-jobs"
                  >
                    View All
                  </Button>
                </Link>
              </div>
              
              {acceptedProposals.length > 0 ? (
                <div className="grid gap-3">
                  {acceptedProposals.slice(0, 3).map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {job.estimatedDuration || 'TBD'} • ${parseFloat(job.estimatedCost || '0').toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-emerald-600 flex items-center gap-1">
                        <CheckCircle size={14} />
                        Scheduled
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Briefcase className="mx-auto mb-2" size={32} />
                  <p>No active jobs yet</p>
                  <p className="text-sm mt-1">Create and send proposals to get started</p>
                </div>
              )}

              {pendingProposals.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium text-slate-600 mb-3">Pending Attention</h4>
                  {pendingProposals.slice(0, 2).map((proposal) => (
                    <div key={proposal.id} className="p-4 border rounded-lg flex items-center justify-between mb-2 hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="font-medium">{proposal.title}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {proposal.status === 'draft' ? 'Draft - needs to be sent' : 'Awaiting response'} • ${parseFloat(proposal.estimatedCost || '0').toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-amber-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        Needs Attention
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Full Proposals Section */}
            <div className="mb-8">
              <Proposals contractorId={typedUser.id} />
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
