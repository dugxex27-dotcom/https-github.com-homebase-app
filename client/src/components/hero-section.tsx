import Logo from "@/components/logo";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Wrench, Search, Calendar } from "lucide-react";

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-red-950/20 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Logo className="h-32 w-full text-amber-700 dark:text-amber-300 mx-auto block mb-8" />
          
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {user?.role === 'homeowner' ? (
              <>Your Home's{" "}
              <span className="text-amber-600 dark:text-amber-400">Command Center</span></>
            ) : (
              <>Your Business{" "}
              <span className="text-amber-600 dark:text-amber-400">Growth Platform</span></>
            )}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {user?.role === 'homeowner' ? (
              'Connect with skilled contractors, discover quality DIY products, and keep your home running smoothly with our intelligent maintenance scheduling system.'
            ) : (
              'Grow your contracting business by connecting with quality clients, showcasing your expertise, and managing your professional reputation in one powerful platform.'
            )}
          </p>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            {user?.role === 'homeowner' ? (
              // Homeowner Quick Actions
              <>
                <Link href="/maintenance">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-amber-100 dark:border-amber-900/30">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/50 transition-colors">
                      <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Home Maintenance</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Schedule and track home maintenance with climate-based recommendations
                    </p>
                  </div>
                </Link>

                <Link href="/contractors">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-amber-100 dark:border-amber-900/30">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                      <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Find Contractors</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Connect with trusted local contractors for any home project
                    </p>
                  </div>
                </Link>

                <Link href="/products">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-amber-100 dark:border-amber-900/30">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                      <Wrench className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">DIY Products</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Discover quality tools and materials for your home projects
                    </p>
                  </div>
                </Link>
              </>
            ) : (
              // Contractor Quick Actions
              <>
                <Link href="/contractor-profile">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-amber-100 dark:border-amber-900/30">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                      <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">My Profile</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Manage your professional profile and service offerings
                    </p>
                  </div>
                </Link>

                <Link href="/messages">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-amber-100 dark:border-amber-900/30">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                      <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Messages</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Communicate with clients and manage project inquiries
                    </p>
                  </div>
                </Link>

                <Link href="/products">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-amber-100 dark:border-amber-900/30">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                      <Wrench className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Professional Tools</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Browse high-quality tools and materials for your projects
                    </p>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
