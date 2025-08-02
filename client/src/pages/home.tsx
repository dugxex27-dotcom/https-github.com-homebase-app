import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Package, Calendar, Search, MapPin, Star, CheckCircle, TrendingUp, Shield } from "lucide-react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import ProductCard from "@/components/product-card";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import type { Product, User } from "@shared/schema";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const typedUser = user as User | undefined;
  const [activeTab, setActiveTab] = useState<'products' | 'maintenance' | 'contractors'>('products');

  const { data: featuredProducts, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', 'featured'],
    queryFn: async () => {
      const response = await fetch('/api/products?featured=true');
      if (!response.ok) throw new Error('Failed to fetch featured products');
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-900 py-16 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Verified Contractors</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mx-auto mb-4">
                <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">1,200+</div>
              <div className="text-gray-600 dark:text-gray-300">Quality Products</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">10,000+</div>
              <div className="text-gray-600 dark:text-gray-300">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">4.8/5</div>
              <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-8 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="flex bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-8 py-4 rounded-xl text-sm font-medium flex items-center transition-all duration-200 ${
                  activeTab === 'products'
                    ? 'bg-amber-500 text-white shadow-md transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Package className="mr-3 h-5 w-5" />
                Featured Products
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`px-8 py-4 rounded-xl text-sm font-medium flex items-center transition-all duration-200 ${
                  activeTab === 'maintenance'
                    ? 'bg-amber-500 text-white shadow-md transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Calendar className="mr-3 h-5 w-5" />
                Maintenance Schedule
              </button>
              {/* Only show Find Contractors tab for homeowners */}
              {typedUser?.role === 'homeowner' && (
                <button
                  onClick={() => setActiveTab('contractors')}
                  className={`px-8 py-4 rounded-xl text-sm font-medium flex items-center transition-all duration-200 ${
                    activeTab === 'contractors'
                      ? 'bg-amber-500 text-white shadow-md transform scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Users className="mr-3 h-5 w-5" />
                  Find Contractors
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tab Content Section */}
      <section className="bg-gray-50 dark:bg-gray-900/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'products' && (
            <>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Featured Products
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Discover professional-grade tools and materials carefully selected for quality and reliability
                </p>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {featuredProducts?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              <div className="text-center mt-12">
                <Link href="/products">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    Explore All Products
                  </Button>
                </Link>
              </div>
            </>
          )}

          {activeTab === 'maintenance' && (
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl">
                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-2xl mx-auto mb-6">
                    <Calendar className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Smart Maintenance Scheduling
                  </CardTitle>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Keep your home in perfect condition with personalized maintenance schedules based on your location and home systems
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Climate-Based</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Recommendations tailored to your regional climate</p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Predictive</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Prevent issues before they become costly problems</p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Professional</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Based on industry standards and best practices</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <Link href="/maintenance">
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                        View Your Maintenance Schedule
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'contractors' && typedUser?.role === 'homeowner' && (
            <div className="max-w-5xl mx-auto">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl">
                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mx-auto mb-6">
                    <Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Find Trusted Contractors
                  </CardTitle>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                    Connect with verified local contractors specializing in niche services
                  </p>
                  
                  {/* Service badges */}
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-3 py-1">
                      Gutter Cleaning
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1">
                      Drywall Repair
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1">
                      Custom Cabinetry
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1">
                      HVAC Services
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-3 py-1">
                      Electrical Work
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        What service do you need?
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="Gutter cleaning, drywall repair, custom cabinetry..."
                          className="pl-10 h-12 text-base border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Your location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="City, State or ZIP code"
                          className="pl-10 h-12 text-base border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <Link href="/contractors" className="lg:self-end">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-12 text-base rounded-xl font-medium transition-all duration-200 flex items-center justify-center w-full lg:w-auto">
                        <Search className="mr-2 h-4 w-4" />
                        Find Contractors
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>



      {/* Additional Features Section */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Home Base?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We've designed every feature to make home management simple, reliable, and efficient
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800/30">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Verified Professionals</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All contractors are thoroughly vetted with background checks, license verification, and customer reviews
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800/30">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Smart Scheduling</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  AI-powered maintenance schedules that adapt to your home's specific needs and local climate conditions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800/30">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Cost Savings</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Preventive maintenance and competitive contractor pricing help you save thousands on home repairs
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-6">
                <Logo className="h-10 w-auto text-amber-400" />
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your trusted partner for connecting with skilled contractors, discovering quality DIY products, and maintaining your home with confidence.
              </p>
            </div>

            {/* Only show homeowner links for homeowners */}
            {typedUser?.role === 'homeowner' && (
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">For Homeowners</h4>
                <ul className="space-y-3 text-gray-400">
                  <li><Link href="/contractors" className="hover:text-amber-400 transition-colors">Find Contractors</Link></li>
                  <li><Link href="/products" className="hover:text-amber-400 transition-colors">DIY Products</Link></li>
                  <li><Link href="/maintenance" className="hover:text-amber-400 transition-colors">Maintenance Schedule</Link></li>
                  <li><Link href="/service-records" className="hover:text-amber-400 transition-colors">Service History</Link></li>
                </ul>
              </div>
            )}

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">For Contractors</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/contractor-signin" className="hover:text-amber-400 transition-colors">Join Network</Link></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Pricing Plans</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Resources</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Home Base. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
