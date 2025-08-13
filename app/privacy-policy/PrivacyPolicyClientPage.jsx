"use client";

import {
  ArrowLeft,
  Shield,
  Lock,
  Database,
  Globe,
  FileText,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/footer";

export default function PrivacyPolicyClientPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">
                Privacy Policy
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Data Security & Privacy Compliance
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Your privacy and data security are our top priorities. Learn how we
            protect your information with enterprise-grade security measures.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Infrastructure Overview */}
        <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Database className="h-6 w-6 mr-3 text-blue-600" />
              1. Infrastructure Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              We host and manage all backend services and databases on Amazon
              Web Services (AWS), a globally trusted cloud provider. The
              following AWS services are used:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { service: "EC2", description: "Application servers" },
                { service: "RDS", description: "Databases" },
                { service: "S3", description: "File storage" },
                { service: "CloudFront", description: "Content delivery" },
                { service: "VPC", description: "Isolated network environment" },
                { service: "IAM", description: "Identity & access management" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <Badge variant="outline" className="mr-3">
                    {item.service}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {item.description}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Collection */}
        <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <FileText className="h-6 w-6 mr-3 text-green-600" />
              2. Data Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                2.1 Types of Data Collected
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-medium text-red-800 mb-2">
                    Personally Identifiable Information (PII)
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Full Name</li>
                    <li>• Email Address</li>
                    <li>• Device Information</li>
                    <li>• User behaviour (clicks, progress)</li>
                  </ul>
                </div>

                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Non-PII Data
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Browser type and version</li>
                    <li>• IP Address</li>
                    <li>• Operating system</li>
                    <li>• Anonymous usage analytics</li>
                    <li>• Application interaction data</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                2.2 Purpose of Data Collection
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  To deliver personalized experiences
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  To track engagement and performance
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  For analytics and optimization
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  For prize distribution or reward validation (if applicable)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  For user support or queries
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection Measures */}
        <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Lock className="h-6 w-6 mr-3 text-purple-600" />
              3. Data Protection Measures
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                3.1 Access Control
              </h3>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <ul className="space-y-2 text-purple-800">
                  <li>• Role-based access using AWS IAM</li>
                  <li>• Multi-Factor Authentication (MFA) enforced</li>
                  <li>
                    • Least privilege access enforced for all environments
                    (dev/staging/production)
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                3.2 Encryption
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">
                    Data in Transit
                  </h4>
                  <p className="text-sm text-green-700">
                    Encrypted using TLS 1.2+ for all traffic
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">
                    Data at Rest
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• AWS services use AES-256 encryption</li>
                    <li>• KMS manages encryption keys</li>
                    <li>• Application-level encryption for PII</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                3.3 Secure Data Handling
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Data is only collected when consent is given (opt-in forms or
                  application UI)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  No unnecessary retention: Data is deleted after its purpose is
                  fulfilled
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  All APIs are protected via authentication tokens and rate
                  limiting
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  CSRF, XSS, and SQL injection protections implemented
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* GDPR and Local Data Compliance */}
        <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Globe className="h-6 w-6 mr-3 text-indigo-600" />
              4. GDPR and Local Data Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                4.1 GDPR Compliance
              </h3>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <ul className="space-y-2 text-indigo-800">
                  <li>
                    • Users are informed about data collection via privacy
                    policy and consent banner
                  </li>
                  <li>• Opt-in is used before collecting any PII</li>
                  <li>
                    • Users have the right to request data deletion, export, and
                    access
                  </li>
                  <li>
                    • Data processors and subprocessors (e.g., AWS) are
                    GDPR-compliant
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                4.2 UAE Data Protection
              </h3>
              <p className="text-gray-700">
                No data is transferred to countries without adequate protection
                without safeguards. Hosting can be configured to use AWS Middle
                East (UAE) region for local compliance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg">
                5. Data Backup and Disaster Recovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Automated daily backups for all databases</li>
                <li>
                  • S3 objects with versioning and cross-region replication
                </li>
                <li>• Encrypted backup storage</li>
                <li>• Periodic recovery testing</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg">
                6. Server and Infrastructure Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• AWS hosting with high availability</li>
                <li>• VPC with private subnets</li>
                <li>• Web Application Firewall (WAF)</li>
                <li>• Regular patch management</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg">
                7. Monitoring and Logging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Centralized logging with CloudWatch</li>
                <li>• Real-time threat detection</li>
                <li>• Secure log storage and monitoring</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg">
                8. Incident Response Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Defined breach response process</li>
                <li>• 72-hour notification (GDPR compliant)</li>
                <li>• Impact assessments and reporting</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Cloudflare Integration */}
        <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Globe className="h-5 w-5 mr-3 text-orange-600" />
              9. Cloudflare Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  feature: "DNS Security",
                  description:
                    "DNS managed via Cloudflare, protecting from DNS-based attacks",
                },
                {
                  feature: "WAF",
                  description:
                    "Web Application Firewall blocks threats in real-time",
                },
                {
                  feature: "DDoS Protection",
                  description: "Always-on mitigation via global edge network",
                },
                {
                  feature: "Rate Limiting",
                  description: "Bot protection to prevent abuse of endpoints",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                >
                  <h4 className="font-medium text-orange-800 mb-1">
                    {item.feature}
                  </h4>
                  <p className="text-sm text-orange-700">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conclusion */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <AlertTriangle className="h-5 w-5 mr-3 text-blue-600" />
              10. Conclusion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our infrastructure and practices are designed to protect user
              data, ensure application availability, and comply with regional
              and international privacy laws like GDPR. We continuously audit
              and update our systems for ongoing compliance and security.
            </p>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">
                If you have any further questions about AliveNow's privacy
                policy, please email us at{" "}
                <a
                  href="mailto:contact@alivenow.in"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  contact@alivenow.in
                </a>{" "}
                and we will get back to you.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Top Button */}
        <div className="text-center">
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            variant="outline"
            size="lg"
            className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            Back to Top
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
