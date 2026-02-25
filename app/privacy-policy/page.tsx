export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-28">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>

        <div className="mt-6 space-y-2 text-sm text-fg/85">
          <p><span className="font-semibold">App Name:</span> Vanish Vault</p>
          <p><span className="font-semibold">Developer:</span> Hemadri Kurukuti</p>
          <p><span className="font-semibold">Contact:</span> techinnovatelabs2@gmail.com</p>
          <p><span className="font-semibold">Effective Date:</span> Februvary 17, 2025</p>
        </div>

        <div className="mt-8 space-y-6 text-sm leading-7 text-fg/85">
          <section>
            <h2 className="text-lg font-semibold text-fg">1. Overview</h2>
            <p>
              Your privacy is our priority. This Privacy Policy outlines how the Habituated
              application manages and safeguards user information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-fg">2. Information We Collect</h2>
            <p>
              We do not collect, store, or process any personal or sensitive information from users.
              Specifically, the application does not gather:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Personally identifiable information (e.g., name, age, gender)</li>
              <li>Location data</li>
              <li>Device identifiers or hardware details</li>
              <li>Usage analytics or diagnostic data</li>
              <li>Payment or financial information</li>
              <li>Any other form of personal data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-fg">3. Data Storage</h2>
            <p>
              All information entered or generated within the app is stored locally on your device.
              No data is transmitted to external servers, cloud storage, or any remote infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-fg">4. Third-Party Services</h2>
            <p>
              The application does not integrate or utilize any third-party services or software
              development kits (SDKs), including but not limited to Firebase, Google Maps, or social
              media SDKs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-fg">5. Data Sharing</h2>
            <p>No user data is disclosed, sold, or otherwise shared with any third party.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-fg">6. Children’s Privacy</h2>
            <p>
              We do not knowingly collect any personal information from children. Should we become
              aware that personal information has been inadvertently provided through any channel
              outside the app, we will take prompt measures to remove it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-fg">7. Security</h2>
            <p>
              As all data is stored solely on the device, maintaining security is the responsibility
              of the user. This includes implementing screen locks, keeping the operating system
              updated, and performing regular backups.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-fg">8. Changes to This Policy</h2>
            <p>
              We may revise this Privacy Policy periodically to align with updates to the application
              or changes in legal requirements. The updated version will be published on this page
              with a new effective date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-fg">9. Contact Us</h2>
            <p>
              For any queries or concerns regarding this Privacy Policy, please contact:
              techinnovatelabs2@gmail.com
            </p>
          </section>

          <section className="rounded-xl border border-border bg-muted/50 p-4">
            <p>
              <span className="font-semibold">Note:</span> If future updates introduce new
              functionalities such as analytics, remote data storage, or cloud synchronization, this
              Privacy Policy — and your Google Play Data Safety disclosures — must be updated
              accordingly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
