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
  MC: "Manage Change",
  OS: "Operating System",
  DB: "Database",
  MA: "Manage Access",
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
  // ===== MC — Manage Change =====
  {
    q: "Shopee's engineering team needs to deploy a hotfix to the payment processing module in production. Under SOX 404 Manage Change controls, what is required before the change goes live?",
    options: ["The developer who wrote the fix can deploy immediately", "Formal change request with documented approval, impact assessment, testing evidence, and segregation between developer and deployer", "Only a verbal approval from the team lead", "Deploy to production first, then document the change retroactively"],
    answer: 1,
    explanation: "SOX 404 requires that all changes to financially significant systems follow a formal change management process. This includes documented change requests, risk/impact assessment, independent testing, approval from authorized personnel, and segregation of duties — the person who develops the change must not be the one who promotes it to production.",
    domain: "MC",
  },
  {
    q: "Garena needs to update the revenue recognition logic in Free Fire's in-app purchase system. What Manage Change control specifically addresses the risk of unauthorized code changes affecting financial data?",
    options: ["Code reviews are optional for experienced developers", "Version-controlled source code with mandatory peer review, branch protection rules, and automated build pipelines that enforce approval gates before production deployment", "Only the project manager needs to approve", "Changes to financial systems don't require special change controls"],
    answer: 1,
    explanation: "Under SOX 404, changes to systems that process financial data require enhanced controls. Version control provides an audit trail, mandatory code reviews ensure independent verification, branch protection prevents unapproved merges, and CI/CD approval gates enforce that no change reaches production without proper authorization.",
    domain: "MC",
  },
  {
    q: "MariBank (under Monee) receives a critical security patch for its core banking platform. The patch must be applied urgently. How should this emergency change be handled under SOX 404?",
    options: ["Emergency changes bypass all controls", "Apply the patch immediately using an emergency change process with post-implementation review, retroactive documentation, and ratification by the Change Advisory Board within a defined timeframe", "Wait for the next scheduled change window regardless of urgency", "Only the DBA can decide to apply emergency patches"],
    answer: 1,
    explanation: "SOX 404 recognizes that emergency changes are sometimes necessary. However, they must still follow a defined emergency change process: the change is applied under controlled conditions, fully documented after the fact, reviewed for unintended impacts, and formally ratified by the CAB. Complete bypass of controls is never acceptable.",
    domain: "MC",
  },
  {
    q: "Sea Limited uses a shared ERP system for consolidated financial reporting across Shopee, Garena, and Monee. A scheduled ERP upgrade requires schema changes. What SOX 404 Manage Change control is most critical?",
    options: ["Only testing in the development environment is sufficient", "Full regression testing in a production-mirror environment, with documented test results, data migration validation, rollback plan, and sign-off from finance stakeholders before go-live", "The ERP vendor handles all testing", "Schema changes don't affect financial controls"],
    answer: 1,
    explanation: "ERP changes directly impact financial reporting integrity. SOX 404 requires comprehensive testing in a production-equivalent environment, validated data migration (especially for financial data), a documented rollback plan in case of failure, and formal sign-off from business owners who rely on the system for financial reporting.",
    domain: "MC",
  },
  {
    q: "Shopee's platform team implements automated CI/CD pipelines. Under SOX 404, what change management risk does automation introduce that must be controlled?",
    options: ["Automation eliminates all change management risks", "Risk that developers can configure pipelines to bypass approval gates, requiring controls such as pipeline configuration reviews, immutable deployment logs, and segregation between pipeline administrators and developers", "Automated deployments don't need change tickets", "Only manual deployments need SOX controls"],
    answer: 1,
    explanation: "While CI/CD automation improves consistency, it introduces the risk that approval gates can be misconfigured or bypassed. SOX 404 requires controls over the pipeline itself: who can modify pipeline configurations, immutable deployment audit trails, and ensuring the person who writes code cannot also control the deployment pipeline.",
    domain: "MC",
  },

  // ===== MA — Manage Access =====
  {
    q: "A Shopee finance analyst changes roles to the marketing department. Under SOX 404 Manage Access controls, what must happen to their system access?",
    options: ["They keep all existing access plus get new access for marketing", "A formal access review is triggered: revoke finance system access no longer needed for the new role, and provision only the access required for marketing duties", "Access changes are handled during the annual review", "The manager can decide informally what to keep"],
    answer: 1,
    explanation: "SOX 404 requires timely access modifications when employees change roles (role-based access control). The principle of least privilege means the analyst should lose finance system access they no longer need and only receive marketing-relevant access. Waiting for an annual review creates a window where excessive access exists — a control gap.",
    domain: "MA",
  },
  {
    q: "Garena's production database containing Free Fire transaction records requires privileged (DBA) access for maintenance. What SOX 404 access control is required for privileged accounts?",
    options: ["DBAs should have permanent unrestricted access for efficiency", "Privileged access must use dedicated admin accounts (separate from daily-use accounts), with multi-factor authentication, session logging, and periodic access recertification", "Shared DBA credentials are acceptable if only the DBA team knows them", "Privileged access controls only apply to financial applications, not databases"],
    answer: 1,
    explanation: "SOX 404 requires strict controls over privileged access to systems containing financial data. Named (non-shared) admin accounts ensure accountability, MFA prevents unauthorized use, session logging provides audit trails, and periodic recertification confirms the access is still justified. Shared credentials violate accountability requirements.",
    domain: "MA",
  },
  {
    q: "MariBank must comply with both MAS regulations and SOX 404 for access management. An employee is terminated. What is the SOX 404 requirement for access revocation?",
    options: ["Access can be removed within 30 days", "Immediate revocation of all system access upon termination, with documented evidence of the revocation timestamp and confirmation that no access remains", "Only revoke access to financial systems, other systems can wait", "HR handles access revocation as part of the offboarding checklist"],
    answer: 1,
    explanation: "SOX 404 requires prompt (typically same-day) access revocation for terminated employees, especially for systems that process or store financial data. Documented evidence must show when access was disabled and that no residual access remains. Delays create risk of unauthorized access to financial systems.",
    domain: "MA",
  },
  {
    q: "Sea Limited conducts a periodic user access review (UAR) across Shopee, Garena, and Monee. What SOX 404 requirement governs this process?",
    options: ["Access reviews are only needed when auditors request them", "Management must periodically recertify that all user access to financially significant systems is appropriate, with evidence of review, remediation of exceptions, and sign-off by system/data owners", "IT can self-certify that access is correct", "Only privileged accounts need periodic review"],
    answer: 1,
    explanation: "SOX 404 requires regular user access recertification for all access to in-scope systems — not just privileged accounts. Business owners (not IT) must review and confirm that each user's access is appropriate for their current role. Exceptions must be remediated, and the entire process must be documented as audit evidence.",
    domain: "MA",
  },
  {
    q: "Shopee uses service accounts (non-human accounts) for automated batch jobs that process financial transactions. What SOX 404 access control applies to service accounts?",
    options: ["Service accounts don't need access controls since no human uses them", "Service accounts must have documented owners, use strong authentication (API keys/certificates rotated periodically), follow least privilege, and be included in periodic access reviews", "Service accounts can use the same credentials as the developer who created them", "Only service accounts with write access need controls"],
    answer: 1,
    explanation: "SOX 404 treats service accounts as a significant access risk because they often have broad system access and run unattended. Each must have a documented business owner, use strong credentials that are regularly rotated, follow least privilege principles, and be included in periodic access reviews just like human accounts.",
    domain: "MA",
  },

  // ===== DB — Database =====
  {
    q: "Shopee's order database stores millions of transactions daily across 13+ markets. What SOX 404 database control ensures the completeness and accuracy of financial data?",
    options: ["Daily full database backups are sufficient", "Automated reconciliation controls that compare record counts and financial totals between source transaction databases and downstream reporting/GL systems, with exception alerting for discrepancies", "Developers manually verify data accuracy monthly", "The application layer guarantees database integrity so no DB-level controls are needed"],
    answer: 1,
    explanation: "SOX 404 requires controls that verify the completeness and accuracy of financial data as it flows from source systems to financial reports. Automated reconciliation between transaction databases and reporting systems catches missing or altered records. Application-layer controls alone are insufficient — database-level verification is required.",
    domain: "DB",
  },
  {
    q: "Garena's Free Fire virtual currency (Diamonds) database must maintain an audit trail for SOX 404 compliance. What database audit control is required?",
    options: ["Application-level logging is sufficient", "Database-level audit logging that captures all DML operations (INSERT, UPDATE, DELETE) on financial tables, including the user/account that made the change, timestamp, and before/after values", "Only DDL changes (table structure) need auditing", "Audit logs can be stored in the same database they're auditing"],
    answer: 1,
    explanation: "SOX 404 requires database-level audit trails for financial data that are independent of the application layer. All data modifications must be logged with who, when, and what changed (before/after values). Storing audit logs separately from the audited database prevents tampering and ensures log integrity.",
    domain: "DB",
  },
  {
    q: "A DBA at Monee needs to run a direct SQL update on the MariBank loan interest calculation table to correct an error. Under SOX 404 database controls, what process must be followed?",
    options: ["The DBA runs the update and informs the team afterward", "A formal data correction request must be submitted, approved by a business owner, the SQL must be reviewed by a second DBA, executed with full audit logging, and validated with before/after evidence", "Direct database updates are always prohibited", "Only the application team can approve database changes"],
    answer: 1,
    explanation: "SOX 404 permits direct database modifications but requires strict controls: a documented business justification, approval by the data/business owner, independent review of the SQL statement, execution under audit logging, and validation comparing before and after states. This ensures data integrity while allowing necessary corrections.",
    domain: "DB",
  },
  {
    q: "Sea Limited's financial consolidation requires extracting data from Shopee, Garena, and Monee databases into the group reporting system. What SOX 404 database control governs ETL (Extract, Transform, Load) processes?",
    options: ["ETL jobs just need to run on schedule", "ETL processes must have validation controls including row count reconciliation, hash/checksum verification, error handling with alerting, and documented transformation logic that is change-controlled", "The data warehouse team is responsible for accuracy, not the source systems", "ETL processes are infrastructure — they don't fall under SOX"],
    answer: 1,
    explanation: "ETL processes are critical data integrity controls under SOX 404. Financial data moving between systems must be validated at each stage: row counts confirm completeness, checksums detect corruption, error handling prevents silent failures, and transformation logic must be documented and version-controlled as it directly affects financial reporting.",
    domain: "DB",
  },
  {
    q: "Shopee's database infrastructure must enforce SOX 404 data retention. What is the minimum retention period for audit workpapers and financial records under SOX Section 802?",
    options: ["3 years", "5 years", "7 years", "10 years"],
    answer: 2,
    explanation: "SOX Section 802 mandates that audit and review workpapers be retained for at least 7 years. Destruction of these records can result in criminal penalties of up to 20 years imprisonment. Shopee's database retention policies must enforce this minimum across all financial data stores.",
    domain: "DB",
  },

  // ===== OS — Operating System =====
  {
    q: "Shopee's payment processing servers run on Linux. Under SOX 404 Operating System controls, what hardening measure is required for these financially significant systems?",
    options: ["Default OS installation is sufficient", "OS hardening based on industry benchmarks (e.g., CIS), including disabling unnecessary services, removing default accounts, enforcing strong password policies, and applying security patches within defined SLAs", "Only internet-facing servers need hardening", "The cloud provider handles OS security entirely"],
    answer: 1,
    explanation: "SOX 404 requires that operating systems hosting financially significant applications are hardened according to industry standards. This includes removing attack surface (unused services/accounts), enforcing authentication policies, and timely patch management. The organization retains responsibility even in cloud environments (shared responsibility model).",
    domain: "OS",
  },
  {
    q: "Garena's game servers and financial processing systems share the same OS environment. What SOX 404 OS-level control addresses this risk?",
    options: ["Sharing environments saves costs and is acceptable", "Segregation of environments — financially significant systems must be isolated from non-financial workloads through separate servers, VLANs, or containerization with enforced network policies", "A firewall between the systems is sufficient", "Only the database needs to be separated, not the OS"],
    answer: 1,
    explanation: "SOX 404 requires that financially significant systems are adequately segregated from non-financial workloads to prevent unauthorized access and reduce the blast radius of security incidents. Co-mingling game servers with financial systems creates unacceptable risk — a compromise of game servers could expose financial data.",
    domain: "OS",
  },
  {
    q: "MariBank's core banking application runs on servers managed by Monee's infrastructure team. What SOX 404 OS control governs system administrator access to these servers?",
    options: ["Sysadmins need root access at all times for troubleshooting", "Privileged OS access must use named accounts (not shared root), require MFA, be time-limited through just-in-time (JIT) provisioning where possible, and all sessions must be logged and periodically reviewed", "Shared root passwords are acceptable if rotated quarterly", "OS-level access doesn't impact financial controls"],
    answer: 1,
    explanation: "SOX 404 requires strict controls over privileged OS access on financial systems. Named accounts ensure accountability, MFA prevents credential theft, JIT access reduces standing privilege risk, and session logging provides audit evidence. Shared root access violates accountability principles regardless of rotation frequency.",
    domain: "OS",
  },
  {
    q: "Sea Limited's security team discovers a critical OS vulnerability (CVE) affecting servers across Shopee, Garena, and Monee. What SOX 404 OS control governs the response?",
    options: ["Patch during the next quarterly maintenance window", "A defined patch management process with risk-based SLAs — critical vulnerabilities on financial systems must be patched within defined timeframes (e.g., 72 hours), with documented risk acceptance if delayed", "Only patch if an exploit is actively being used", "The cloud provider patches automatically, no action needed"],
    answer: 1,
    explanation: "SOX 404 requires a documented patch management program with risk-based timelines. Critical vulnerabilities on financially significant systems must be addressed urgently — typically within 72 hours or less. If patching cannot meet the SLA, a formal risk acceptance with compensating controls must be documented and approved by management.",
    domain: "OS",
  },
  {
    q: "Shopee runs batch jobs on Linux servers that generate financial reports overnight. What SOX 404 OS control ensures the integrity of these scheduled jobs?",
    options: ["Cron jobs set up by any sysadmin are fine", "Job scheduling must be change-controlled, with restricted access to modify cron/scheduler configurations, execution logs retained for audit, and automated alerting if critical financial jobs fail or are modified", "Only the output of batch jobs matters, not how they run", "Batch job controls are operational, not SOX-relevant"],
    answer: 1,
    explanation: "SOX 404 considers batch job integrity critical for financial reporting. If scheduled jobs that generate financial data are modified or fail without detection, it can lead to inaccurate financial statements. Controls must cover who can modify job schedules, logging of all executions, and alerting on failures or unauthorized changes.",
    domain: "OS",
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
                        {d === "MC" && "Change requests, approvals, testing, emergency changes, CI/CD controls"}
                        {d === "OS" && "OS hardening, patching, privileged access, environment segregation, batch jobs"}
                        {d === "DB" && "Data integrity, audit trails, direct SQL controls, ETL validation, retention"}
                        {d === "MA" && "User provisioning, access reviews, privileged accounts, service accounts, termination"}
                      </p>
                    )}
                    {d === "ALL" && (
                      <p className="text-[#555] text-xs mt-1">
                        All SOX 404 IT General Control domains — MC, MA, DB, OS
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
