import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// Legal Content Data
type LegalKey = "terms" | "privacy" | "accessibility";

const LEGAL_CONTENT: Record<LegalKey, { title: string; body: JSX.Element }> = {
  terms: {
    title: "Terms and Conditions",
    body: (
      <div className="space-y-4 text-xs leading-relaxed text-[#F7F2E8]/85">
        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">1. Area of application and generalities</h3>
          <p>These terms and conditions apply to all legal transactions entered into between The Desert Rose Gin Co. Sagl and outside contracting parties to whom it provides services or to whom it acts as a vendor.</p>
          <p className="mt-2">Any changes, necessary agreements and additions to the legal negotiations put in place require to be expressed always in writing.</p>
          <p className="mt-2">If individual provisions are found to be invalid, the validity of other provisions remains unaffected.</p>
          <p className="mt-2">A contract is concluded upon confirmation of the contract (order confirmation) by The Desert Rose Gin Co. Sagl, or upon acceptance of the offer of The Desert Rose Gin Co. Sagl by the other contracting party.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">2. Protection of confidentiality</h3>
          <p>2.1 All information acquired by reason of the order, particularly trade and industrial secrets as well as information spontaneously communicated otherwise, will be treated in strict confidence and may be passed on to third parties only with the express written consent of the contractor.</p>
          <p className="mt-2">2.2 Employees and counterparts of The Desert Rose Gin Co. Sagl are subject to business and official secrecy; they are also bound by professional secrecy.</p>
          <p className="mt-2">2.3 This is without prejudice to legal obligations regarding the disclosure of information that METAS in principle treats as confidential.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">3. Costs and payment terms</h3>
          <p>3.1 Costs (fees) and charges for services provided by The Desert Rose Gin Co. Sagl shall be based on the catalog of goods and services applicable in the particular case or the bid submitted.</p>
          <p className="mt-2">3.2 Invoices must be paid within the period specified in the invoice document, however, within 30 days after the invoice is issued. The currency used is the Swiss franc.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">4. Withdrawal</h3>
          <p>The contractor may withdraw from the contract in accordance with the mandatory provisions of the Code of Obligations of March 30, 1911 (CO; RS 220). If the withdrawal occurs at an inopportune time, the withdrawing contractor is obliged to compensate The Desert Rose Gin Co. Sagl, for the damage caused. If an intermediate result is required, in addition to the services already actually rendered, all further expenses necessary for The Desert Rose Gin Co. Sagl to render that result in a condition to be delivered to the customer may be billed.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">5. Warranty and Liability</h3>
          <p>The Desert Rose Gin Co. Sagl shall only be liable for damages caused intentionally or through gross negligence to the other contracting party or to third parties. This applies in particular in the case of destruction of or damage to objects of the contracting party and damages that result to the contracting party or third parties from the use of the contractual results produced (consequential damages).</p>
          <p className="mt-2">Liability for warranty claims against The Desert Rose Gin Co. Sagl, to the extent permitted by law, is excluded.</p>
          <p className="mt-2">In order to enforce any claims and demands, shortcomings and errors in the execution of the order must be notified in written form within 10 days after the completion of the order; failure to do so is intense as a waiver of all claims.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">6. Other conditions</h3>
          <p>If, due to circumstances for which it is not responsible (strike, cancellation of flights or trains, accident, sudden barring of roads or routes that are no longer practicable, breakdown, unforeseen absence of an employee e.g. due to illness or otherwise), The Desert Rose Gin Co. Sagl fails to meet the agreed deadline or has to discontinue an order in progress due to circumstances for which it is not responsible, no claim for damages exists against The Desert Rose Gin Co. Sagl.</p>
          <p className="mt-2">An order in progress that has to be interrupted for the reasons mentioned in the article is billed based on the actual hours worked up to the time of the interruption.</p>
          <p className="mt-2">Transmission of the order to a third party requires the prior consent of the other contracting party.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">7. Compliance with laws</h3>
          <p>The client is responsible for complying with the legal and regulatory provisions applicable to him. This includes, among other things, the obligation to declare taxes and pay them.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">8. Documents and intellectual property</h3>
          <p>Documents produced by The Desert Rose Gin Co. Sagl may be transmitted to third parties only if in complete form.</p>
          <p className="mt-2">Partial transmission and especially copying of the logo or application of The Desert Rose Gin Co. Sagl stickers by the customer are prohibited.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">9. Jurisdiction and applicable law</h3>
          <p>Jurisdiction: all disputes are under the jurisdiction of the court of Lugano.</p>
          <p className="mt-2">The present general terms and conditions of The Desert Rose Gin Co. Sagl apply exclusively, and the provisions of the Swiss Code of Obligations apply subsidiarily: the application of the Vienna Convention on Contracts of Sale (CISG) as well as the collision rules (notably the Federal Act of December 18, 1987 on Private International Law [IPRG; SR 291]), which refer to foreign law, is excluded.</p>
        </section>
      </div>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    body: (
      <div className="space-y-4 text-xs leading-relaxed text-[#F7F2E8]/85">
        <p>This page describes how the site is managed with regard to the processing of personal data of users who consult it, in accordance with the regulations on the "protection of individuals with regard to the processing of personal data and the free flow of such data, as well as the Regulation on the processing of personal data and the protection of privacy in the electronic communications field.</p>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">DATA CONTROLLER</h3>
          <p>As part of the consultation of this site, data relating to identified or identifiable persons may be processed. The "Owner" of their processing The Desert Rose Gin Co. Sagl (hereinafter "The Company").</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">PLACE OF DATA PROCESSING</h3>
          <p>The processing of data collected through the website www.thedesertrosegin.com takes place at the headquarters of the company Data Controller, or at the headquarters of third parties companies, previously appointed as external Data Processors pursuant to, are handled only by technical personnel duly appointed for the processing, or by any persons in charge of occasional maintenance operations.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">TYPES OF DATA PROCESSED</h3>

          <h4 className="font-medium text-[#F7F2E8] mt-3 mb-1">Navigation data</h4>
          <p>The computer systems and software procedures used to operate this website acquire, during their normal operation, some personal data whose transmission is implicit in the use of Internet communication protocols. This is information that is not collected to be associated with identified data subjects, but which by its very nature could allow users to be identified. This category of data includes the IP addresses or domain names of the computers used by users who connect to the site, the URI (Uniform Resource Identifier) notation addresses of the requested resources, the time of the request, the method used in submitting the request to the server, the size of the file obtained in response, the numerical code indicating the status of the response given by the server (successful, error, etc.) and other parameters relating to the user's operating system and computer environment.</p>

          <p className="mt-2">This data is used for the sole purpose of obtaining anonymous statistical information on the use of the site and to check its correct operation and is deleted immediately after processing. The data could, in addition, be used to ascertain responsibility in case of hypothetical computer crimes against the site.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">DATA VOLUNTARILY PROVIDED BY THE USER</h3>
          <p>The optional, explicit and voluntary sending of personal data by the user in the registration forms or by uploading material, images or information on this site involves the subsequent acquisition of the data provided by the sender, necessary for participation in the contest. Specific summary information will be reported or displayed on the pages of the site set up for particular services on request.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">COOKIES</h3>
          <p>The site uses so-called session cookies. The use of so-called session cookies is strictly limited to the transmission of session identifiers (consisting of random numbers generated by the server) necessary to enable the safe and efficient exploration of the site. However, if you do not wish to receive any type of cookies on your computer, either from this site or from others, you can raise the privacy protection level of your browser using the appropriate function.</p>

          <h4 className="font-medium text-[#F7F2E8] mt-3 mb-1">WHAT IS A COOKIE AND WHAT IS IT USED FOR?</h4>
          <p>A cookie is a small string of text that a site sends to your browser and saves on your computer when you visit websites. Cookies are used to make websites work more efficiently, to improve their performance, and also to provide information to site owners.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">MANIFESTATION OF CONSENT TO THE PROCESSING OF PERSONAL DATA</h3>
          <p>The undersigned declares that he/she gives his/her consent to the processing of personal data for the purposes indicated therein aimed at the proper performance of contractual obligations.</p>
        </section>
      </div>
    ),
  },
  accessibility: {
    title: "Accessibility",
    body: (
      <div className="space-y-4 text-xs leading-relaxed text-[#F7F2E8]/85">
        <p>For The Desert Rose Gin, accessibility is important. We have done our best to make this site as accessible as possible and continue to improve our accessibility every day. We are working to make the website www.thedesertrosegin.com usable by everyone, regardless of their ability or device type. Our goal is to provide a very high level of accessibility for everyone with vision, hearing, and mobility impairments.</p>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">COMPLIANCE WITH GUIDELINES</h3>
          <p>We strive to implement the Web Content Accessibility Guidelines (WCAG) consistently throughout www.thedesertrosegin.com Regular content review and quality checks are important to us. As we continue to develop our web platforms, continuous accessibility improvements are made available.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">HOW TO USE THIS WEBSITE</h3>
          <p>If you cannot use a pointing device such as a mouse, you can control functionality using the keyboard:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
            <li>Use the "Tab" key to move the focus of the keyboard between different controls;</li>
            <li>Hold down the "Shift" key to shift attention in reverse order;</li>
            <li>Use the space bar or the "Enter" key to activate an item.</li>
          </ul>
        </section>
      </div>
    ),
  },
};

export function Footer() {
  const [openDoc, setOpenDoc] = useState<LegalKey | null>(null);
  const current = openDoc ? LEGAL_CONTENT[openDoc] : null;

  // Modal component to be rendered via Portal
  const modalContent = current ? (
    <AnimatePresence>
      <motion.div
        key="modal-overlay"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#2B1810]/95 backdrop-blur-md p-4"
        onClick={() => setOpenDoc(null)}
      >
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }} 
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#2B1810] border-2 border-[#CD7E31]/40 rounded-lg p-6 md:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative"
        >
          <button 
            onClick={() => setOpenDoc(null)} 
            className="absolute top-4 right-4 md:top-6 md:right-6 text-[#F5EFE6]/60 hover:text-[#CD7E31] transition-colors z-10 bg-[#2B1810]/80 rounded-full p-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="font-lux text-2xl md:text-3xl text-[#F5EFE6] mb-2 pr-8">{current.title}</h2>
          <div className="w-12 h-0.5 bg-[#CD7E31] mb-6" />

          <div className="pr-2">
            {current.body}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  ) : null;

  return (
    <>
      {/* Footer - 10% Taller */}
      <footer className="w-full bg-[#2B1810]/90 backdrop-blur-sm text-[#F5EFE6] border-t border-[#CD7E31]/20 py-5 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Single Row Layout */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">

            {/* Brand - Compact */}
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Desert Rose" className="h-9 w-auto opacity-90" />
              <div className="flex flex-col">
                <span className="font-lux text-sm tracking-wide text-[#F5EFE6]">Desert Rose</span>
                <span className="font-hud text-[7px] tracking-[0.3em] uppercase text-[#CD7E31]">Est. Switzerland 2020</span>
              </div>
            </div>

            {/* Contact - Compact */}
            <div className="flex items-center gap-6 text-xs text-[#F5EFE6]/70">
              <a href="mailto:info@thedesertrosegin.com" className="hover:text-[#CD7E31] transition-colors">
                info@thedesertrosegin.com
              </a>
              <span>+41 91 605 52 63</span>
            </div>

            {/* Social Links - Compact */}
            <div className="flex items-center gap-4 text-xs text-[#F5EFE6]/70">
              <a href="#" className="hover:text-[#CD7E31] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[#CD7E31] transition-colors">Facebook</a>
            </div>

            {/* Legal - Compact */}
            <div className="flex items-center gap-4">
              {(['terms', 'privacy', 'accessibility'] as LegalKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setOpenDoc(key)}
                  className="text-[8px] font-hud uppercase tracking-widest text-[#F5EFE6]/40 hover:text-[#CD7E31] transition-colors"
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Copyright - Compact */}
            <p className="text-[8px] font-hud text-[#F5EFE6]/40 tracking-wider">
              © 2025 DESERT ROSE GIN CO.
            </p>
          </div>
        </div>
      </footer>

      {/* Legal Modal - Rendered via Portal to document.body */}
      {typeof document !== 'undefined' && modalContent && createPortal(
        modalContent,
        document.body
      )}
    </>
  );
}