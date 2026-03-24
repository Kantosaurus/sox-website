"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import confetti from "canvas-confetti";
import AnimatedBackground from "@/components/AnimatedBackground";

interface Question {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    q: "What year was the Sarbanes-Oxley Act signed into law?",
    options: ["1999", "2001", "2002", "2004"],
    answer: 2,
    explanation:
      "SOX was signed into law on July 30, 2002 by President George W. Bush, in response to the Enron and WorldCom scandals.",
  },
  {
    q: "Which two corporate scandals were the primary catalysts for SOX?",
    options: [
      "Lehman Brothers & Bear Stearns",
      "Enron & WorldCom",
      "Tyco & Adelphia",
      "AIG & Countrywide",
    ],
    answer: 1,
    explanation:
      "Enron's collapse in October 2001 and WorldCom's fraud revealed in June 2002 were the primary drivers. Tyco and Adelphia also contributed but Enron and WorldCom were the main catalysts.",
  },
  {
    q: "Which SOX section requires CEOs and CFOs to personally certify financial statements?",
    options: ["Section 201", "Section 302", "Section 404", "Section 802"],
    answer: 1,
    explanation:
      "Section 302 requires senior officers to personally certify the accuracy and completeness of corporate financial reports.",
  },
  {
    q: "What does Section 404 of SOX require?",
    options: [
      "Whistleblower protections",
      "Real-time financial disclosure",
      "Internal controls assessment and external audit attestation",
      "Criminal penalties for document destruction",
    ],
    answer: 2,
    explanation:
      "Section 404 requires management to assess and report on internal controls over financial reporting (ICFR), and external auditors must attest to that assessment. It's the most expensive SOX requirement.",
  },
  {
    q: "What oversight body was created by SOX?",
    options: ["SEC", "FASB", "PCAOB", "FINRA"],
    answer: 2,
    explanation:
      "The Public Company Accounting Oversight Board (PCAOB) was created by SOX to oversee the audits of public companies and register/inspect audit firms. The SEC existed since 1934.",
  },
  {
    q: "What is the maximum prison sentence for willfully certifying false financial reports under Section 906?",
    options: ["5 years", "10 years", "15 years", "20 years"],
    answer: 3,
    explanation:
      "Section 906 imposes criminal penalties of up to $5 million in fines and 20 years imprisonment for willfully certifying false financial statements.",
  },
  {
    q: "Which audit firm collapsed due to the Enron scandal?",
    options: [
      "Deloitte",
      "PricewaterhouseCoopers",
      "Arthur Andersen",
      "KPMG",
    ],
    answer: 2,
    explanation:
      "Arthur Andersen, one of the 'Big Five' accounting firms, was convicted of obstruction of justice for shredding Enron documents. The firm surrendered its CPA license and collapsed, turning the Big Five into the Big Four.",
  },
  {
    q: "Section 802 of SOX deals with:",
    options: [
      "Executive compensation",
      "Destroying or altering financial records",
      "Audit committee independence",
      "Quarterly reporting requirements",
    ],
    answer: 1,
    explanation:
      "Section 802 imposes criminal penalties (up to 20 years) for knowingly altering, destroying, mutilating, or concealing records or documents with intent to impede a federal investigation.",
  },
  {
    q: "What protection does Section 806 provide?",
    options: [
      "Protection for audit firms",
      "Whistleblower protection for employees",
      "Protection against hostile takeovers",
      "Executive immunity during investigations",
    ],
    answer: 1,
    explanation:
      "Section 806 protects employees of publicly traded companies who report fraud from retaliation such as discharge, demotion, suspension, threats, or harassment.",
  },
  {
    q: "Approximately how much does SOX Section 404 compliance cost large companies annually?",
    options: [
      "$50,000 – $100,000",
      "$250,000 – $500,000",
      "$1.3 – $2 million",
      "$10 – $20 million",
    ],
    answer: 2,
    explanation:
      "SOX 404 compliance costs average $1.3–$2 million annually for large companies. For smaller public companies, it can consume 1–2% of revenue.",
  },
  {
    q: "SOX prohibits audit firms from providing which of the following to their audit clients?",
    options: [
      "Tax advisory services",
      "Bookkeeping and financial systems design",
      "Legal counsel",
      "All consulting services",
    ],
    answer: 1,
    explanation:
      "Section 201 prohibits auditors from providing certain non-audit services to audit clients, including bookkeeping, financial information systems design, and management functions, to prevent conflicts of interest.",
  },
  {
    q: "Who were the two legislators SOX is named after?",
    options: [
      "Sarbanes & Oxley",
      "Dodd & Frank",
      "Glass & Steagall",
      "Gramm & Leach",
    ],
    answer: 0,
    explanation:
      "Senator Paul Sarbanes (D-MD) and Representative Michael Oxley (R-OH) sponsored the bill. Dodd-Frank is the 2010 post-financial-crisis law; Glass-Steagall was the 1933 banking separation act.",
  },
  {
    q: "What does Section 409 require companies to do?",
    options: [
      "Rotate auditors every 5 years",
      "Disclose material changes on a rapid and current basis",
      "Submit annual internal control reports",
      "File criminal complaints for fraud",
    ],
    answer: 1,
    explanation:
      'Section 409 requires real-time disclosure — companies must inform the public "on a rapid and current basis" about material changes to their financial condition or operations.',
  },
  {
    q: "Which of these is NOT a title within the Sarbanes-Oxley Act?",
    options: [
      "Corporate Responsibility",
      "Auditor Independence",
      "Consumer Protection",
      "Enhanced Financial Disclosures",
    ],
    answer: 2,
    explanation:
      "Consumer Protection is part of Dodd-Frank (2010), not SOX. SOX titles include Public Company Accounting Oversight Board, Auditor Independence, Corporate Responsibility, and Enhanced Financial Disclosures.",
  },
  {
    q: "SOX primarily applies to which types of companies?",
    options: [
      "All US businesses",
      "Only Fortune 500 companies",
      "All publicly traded companies in the US",
      "Only financial institutions",
    ],
    answer: 2,
    explanation:
      "SOX applies to all publicly traded companies in the United States, as well as their wholly-owned subsidiaries and foreign companies that are publicly traded and do business in the US.",
  },
];

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
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [direction, setDirection] = useState(1);
  const confettiFired = useRef(false);

  const score = answers.reduce<number>(
    (acc, a, i) => acc + (a === questions[i].answer ? 1 : 0),
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
          🧠 SOX Pop Quiz
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[var(--text-muted)] text-lg"
        >
          15 questions. No time limit. How well do you know Sarbanes-Oxley?
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
        {/* Score bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 mb-6 flex justify-between items-center"
        >
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
              <div className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-3">
                Question {currentQ + 1} of {questions.length}
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
                {score === questions.length
                  ? "Perfect score! You're a SOX compliance officer in the making. 🏆"
                  : score >= 12
                  ? "Impressive! You know your SOX really well. 💪"
                  : score >= 9
                  ? "Not bad — you've got the basics down. A few more reads and you'll ace it."
                  : score >= 6
                  ? "Room for improvement. Check out the SOX guide and try again!"
                  : "Might want to re-read the SOX guide... Enron's accountants probably scored higher. 😬"}
              </motion.p>

              <div className="flex gap-4 justify-center flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={restart}
                  className="px-8 py-3 bg-[var(--accent)] text-white font-semibold rounded-xl hover:bg-[#d63050] transition-all shadow-lg shadow-[var(--accent-glow)]"
                >
                  Try Again
                </motion.button>
                <Link href="/">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block px-8 py-3 border border-[#333] text-white font-semibold rounded-xl hover:bg-[#151520] transition-all"
                  >
                    Back to Guide
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
