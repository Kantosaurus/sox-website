"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import confetti from "canvas-confetti";
import AnimatedBackground from "@/components/AnimatedBackground";

type ControlDomain = "MC" | "OS" | "DB" | "MA" | "ALL";

interface Question {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
  domain: ControlDomain;
}

const domainLabels: Record<ControlDomain, string> = {
  MC: "Management Controls",
  OS: "Operational Security",
  DB: "Database Controls",
  MA: "Monitoring & Audit",
  ALL: "All Domains",
};

const domainColors: Record<ControlDomain, string> = {
  MC: "#3b82f6",
  OS: "#f59e0b",
  DB: "#10b981",
  MA: "#8b5cf6",
  ALL: "#e94560",
};

const allQuestions: Question[] = [
  // ===== MC — Management Controls =====
  {
    q: "Sea Limited (NYSE: SE) is the parent company of Shopee, Garena, and Monee. Under SOX, who at Sea Ltd bears ultimate responsibility for certifying the accuracy of consolidated financial statements?",
    options: ["The internal audit team", "CEO (Forrest Li) and CFO", "The PCAOB", "Each subsidiary CEO independently"],
    answer: 1,
    explanation: "Under SOX Section 302, the CEO and CFO of the publicly listed entity (Sea Limited) must personally certify the accuracy and completeness of consolidated financial reports, which include all subsidiaries — Shopee, Garena, and Monee.",
    domain: "MC",
  },
  {
    q: "Shopee operates across 13+ markets in Southeast Asia and Latin America. What is the primary SOX management control challenge for Shopee's multi-jurisdictional operations?",
    options: ["Language translation of financial reports", "Ensuring consistent internal controls over financial reporting (ICFR) across all regional entities", "Hiring local auditors in every country", "Filing separate 10-K reports per country"],
    answer: 1,
    explanation: "For a multinational subsidiary like Shopee, SOX requires consistent ICFR across all material entities. Management must ensure that each regional operation follows the same control framework and that material weaknesses in any market are escalated and reported in Sea's consolidated assessment.",
    domain: "MC",
  },
  {
    q: "Garena's digital entertainment segment generates revenue through in-game purchases (e.g., Free Fire). Under SOX management controls, how should Garena handle revenue recognition for virtual goods?",
    options: ["Recognize all revenue at point of purchase", "Apply ASC 606 with controls ensuring revenue is recognized over the service period for consumable items", "Defer all revenue until the game is discontinued", "Let each game studio decide independently"],
    answer: 1,
    explanation: "SOX requires robust management controls over revenue recognition. For virtual goods under ASC 606, Garena must have controls ensuring consumable items are recognized over their estimated usage period, while durable items may be recognized differently. This is a key control area for gaming companies.",
    domain: "MC",
  },
  {
    q: "Monee (formerly SeaMoney) operates digital financial services including MariBank. What additional SOX management control layer applies to Monee compared to Shopee?",
    options: ["Monee is exempt from SOX as a fintech", "Dual compliance with financial services regulations (MAS) AND SOX internal controls", "Only anti-money laundering controls apply", "Monee files separately with the SEC"],
    answer: 1,
    explanation: "Monee faces overlapping compliance requirements: SOX ICFR as a subsidiary of NYSE-listed Sea Ltd, PLUS financial services regulations from the Monetary Authority of Singapore (MAS) and other regulators. Management controls must address both frameworks simultaneously.",
    domain: "MC",
  },
  {
    q: "Sea Limited's Audit Committee oversees SOX compliance across all subsidiaries. Which of these is NOT typically a responsibility of Sea's Audit Committee?",
    options: ["Appointing and overseeing the external auditor", "Reviewing Shopee's quarterly GMV targets", "Overseeing the internal audit function", "Evaluating material weaknesses in ICFR"],
    answer: 1,
    explanation: "The Audit Committee's SOX responsibilities include auditor oversight, internal audit, whistleblower mechanisms, and ICFR evaluation. Operational metrics like Shopee's GMV targets are business KPIs, not Audit Committee responsibilities under SOX.",
    domain: "MC",
  },

  // ===== OS — Operational Security =====
  {
    q: "Shopee processes millions of e-commerce transactions daily across Southeast Asia. Under SOX operational security controls, what is the most critical control for Shopee's payment processing systems?",
    options: ["Monthly manual reconciliation", "Automated segregation of duties with real-time transaction logging and access controls", "Annual penetration testing only", "Relying on payment gateway vendors for all controls"],
    answer: 1,
    explanation: "SOX requires continuous operational controls over financially significant systems. For Shopee's payment processing, automated segregation of duties prevents unauthorized transactions, while real-time logging ensures a complete audit trail. Annual testing alone is insufficient for high-volume e-commerce.",
    domain: "OS",
  },
  {
    q: "Garena's Free Fire has 100M+ daily active users generating in-game purchase data. What SOX operational security control is essential for protecting this financial data?",
    options: ["Encrypting only credit card numbers", "End-to-end encryption, access controls, and automated monitoring of all systems processing financial transactions related to virtual purchases", "Relying on Google Play / App Store security", "Physical security of data centers only"],
    answer: 1,
    explanation: "SOX operational security requires comprehensive protection of all systems that process, store, or transmit financial data. For Garena, this includes in-app purchase records, revenue recognition data, and payment processing — requiring encryption, access controls, and monitoring beyond what app stores provide.",
    domain: "OS",
  },
  {
    q: "MariBank (under Monee) handles customer deposits and lending. Which SOX operational security control specifically applies to MariBank's digital banking infrastructure?",
    options: ["Annual SOC 1 report from cloud providers only", "Logical access management with multi-factor authentication, privileged access monitoring, and automated alerts for unusual financial system access", "Firewall configuration reviews once per year", "Outsourcing all security to MAS"],
    answer: 1,
    explanation: "Digital banking requires stringent SOX operational controls: MFA for all financial system access, continuous monitoring of privileged accounts, and real-time alerting. These controls protect the integrity of financial data that flows into Sea's consolidated statements.",
    domain: "OS",
  },
  {
    q: "Shopee's seller payout system disburses funds to millions of merchants. What SOX control addresses the risk of fraudulent disbursements?",
    options: ["Manual approval for every transaction", "Automated validation rules with segregation of duties between transaction initiation, approval, and disbursement, plus exception reporting", "Disbursing only once per month", "Requiring sellers to verify each payment"],
    answer: 1,
    explanation: "SOX requires controls that prevent and detect unauthorized disbursements at scale. For Shopee's high-volume seller payouts, automated validation rules with proper segregation of duties and exception-based reporting provide effective control without creating operational bottlenecks.",
    domain: "OS",
  },
  {
    q: "Sea Limited operates across multiple cloud environments for Shopee, Garena, and Monee. What is the key SOX operational security concern for Sea's multi-cloud architecture?",
    options: ["Choosing the cheapest cloud provider", "Ensuring consistent security controls, access management, and audit logging across all cloud environments that host financially significant applications", "Using only one cloud provider", "Cloud security is the provider's responsibility, not Sea's"],
    answer: 1,
    explanation: "Under SOX, Sea retains responsibility for controls over financially significant systems regardless of hosting. Consistent security baselines, centralized access management, and unified audit logging across all cloud environments are essential for demonstrating effective ICFR.",
    domain: "OS",
  },

  // ===== DB — Database Controls =====
  {
    q: "Shopee's e-commerce platform stores order, payment, and financial data across distributed databases. What SOX database control ensures data integrity for financial reporting?",
    options: ["Daily full database backups only", "Automated reconciliation controls between transactional databases and financial reporting systems, with change data capture and integrity checks", "Allowing developers direct access to production databases", "Manual data entry verification"],
    answer: 1,
    explanation: "SOX requires controls ensuring data completeness and accuracy from source systems to financial reports. For Shopee's distributed architecture, automated reconciliation between transactional DBs and reporting systems, combined with change data capture, ensures no financial data is lost or altered in transit.",
    domain: "DB",
  },
  {
    q: "Garena needs to track virtual currency transactions (e.g., Diamonds in Free Fire) for revenue recognition. What database control is most important for SOX compliance?",
    options: ["Storing all data in a single table", "Immutable transaction logs with database audit trails that capture all changes to virtual currency balances and purchase records", "Allowing game developers to modify transaction records for bug fixes", "Backing up data weekly"],
    answer: 1,
    explanation: "Virtual currency transactions directly impact revenue recognition. SOX requires immutable audit trails for financial data — meaning once a Diamond purchase is recorded, it cannot be altered without detection. Database audit trails must capture who changed what, when, and why.",
    domain: "DB",
  },
  {
    q: "MariBank stores customer financial data including deposits, loans, and interest calculations. Under SOX database controls, what is required for direct database modifications?",
    options: ["Any DBA can make changes as needed", "Formal change management process with documented approval, pre/post change validation, segregation between requestor and executor, and complete audit trail", "Changes are fine as long as they're reversed if wrong", "Only the application should modify data; direct DB access is never permitted"],
    answer: 1,
    explanation: "SOX requires strict change management for financial databases. Direct modifications to MariBank's data must follow a formal process: documented business justification, independent approval, segregation of duties, pre/post validation, and a complete audit trail. While minimizing direct access is best practice, a controlled process must exist.",
    domain: "DB",
  },
  {
    q: "Sea Limited consolidates financial data from Shopee (e-commerce), Garena (gaming), and Monee (fintech) into a single reporting system. What database control addresses intercompany elimination risks?",
    options: ["Manual spreadsheet reconciliation", "Automated intercompany matching and elimination controls in the consolidation database with exception reporting for mismatches", "Each subsidiary reports independently to the SEC", "Only eliminating transactions above $1 million"],
    answer: 1,
    explanation: "Intercompany transactions between Sea's subsidiaries (e.g., Shopee using Monee's payment services, or Garena advertising on Shopee) must be properly eliminated in consolidation. Automated matching controls with exception reporting ensure completeness and accuracy of eliminations — a key SOX risk area for conglomerates.",
    domain: "DB",
  },
  {
    q: "Shopee's database infrastructure must support SOX data retention requirements. What is the minimum retention period for financial records under SOX Section 802?",
    options: ["3 years", "5 years", "7 years", "10 years"],
    answer: 2,
    explanation: "SOX Section 802 requires retention of audit and review workpapers for at least 7 years. While general business records may have shorter requirements, financial records, emails related to audits, and workpapers must be retained for 7 years. Shopee's databases must enforce appropriate retention policies.",
    domain: "DB",
  },

  // ===== MA — Monitoring & Audit =====
  {
    q: "Sea Limited's internal audit team needs to assess SOX controls across Shopee, Garena, and Monee. What approach is most effective for a conglomerate with diverse business lines?",
    options: ["Identical audit procedures for all subsidiaries", "Risk-based scoping that considers each subsidiary's unique financial processes, materiality, and risk profile, with tailored testing procedures", "Auditing only the largest subsidiary (Shopee)", "Outsourcing all internal audit to the external auditor"],
    answer: 1,
    explanation: "A risk-based approach recognizes that Shopee (e-commerce), Garena (gaming), and Monee (fintech) have fundamentally different financial processes and risks. Effective SOX monitoring requires tailored audit procedures that address each subsidiary's specific control environment and material accounts.",
    domain: "MA",
  },
  {
    q: "Shopee's ShopeePay processes digital wallet transactions across multiple countries. What continuous monitoring control should be in place for SOX compliance?",
    options: ["Quarterly manual review of sample transactions", "Automated transaction monitoring with real-time anomaly detection, daily reconciliation dashboards, and automated escalation of exceptions exceeding defined thresholds", "Annual audit by external auditors only", "Monitoring only transactions above $10,000"],
    answer: 1,
    explanation: "For high-volume fintech operations like ShopeePay, SOX requires continuous monitoring — not just periodic reviews. Automated anomaly detection, daily reconciliations, and threshold-based escalation provide real-time visibility into control effectiveness and enable timely identification of issues.",
    domain: "MA",
  },
  {
    q: "Garena discovers a bug that caused Free Fire to double-count certain in-app purchases for 2 weeks. Under SOX monitoring and audit requirements, what must happen?",
    options: ["Fix the bug quietly and adjust next quarter", "Assess materiality, quantify the financial impact, evaluate whether it constitutes a material weakness or significant deficiency, remediate, and disclose if material", "Report it to the FBI immediately", "Garena is not subject to SOX monitoring"],
    answer: 1,
    explanation: "SOX monitoring requires that control deficiencies are properly assessed and classified. A revenue double-counting bug must be evaluated for materiality, the financial impact quantified, and the root cause addressed. If material, it must be disclosed as a material weakness in Sea's ICFR assessment.",
    domain: "MA",
  },
  {
    q: "Monee's MariBank undergoes both MAS regulatory examinations and SOX audits. How should Sea's monitoring framework handle overlapping audit requirements?",
    options: ["Conduct completely separate audits with no coordination", "Implement an integrated assurance framework that maps MAS regulatory controls to SOX ICFR requirements, avoiding duplicate testing where controls satisfy both frameworks", "Prioritize MAS over SOX since it's a bank", "Let external auditors figure it out"],
    answer: 1,
    explanation: "An integrated assurance framework reduces audit fatigue and cost while ensuring comprehensive coverage. Many MAS controls (e.g., access management, transaction monitoring, data integrity) overlap with SOX requirements. Mapping these allows efficient testing that satisfies both regulators.",
    domain: "MA",
  },
  {
    q: "Sea Limited's external auditor identifies a significant deficiency in Shopee's accounts payable process during the SOX 404 audit. What is the required next step?",
    options: ["Ignore it if the dollar amount is small", "Management must evaluate whether it could be a material weakness, develop a remediation plan with timeline, and disclose in the annual 10-K filing if it rises to material weakness level", "Switch to a different external auditor", "Only report it to the Audit Committee verbally"],
    answer: 1,
    explanation: "Under SOX 404, significant deficiencies must be reported to the Audit Committee and management. Management evaluates whether it could be a material weakness (reasonably possible that a material misstatement would not be prevented or detected). Remediation plans must be documented, and material weaknesses must be disclosed in the 10-K.",
    domain: "MA",
  },
];

