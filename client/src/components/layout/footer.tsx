import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type LegalKey = "terms" | "privacy" | "accessibility";

const LEGAL_CONTENT: Record<LegalKey, { title: string; body: JSX.Element }> = {
  terms: {
    title: "Terms and Conditions",
    body: (
      <div className="space-y-5 text-sm leading-relaxed text-[#F7F2E8]/85">
        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">
            1. Area of application and generalities
          </h3>
          <p>
            These terms and conditions apply to all legal transactions entered into
            between The Desert Rose Gin Co. Sagl and external contracting parties to
            whom it provides services or to whom it acts as a vendor.
          </p>
          <p>
            Any changes, additional agreements or amendments to a contract must always
            be made in writing. If individual provisions are found to be invalid, the
            validity of the remaining provisions remains unaffected.
          </p>
          <p>
            A contract is concluded upon confirmation of the contract (order
            confirmation) by The Desert Rose Gin Co. Sagl, or upon acceptance of an
            offer issued by The Desert Rose Gin Co. Sagl by the other contracting
            party.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">
            2. Protection of confidentiality
          </h3>
          <p>
            All information acquired in connection with an order, particularly trade
            and industrial secrets and other information communicated by the
            contractor, is treated in strict confidence and may be passed on to third
            parties only with the express written consent of the contractor.
          </p>
          <p>
            Employees and counterparts of The Desert Rose Gin Co. Sagl are subject to
            business, official and professional secrecy.
          </p>
          <p>
            Legal obligations regarding the disclosure of information remain reserved.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">
            3. Costs and payment terms
          </h3>
          <p>
            Costs (fees) and charges for services provided by The Desert Rose Gin Co.
            Sagl are based on the applicable catalog of goods and services or on the
            specific offer submitted.
          </p>
          <p>
            Invoices must be paid within the period specified on the invoice document
            and, in any case, within 30 days of the invoice date. The currency used is
            the Swiss franc (CHF).
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">4. Withdrawal</h3>
          <p>
            The contractor may withdraw from the contract in accordance with the
            mandatory provisions of the Swiss Code of Obligations (CO; RS 220). If
            the withdrawal occurs at an inopportune time, the withdrawing contractor
            is obliged to compensate The Desert Rose Gin Co. Sagl for the damage
            caused.
          </p>
          <p>
            Where an intermediate result has been requested, in addition to the
            services actually rendered, all further expenses necessary for The Desert
            Rose Gin Co. Sagl to complete that intermediate result in a deliverable
            form may be invoiced.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">
            5. Warranty and liability
          </h3>
          <p>
            The Desert Rose Gin Co. Sagl is liable only for damages caused
            intentionally or through gross negligence to the other contracting party
            or to third parties. This applies in particular in the case of
            destruction of or damage to objects of the contracting party and damages
            that result from the use of contractual results (consequential damages).
          </p>
          <p>
            To the extent permitted by law, liability for warranty claims against The
            Desert Rose Gin Co. Sagl is excluded.
          </p>
          <p>
            Any shortcomings and errors in the execution of an order must be notified
            in writing within 10 days of completion. Failure to do so is interpreted
            as a waiver of all claims.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">
            6. Other conditions
          </h3>
          <p>
            If, due to circumstances for which it is not responsible (for example
            strike, transport cancellations, accidents, sudden closure of roads,
            breakdowns, or the unforeseen absence of an employee), The Desert Rose
            Gin Co. Sagl fails to meet an agreed deadline or must discontinue an
            order in progress, no claim for damages arises against the company.
          </p>
          <p>
            An order in progress that has to be interrupted for such reasons is
            billed on the basis of the actual hours worked up to the time of the
            interruption.
          </p>
          <p>
            Transmission of an order to a third party requires the prior consent of
            the other contracting party.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">
            7. Compliance with laws
          </h3>
          <p>
            The client is responsible for complying with all legal and regulatory
            provisions applicable to them, including the obligation to declare and
            pay any taxes.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">
            8. Documents and intellectual property
          </h3>
          <p>
            Documents produced by The Desert Rose Gin Co. Sagl may be transmitted to
            third parties only in complete form.
          </p>
          <p>
            Partial transmission and, in particular, copying of the logo or
            application of The Desert Rose Gin Co. Sagl stickers by the customer is
            prohibited.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">
            9. Jurisdiction and applicable law
          </h3>
          <p>
            All disputes are subject to the exclusive jurisdiction of the courts of
            Lugano, Switzerland.
          </p>
          <p>
            The present general terms and conditions of The Desert Rose Gin Co. Sagl
            apply exclusively. Subsidiarily, the provisions of the Swiss Code of
            Obligations apply. The application of the Vienna Convention on Contracts
            for the International Sale of Goods (CISG) and conflict-of-law rules
            which refer to foreign law is excluded.
          </p>
        </section>
      </div>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    body: (
      <div className="space-y-5 text-sm leading-relaxed text-[#F7F2E8]/85">
        <section>
          <p>
            This page describes how the site is managed with regard to the processing
            of personal data of users who consult it, in accordance with regulations
            on the protection of individuals with regard to the processing of
            personal data and the free flow of such data, as well as the rules on
            privacy in the electronic communications field.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">Data controller</h3>
          <p>
            As part of the consultation of this site, data relating to identified or
            identifiable persons may be processed. The controller of such processing
            is The Desert Rose Gin Co. Sagl (hereinafter, the "Company").
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">
            Place of data processing
          </h3>
          <p>
            Processing related to the web services of the site takes place at the
            Company&apos;s registered office or at the premises of third-party
            companies previously appointed as external data processors. Processing is
            carried out only by technical personnel duly appointed for the task or by
            any persons in charge of occasional maintenance operations.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">Types of data processed</h3>
          <p className="font-semibold text-[#F7F2E8] mt-1">Navigation data</p>
          <p>
            The computer systems and software procedures used to operate this website
            acquire, during their normal operation, some personal data whose
            transmission is implicit in the use of internet communication protocols.
            This information is not collected to be associated with identified data
            subjects, but by its very nature could allow users to be identified.
          </p>
          <p>
            This category of data includes IP addresses or domain names of computers
            used by users who connect to the site, URI addresses of requested
            resources, the time of the request, the method used to submit the
            request, the size of the response, the numerical code indicating the
            status of the response given by the server, and other parameters related
            to the user&apos;s operating system and computer environment.
          </p>
          <p>
            This data is used solely to obtain anonymous statistical information on
            the use of the site and to check its correct functioning, and is deleted
            immediately after processing. The data could be used to ascertain
            responsibility in case of hypothetical computer crimes against the site.
          </p>
        </section>

        <section>
          <p className="font-semibold text-[#F7F2E8] mt-1">
            Data voluntarily provided by the user
          </p>
          <p>
            The optional, explicit and voluntary sending of personal data by the user
            through forms or by uploading material, images or information on this
            site involves the subsequent acquisition of the data provided by the
            sender, which is necessary to process the request. Specific information
            notices are provided on the pages of the site prepared for particular
            services on request.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">Cookies</h3>
          <p>
            The site uses so-called session cookies, strictly limited to the
            transmission of session identifiers necessary to enable safe and
            efficient exploration of the site.
          </p>
          <p>
            If you do not wish to receive any type of cookie on your device, you can
            raise the privacy protection level of your browser using the appropriate
            functions.
          </p>
          <p>
            A cookie is a small text string that a site sends to your browser and
            saves on your computer when you visit websites. Cookies are used to make
            websites work more efficiently, to improve their performance and to
            provide information to site owners.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">
            Consent to processing of personal data
          </h3>
          <p>
            By using this site and, where applicable, submitting forms or
            registrations, the user declares that he or she gives consent to the
            processing of personal data for the purposes indicated, aimed at the
            proper performance of contractual or pre-contractual obligations.
          </p>
        </section>
      </div>
    ),
  },
  accessibility: {
    title: "Accessibility Statement",
    body: (
      <div className="space-y-5 text-sm leading-relaxed text-[#F7F2E8]/85">
        <section>
          <p>
            For The Desert Rose Gin, accessibility is important. We have done our
            best to make this site as accessible as possible and continue to improve
            our accessibility every day. Our goal is to provide a very high level of
            accessibility for everyone, regardless of their ability or device type.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">
            Compliance with guidelines
          </h3>
          <p>
            We strive to implement the Web Content Accessibility Guidelines (WCAG)
            consistently throughout our website. Regular content reviews and quality
            checks are important to us, and continued accessibility improvements are
            made available as we further develop our web platforms.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-[#F7F2E8] mb-1">
            How to use this website
          </h3>
          <p>
            If you cannot use a pointing device such as a mouse, you can control the
            main functionality using the keyboard:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Use the Tab key to move the focus between different controls.</li>
            <li>Hold down Shift + Tab to move focus in reverse order.</li>
            <li>
              Use the space bar or Enter key to activate a selected item or control.
            </li>
          </ul>
        </section>
      </div>
    ),
  },
};

export function Footer() {
  const [openDoc, setOpenDoc] = useState<LegalKey | null>(null);
  const current = openDoc ? LEGAL_CONTENT[openDoc] : null;

  return (
    <>
      <footer className="w-full bg-[#E3C9A6] text-[#2B1810] border-t border-[#C79A5A]/40 pt-10 pb-6 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12">
          {/* Logo + Brand */}
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <img
                src="/logo.png"
                alt="Desert Rose Gin Logo"
                className="h-16 w-auto"
                data-testid="img-footer-logo"
              />
            </div>
            <div>
              <div className="font-lux text-xl tracking-wide text-[#2B1810]">
                Desert Rose Gin
              </div>
              <div className="font-hud text-[10px] tracking-[0.3em] uppercase text-[#4E3022]/80 mt-1">
                London Dry · Saharan Inspired
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2 text-sm font-body">
            <div className="font-hud text-[10px] tracking-[0.25em] uppercase text-[#4E3022]/80">
              Contact us
            </div>
            <div className="space-y-1">
              <a
                href="mailto:info@thedesertrosegin.com"
                className="hover:text-[#C79A5A] transition-colors"
                data-testid="link-email-info"
              >
                info@thedesertrosegin.com
              </a>
              <br />
              <a
                href="mailto:orders@thedesertrosegin.com"
                className="hover:text-[#C79A5A] transition-colors"
                data-testid="link-email-orders"
              >
                orders@thedesertrosegin.com
              </a>
            </div>
            <div className="pt-2">
              <a
                href="https://www.instagram.com/desert_rosegin_official/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm hover:text-[#C79A5A] transition-colors"
                data-testid="link-instagram"
              >
                <span className="font-hud text-[10px] tracking-[0.25em] uppercase">
                  Instagram
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Legal bar */}
        <div className="max-w-6xl mx-auto mt-8 border-t border-[#C79A5A]/30 pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-4 text-[11px] font-hud uppercase tracking-[0.25em]">
            <button
              type="button"
              onClick={() => setOpenDoc("terms")}
              className="text-[#4E3022]/80 hover:text-[#2B1810] hover:underline underline-offset-4"
              data-testid="button-terms"
            >
              Terms of Use
            </button>
            <button
              type="button"
              onClick={() => setOpenDoc("privacy")}
              className="text-[#4E3022]/80 hover:text-[#2B1810] hover:underline underline-offset-4"
              data-testid="button-privacy"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setOpenDoc("accessibility")}
              className="text-[#4E3022]/80 hover:text-[#2B1810] hover:underline underline-offset-4"
              data-testid="button-accessibility"
            >
              Accessibility Statement
            </button>
          </div>

          <p className="text-[11px] font-hud text-[#4E3022]/80 leading-relaxed">
            © 2025 The Desert Rose Gin Co. Sagl. All rights reserved · Piazzetta San
            Carlo, 2, 6900 Lugano, Switzerland
          </p>
        </div>
      </footer>

      {/* Legal modal */}
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[12000] flex items-center justify-center px-4 py-8 bg-[#2B1810]/70 backdrop-blur-sm"
            data-testid="modal-legal"
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative max-w-3xl w-full max-h-[80vh] overflow-y-auto bg-gradient-to-b from-[#2B1810] via-[#4E3022] to-[#2B1810] border border-[#C79A5A]/50 shadow-2xl p-6 md:p-8"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setOpenDoc(null)}
                className="absolute top-4 right-4 p-1 rounded-full border border-[#C79A5A]/50 text-[#F7F2E8]/80 hover:bg-[#C79A5A] hover:text-[#2B1810] transition-colors"
                aria-label="Close"
                data-testid="button-modal-close"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="font-lux text-2xl md:text-3xl text-[#F7F2E8] mb-4 pr-10">
                {current.title}
              </h2>
              <div className="text-xs font-hud uppercase tracking-[0.25em] text-[#C79A5A]/70 mb-4">
                The Desert Rose Gin Co. Sagl
              </div>

              {current.body}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
