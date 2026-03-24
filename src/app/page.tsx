"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import ScrollReveal from "@/components/ScrollReveal";

const keySections = [
  {
    num: "§201",
    title: "Prohibited Services",
    desc: "Audit firms cannot provide certain non-audit services (bookkeeping, financial systems design, etc.) to their audit clients. Prevents conflicts of interest.",
  },
  {
    num: "§302",
    title: "Corporate Responsibility",
    desc: "CEO and CFO must personally certify the accuracy of financial reports. They are responsible for internal controls and must report any deficiencies.",
  },
  {
    num: "§404",
    title: "Internal Controls",
    desc: "Companies must document, test, and maintain internal controls over financial reporting. External auditors must attest to management's assessment. The most expensive requirement.",
  },
  {
    num: "§409",
    title: "Real-Time Disclosure",
    desc: 'Companies must disclose material changes in financial condition "on a rapid and current basis" — no more hiding bad news until quarterly reports.',
  },
  {
    num: "§802",
    title: "Document Destruction",
    desc: "Criminal penalties for altering, destroying, or concealing records with intent to obstruct an investigation. Up to 20 years imprisonment.",
  },
  {
    num: "§806",
    title: "Whistleblower Protection",
    desc: "Employees who report fraud are protected from retaliation (discharge, demotion, suspension, threats, harassment). Violators face up to 10 years.",
  },
  {
    num: "§906",
    title: "Criminal Certification",
    desc: 'CEOs/CFOs who willfully certify false financial statements face up to $5 million in fines and 20 years in prison. "Willfully" is the key word.',
  },
  {
    num: "PCAOB",
    title: "Audit Oversight Board",
    desc: "Created the Public Company Accounting Oversight Board to register, inspect, and discipline audit firms. Ended self-regulation of the auditing profession.",
  },
];

const timeline = [
  {
    date: "October 2001",
    title: "Enron Collapse",
    desc: "Enron, once the 7th largest US company, files for bankruptcy after revealing massive accounting fraud. $74 billion in shareholder value wiped out. Employees lose retirement savings.",
  },
  {
    date: "January 2002",
    title: "Arthur Andersen Shredding",
    desc: "Enron's auditor, Arthur Andersen (one of the Big Five), is caught shredding tons of documents. The firm collapses, becoming the Big Four.",
  },
  {
    date: "June 2002",
    title: "WorldCom Fraud",
    desc: "WorldCom reveals $3.8 billion in fraudulent accounting entries. CEO Bernie Ebbers later sentenced to 25 years. Largest bankruptcy in US history at the time.",
  },
  {
    date: "July 30, 2002",
    title: "SOX Signed Into Law",
    desc: 'President George W. Bush signs SOX, calling it "the most far-reaching reforms of American business practices since the time of Franklin D. Roosevelt."',
  },
];

const penalties = [
  {
    violation: "Knowingly certifying false financial reports (§906)",
    fine: "Up to $5,000,000",
    prison: "Up to 20 years",
  },
  {
    violation: "Willful non-compliance with certification (§302)",
    fine: "Up to $1,000,000",
    prison: "Up to 10 years",
  },
  {
    violation: "Destroying/altering documents (§802)",
    fine: "Per federal guidelines",
    prison: "Up to 20 years",
  },
  {
    violation: "Retaliation against whistleblowers (§806)",
    fine: "Compensatory damages",
    prison: "Up to 10 years",
  },
  {
    violation: "Securities fraud (§807)",
    fine: "Per federal guidelines",
    prison: "Up to 25 years",
  },
];

const complianceSteps = [
  {
    label: "Risk Assessment",
    desc: "Identify financial reporting risks across the organization",
  },
  {
    label: "Control Documentation",
    desc: "Map every internal control over financial reporting (ICFR)",
  },
  {
    label: "Testing",
    desc: "Regularly test controls to verify they're working — both design and operating effectiveness",
  },
  {
    label: "Remediation",
    desc: "Fix any material weaknesses or significant deficiencies found during testing",
  },
  {
    label: "External Audit",
    desc: "Independent auditors review and attest to the company's ICFR assessment",
  },
  {
    label: "Continuous Monitoring",
    desc: "Ongoing evaluation — controls can degrade over time",
  },
];