const domains: ControlDomain[] = ["ALL", "MC", "OS", "DB", "MA"];
const letters = ["A", "B", "C", "D"];

function fireConfetti() {
  const count = 200;
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

export default function QuizPage() {
  const [selectedDomain, setSelectedDomain] = useState<ControlDomain>("ALL");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(allQuestions);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(allQuestions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [direction, setDirection] = useState(1);
  const confettiFired = useRef(false);

  const startQuiz = (domain: ControlDomain) => {
    const filtered = domain === "ALL" ? allQuestions : allQuestions.filter(q => q.domain === domain);
    setQuestions(filtered);
    setAnswers(new Array(filtered.length).fill(null));
    setSelectedDomain(domain);
    setCurrentQ(0);
    setShowResults(false);
    setQuizStarted(true);
    confettiFired.current = false;
  };

  const score = answers.reduce<number>(
    (acc, a, i) => acc + (a === questions[i]?.answer ? 1 : 0),
    0
  );
  const answered = answers.filter((a) => a !== null).length;
  const accuracy =
    answered > 0 ? Math.round((score / answered) * 100) : null;

  const selectAnswer = useCallback(
    (optionIndex: number) => {
      if (answers[currentQ] !== null) return;
      const newAnswers = [...answers];
      newAnswers[currentQ] = optionIndex;
      setAnswers(newAnswers);

      // Auto-advance after delay
      setTimeout(() => {
        if (currentQ < questions.length - 1) {
          setDirection(1);
          setCurrentQ((q) => q + 1);
        } else {
          // Check if all answered
          const allAnswered = newAnswers.every((a) => a !== null);
          if (allAnswered) {
            setShowResults(true);
          }
        }
      }, 1200);
    },
    [answers, currentQ]
  );

  const goToQuestion = (index: number) => {
    setDirection(index > currentQ ? 1 : -1);
    setCurrentQ(index);
  };

  const restart = () => {
    setQuizStarted(false);
    setAnswers(new Array(questions.length).fill(null));
    setCurrentQ(0);
    setShowResults(false);
    confettiFired.current = false;
  };

  // Fire confetti on perfect score
  useEffect(() => {
    if (showResults && score === questions.length && !confettiFired.current) {
      confettiFired.current = true;
      fireConfetti();
      setTimeout(fireConfetti, 500);
      setTimeout(fireConfetti, 1200);
    }
  }, [showResults, score]);

  const q = questions[currentQ];
  const currentAnswer = answers[currentQ];
  const isCorrect = currentAnswer === q.answer;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <>
      <AnimatedBackground />

      {/* Hero */}
      <section className="relative animated-bg border-b-2 border-[var(--accent)] pt-20 pb-14 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-white mb-3"
        >
          🧠 SOX Control Domain Quiz
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto"
        >
          Test your knowledge of SOX controls applied to Sea Limited (NYSE: SE) and its subsidiaries — Shopee, Garena & Monee.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <Link
            href="/"
            className="text-[var(--accent)] hover:underline text-sm"
          >
            ← Back to SOX Guide
          </Link>
        </motion.div>
      </section>

      <div className="relative z-10 max-w-3xl mx-auto px-5 py-10">
        {/* Domain Selector */}
        {!quizStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-white text-xl font-semibold mb-4 text-center">Select a Control Domain</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {domains.map((d) => {
                const count = d === "ALL" ? allQuestions.length : allQuestions.filter(q => q.domain === d).length;
                return (
                  <motion.button
                    key={d}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startQuiz(d)}
                    className="glass-card p-5 text-left transition-all hover:border-[var(--accent)] cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: domainColors[d] }}
                      />
                      <span className="text-white font-bold text-sm">{d === "ALL" ? "ALL DOMAINS" : d}</span>
                      <span className="text-[#666] text-xs ml-auto">{count} questions</span>
                    </div>
                    <p className="text-[#999] text-sm">{domainLabels[d]}</p>
                    {d !== "ALL" && (
                      <p className="text-[#555] text-xs mt-1">
                        {d === "MC" && "Governance, certifications, audit committees, org structure"}
                        {d === "OS" && "Access controls, segregation of duties, system security"}
                        {d === "DB" && "Data integrity, audit trails, retention, reconciliation"}
                        {d === "MA" && "Internal audit, continuous monitoring, deficiency assessment"}
                      </p>
                    )}
                    {d === "ALL" && (
                      <p className="text-[#555] text-xs mt-1">
                        All control domains — MC, OS, DB, MA — comprehensive assessment
                      </p>
                    )}
                  </motion.button>
                );
              })}
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-[#888] text-xs">
                Questions are based on real-world SOX scenarios for <strong className="text-white">Sea Limited</strong> (Shopee, Garena, Monee/MariBank)
              </p>
            </div>
          </motion.div>
        )}

        {/* Score bar */}
        {quizStarted && <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: domainColors[selectedDomain] }}
            />
            <span className="text-white text-sm font-semibold">
              {selectedDomain === "ALL" ? "All Domains" : `${selectedDomain} — ${domainLabels[selectedDomain]}`}
            </span>
            <span className="text-[#555] text-xs">
              | Sea Group (Shopee · Garena · Monee)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-[#888] text-xs uppercase tracking-wider mb-1">
                Score
              </div>
              <div
                className={`text-xl font-bold ${
                  accuracy === 100 && answered > 2 ? "text-green-400" : "text-white"
                }`}
              >
                {score} / {answered}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[#888] text-xs uppercase tracking-wider mb-1">
                Question
              </div>
              <div className="text-xl font-bold text-white">
                {currentQ + 1} / {questions.length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[#888] text-xs uppercase tracking-wider mb-1">
                Accuracy
              </div>
              <div
                className={`text-xl font-bold ${
                  accuracy === 100 && answered > 2
                    ? "text-green-400"
                    : "text-white"
                }`}
              >
                {accuracy !== null ? `${accuracy}%` : "—"}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[#252530] rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--accent)] to-[#ff6b6b] rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${(answered / questions.length) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Question dots */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => goToQuestion(i)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${
                i === currentQ
                  ? "bg-[var(--accent)] text-white scale-110 shadow-lg shadow-[var(--accent-glow)]"
                  : answers[i] !== null
                  ? answers[i] === questions[i].answer
                    ? "bg-green-500/20 text-green-400 border border-green-500/40"
                    : "bg-red-500/20 text-red-400 border border-red-500/40"
                  : "bg-[#1a1a2e] text-[#666] border border-[#252530] hover:border-[#444]"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait" custom={direction}>
          {!showResults && (
            <motion.div
              key={currentQ}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`glass-card p-8 transition-colors duration-500 ${
                currentAnswer !== null
                  ? isCorrect
                    ? "border-green-500/50"
                    : "border-red-500/50"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest">
                  Question {currentQ + 1} of {questions.length}
                </span>
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${domainColors[q.domain]}20`,
                    color: domainColors[q.domain],
                    border: `1px solid ${domainColors[q.domain]}40`,
                  }}
                >
                  {q.domain} — {domainLabels[q.domain]}
                </span>
              </div>
              <h3 className="text-white text-xl font-semibold mb-6 leading-relaxed">
                {q.q}
              </h3>

              <div className="space-y-3">
                {q.options.map((opt, oi) => {
                  let btnClass =
                    "w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 ";
                  let letterClass =
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ";

                  if (currentAnswer === null) {
                    btnClass +=
                      "bg-[#1a1a2e] border-[#303045] text-[#c0c0c0] hover:border-[var(--accent)] hover:text-white hover:bg-[#1e1e35] cursor-pointer";
                    letterClass += "bg-[#252540] text-[#888]";
                  } else if (oi === q.answer) {
                    btnClass +=
                      "bg-green-950/30 border-green-500/50 text-white cursor-default";
                    letterClass += "bg-green-500 text-white";
                  } else if (oi === currentAnswer && !isCorrect) {
                    btnClass +=
                      "bg-red-950/30 border-red-500/50 text-white cursor-default";
                    letterClass += "bg-red-500 text-white";
                  } else {
                    btnClass +=
                      "bg-[#1a1a2e] border-[#252530] text-[#666] cursor-default opacity-50";
                    letterClass += "bg-[#252540] text-[#555]";
                  }

                  return (
                    <motion.button
                      key={oi}
                      onClick={() => selectAnswer(oi)}
                      disabled={currentAnswer !== null}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + oi * 0.05 }}
                      whileHover={
                        currentAnswer === null ? { scale: 1.01 } : {}
                      }
                      whileTap={currentAnswer === null ? { scale: 0.99 } : {}}
                      className={btnClass}
                    >
                      <span className={letterClass}>{letters[oi]}</span>
                      <span>{opt}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {currentAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`p-4 rounded-xl text-sm leading-relaxed border-l-3 ${
                        isCorrect
                          ? "bg-green-950/20 border-l-green-500 text-green-200/80"
                          : "bg-red-950/20 border-l-red-500 text-red-200/80"
                      }`}
                    >
                      <span className="font-bold">
                        {isCorrect ? "✅ Correct! " : "❌ Wrong. "}
                      </span>
                      {q.explanation}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Nav buttons */}
              {currentAnswer !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-between mt-6"
                >
                  <button
                    onClick={() => goToQuestion(Math.max(0, currentQ - 1))}
                    disabled={currentQ === 0}
                    className="px-4 py-2 text-sm text-[#888] hover:text-white transition-colors disabled:opacity-30"
                  >
                    ← Previous
                  </button>
                  {currentQ < questions.length - 1 ? (
                    <button
                      onClick={() => goToQuestion(currentQ + 1)}
                      className="px-5 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-lg hover:bg-[#d63050] transition-all hover:shadow-lg hover:shadow-[var(--accent-glow)]"
                    >
                      Next →
                    </button>
                  ) : answered === questions.length ? (
                    <button
                      onClick={() => setShowResults(true)}
                      className="px-5 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-lg hover:bg-[#d63050] transition-all hover:shadow-lg hover:shadow-[var(--accent-glow)]"
                    >
                      See Results
                    </button>
                  ) : null}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="glass-card p-10 text-center border-2 border-[var(--accent)]/50"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white mb-3"
              >
                Quiz Complete!
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className={`text-6xl font-extrabold my-6 ${
                  score === questions.length
                    ? "text-green-400"
                    : "gradient-text"
                }`}
              >
                {score} / {questions.length} (
                {Math.round((score / questions.length) * 100)}%)
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-[var(--text-muted)] text-lg mb-8"
              >
                {(() => {
                  const pct = Math.round((score / questions.length) * 100);
                  if (pct === 100) return "Perfect score! You're ready to lead SOX compliance at Sea Group. 🏆";
                  if (pct >= 80) return "Impressive! You've got a strong grasp of SOX controls across Sea's subsidiaries. 💪";
                  if (pct >= 60) return "Not bad — you understand the basics. Review the areas where Shopee, Garena, and Monee's controls differ.";
                  if (pct >= 40) return "Room for improvement. Focus on how SOX control domains apply differently to e-commerce, gaming, and fintech.";
                  return "Time to review the SOX guide — Sea Group's auditors would have concerns. 😬";
                })()}
              </motion.p>

              <div className="flex gap-3 justify-center flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startQuiz(selectedDomain)}
                  className="px-6 py-3 bg-[var(--accent)] text-white font-semibold rounded-xl hover:bg-[#d63050] transition-all shadow-lg shadow-[var(--accent-glow)]"
                >
                  Retry {selectedDomain === "ALL" ? "All" : selectedDomain}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={restart}
                  className="px-6 py-3 border border-[var(--accent)] text-[var(--accent)] font-semibold rounded-xl hover:bg-[var(--accent)]/10 transition-all"
                >
                  Change Domain
                </motion.button>
                <Link href="/">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block px-6 py-3 border border-[#333] text-white font-semibold rounded-xl hover:bg-[#151520] transition-all"
                  >
                    Back to Guide
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </>}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-12 border-t border-[#222] text-[#555] text-sm">
        <p>
          Built by Artemis 🏹 — March 2026 |{" "}
          <Link href="/" className="text-[var(--accent)] hover:underline">
            Back to SOX Guide
          </Link>
        </p>
      </footer>
    </>
  );
}
