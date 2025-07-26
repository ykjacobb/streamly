export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

            <div className="prose dark:prose-invert max-w-none space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        By accessing and using real.kit, you accept and agree to be bound by the
                        terms and provision of this agreement.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        real.kit is a platform that provides tools for managing and monitoring
                        streaming content. We reserve the right to modify, suspend, or discontinue
                        any aspect of the service at any time.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">3. User Conduct</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        You agree not to use the service to:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-600 dark:text-gray-300">
                        <li>Violate any applicable laws or regulations</li>
                        <li>Infringe upon the rights of others</li>
                        <li>Distribute malicious software or harmful content</li>
                        <li>Attempt to gain unauthorized access to the service</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">4. Account Terms</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        You are responsible for maintaining the security of your account and
                        password. real.kit cannot and will not be liable for any loss or damage from
                        your failure to comply with this security obligation.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        The service and its original content, features, and functionality are owned
                        by real.kit and are protected by international copyright, trademark, patent,
                        trade secret, and other intellectual property laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        We may terminate or suspend your account and bar access to the service
                        immediately, without prior notice or liability, under our sole discretion,
                        for any reason whatsoever.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        We reserve the right to modify these terms at any time. We will notify users
                        of any changes by updating the date at the top of this agreement.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        If you have any questions about these Terms, please contact us.
                    </p>
                </section>

                <div className="mt-8 pt-8 border-t text-sm text-gray-500 dark:text-gray-400">
                    Last updated: January 2024
                </div>
            </div>
        </div>
    );
}