const benefits = [
  "Restored investor confidence after the fraud scandals",
  "Improved accuracy and reliability of corporate financial disclosures",
  "Personal accountability — executives can't hide behind the corporate veil",
  "Whistleblower protections encourage internal reporting",
  "Stronger audit independence and oversight via PCAOB",
  "Set a global standard — many countries adopted similar frameworks",
];

const criticisms = [
  "Massive compliance costs, especially for smaller companies",
  "May discourage companies from going public (IPO deterrent)",
  "Didn't prevent the 2008 financial crisis",
  "Box-ticking culture — compliance without genuine risk reduction",
  "US companies at competitive disadvantage vs. foreign firms",
  "Over-reliance on external auditors who may still have conflicts",
];

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center animated-bg border-b-2 border-[var(--accent)]">
        <div className="relative z-10 text-center px-6 py-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight"
          >
            Sarbanes-Oxley Act
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-6"
          >
            The federal law that changed corporate accountability forever — born
            from the ashes of Enron, WorldCom, and a decade of Wall Street fraud.
          </motion.p>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="inline-block bg-[var(--accent)] text-white px-6 py-2 rounded-full font-bold text-sm tracking-wide shadow-lg shadow-[var(--accent-glow)]"
          >
            Enacted July 30, 2002
          </motion.span>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-white/20 rounded-full mx-auto flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="relative z-10 max-w-4xl mx-auto px-5 py-16 space-y-24">
        {/* Overview */}
        <section id="overview">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6 pb-3 border-b border-[#222]">
              What is SOX?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-[#c0c0c0] leading-relaxed mb-4">
              The <strong className="text-white">Sarbanes-Oxley Act of 2002</strong>{" "}
              (SOX) is a United States federal law that established sweeping auditing
              and financial regulations for public companies. Named after Senator
              Paul Sarbanes and Representative Michael Oxley, it was designed to
              protect investors from fraudulent financial reporting by corporations.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-[#c0c0c0] leading-relaxed mb-6">
              The act created the{" "}
              <strong className="text-white">
                Public Company Accounting Oversight Board (PCAOB)
              </strong>{" "}
              to oversee the auditing profession and mandated strict reforms to
              improve financial disclosures, combat corporate fraud, and hold
              executives personally accountable for the accuracy of financial
              statements.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="glass-card p-6 border-l-4 border-l-[var(--accent)] rounded-l-none">
              <strong className="text-white">In plain English:</strong>{" "}
              <span className="text-[#c0c0c0]">
                After Enron and WorldCom vaporized billions in investor money
                through accounting fraud, Congress said &ldquo;never again&rdquo; and made it
                so CEOs can go to prison if they sign off on fake financial
                statements.
              </span>
            </div>
          </ScrollReveal>
        </section>

        {/* History Timeline */}
        <section id="history">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-8 pb-3 border-b border-[#222]">
              How We Got Here
            </h2>
          </ScrollReveal>
          <div className="relative pl-8 border-l-2 border-[var(--accent)]">
            {timeline.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <motion.div
                  className="mb-10 relative"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute -left-[calc(2rem+7px)] top-1.5 w-3 h-3 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)]" />
                  <span className="text-[var(--accent)] font-bold text-sm">
                    {item.date}
                  </span>
                  <h3 className="text-white text-lg font-semibold mt-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#999] text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Key Sections */}
        <section id="sections">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3 pb-3 border-b border-[#222]">
              Key Sections
            </h2>
            <p className="text-[#c0c0c0] mb-8">
              SOX has 11 titles, but these are the sections that matter most:
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {keySections.map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="glass-card glass-card-hover p-6 h-full cursor-default transition-all duration-300"
                >
                  <div className="text-3xl font-extrabold gradient-text mb-2">
                    {s.num}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {s.title}
                  </h3>
                  <p className="text-[#999] text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Penalties */}
        <section id="penalties">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3 pb-3 border-b border-[#222]">
              Penalties
            </h2>
            <p className="text-[#c0c0c0] mb-6">
              SOX has serious teeth. Here&apos;s what happens when you violate it:
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
                      <th className="text-[var(--accent)] text-left px-5 py-4 text-sm font-semibold">
                        Violation
                      </th>
                      <th className="text-[var(--accent)] text-left px-5 py-4 text-sm font-semibold">
                        Fine
                      </th>
                      <th className="text-[var(--accent)] text-left px-5 py-4 text-sm font-semibold">
                        Prison
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {penalties.map((p, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="border-b border-[#1a1a25] hover:bg-[#151520] transition-colors"
                      >
                        <td className="px-5 py-4 text-sm text-[#c0c0c0]">
                          {p.violation}
                        </td>
                        <td className="px-5 py-4 text-sm text-[#c0c0c0] whitespace-nowrap">
                          {p.fine}
                        </td>
                        <td className="px-5 py-4 text-sm text-white font-semibold whitespace-nowrap">
                          {p.prison}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Compliance */}
        <section id="compliance">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3 pb-3 border-b border-[#222]">
              SOX Compliance in Practice
            </h2>
            <p className="text-[#c0c0c0] mb-8">
              For companies, SOX compliance is a continuous process, not a one-time
              checkbox:
            </p>
          </ScrollReveal>
          <div className="space-y-4 mb-8">
            {complianceSteps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ x: 6 }}
                  className="glass-card p-5 flex items-start gap-4 cursor-default"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/40 flex items-center justify-center flex-shrink-0 text-[var(--accent)] font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <strong className="text-white">{step.label}:</strong>{" "}
                    <span className="text-[#b0b0b0] text-sm">{step.desc}</span>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={0.3}>
            <div className="glass-card p-6 border-l-4 border-l-[var(--accent)] rounded-l-none">
              <strong className="text-white">The cost:</strong>{" "}
              <span className="text-[#c0c0c0]">
                SOX 404 compliance costs average{" "}
                <strong className="text-white">$1.3–$2 million annually</strong>{" "}
                for large companies. For smaller public companies, it can consume
                1–2% of revenue. Critics argue this disproportionately burdens
                smaller firms and discourages IPOs.
              </span>
            </div>
          </ScrollReveal>
        </section>

        {/* Impact */}
        <section id="impact">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-8 pb-3 border-b border-[#222]">
              Impact & Legacy
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ScrollReveal delay={0.1} direction="left">
              <div className="glass-card p-6 border border-green-900/50 bg-green-950/20 h-full">
                <h3 className="text-green-400 text-lg font-semibold mb-4">
                  ✅ Benefits
                </h3>
                <ul className="space-y-3">
                  {benefits.map((b, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="text-[#b0b0b0] text-sm flex items-start gap-2"
                    >
                      <span className="text-green-500 mt-0.5">•</span>
                      {b}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1} direction="right">
              <div className="glass-card p-6 border border-red-900/50 bg-red-950/20 h-full">
                <h3 className="text-red-400 text-lg font-semibold mb-4">
                  ❌ Criticisms
                </h3>
                <ul className="space-y-3">
                  {criticisms.map((c, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="text-[#b0b0b0] text-sm flex items-start gap-2"
                    >
                      <span className="text-red-500 mt-0.5">•</span>
                      {c}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Criticism */}
        <section id="criticism">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6 pb-3 border-b border-[#222]">
              The Big Question
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-[#c0c0c0] leading-relaxed mb-4">
              SOX was a reaction to catastrophic fraud. It worked in many ways —
              executives now think twice before signing off on cooked books, auditors
              are more independent, and financial reporting is more transparent.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-[#c0c0c0] leading-relaxed mb-4">
              But it also created a compliance industrial complex worth billions.
              And when 2008 hit, the fraud wasn&apos;t in accounting — it was in the
              financial instruments themselves. SOX was fighting the last war.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="text-[#c0c0c0] leading-relaxed">
              The real lesson?{" "}
              <strong className="text-white">
                Regulation is always reactive.
              </strong>{" "}
              By the time we legislate against one kind of fraud, the next
              generation of fraudsters has already moved on to something new. SOX
              didn&apos;t fail — it just solved a specific problem. The question is
              whether we&apos;re ready for the next Enron, or whether we&apos;ll always be
              one scandal behind.
            </p>
          </ScrollReveal>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-12 border-t border-[#222] text-[#555] text-sm">
        <p>Built by Artemis 🏹 — March 2026</p>
        <p className="mt-1">
          This is an educational resource. Not legal or financial advice.
        </p>
      </footer>
    </>
  );
}
