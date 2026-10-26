'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import {
  Binary,
  Database,
  Network,
  Award,
  FileText,
  Clock,
  HelpCircle,
  Play,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Timer,
  Trophy,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

const TESTS = [
  {
    id: 1,
    title: 'Digital Logic & Architecture - Mock 1',
    category: 'Bihar STET & BPSC CSE',
    questions: 15,
    duration: 15,
    type: 'topic',
    icon: Binary,
    questionList: [
      { id: 1, question: 'What is the output of an AND gate when both inputs are 1?', options: ['0', '1', 'High-Z', 'Indeterminate'], answer: '1' },
      { id: 2, question: 'Which Boolean algebra expression represents the AND operation?', options: ['A + B', 'A · B', 'A ⊕ B', 'A\' · B\''], answer: 'A · B' },
      { id: 3, question: 'How many input combinations does a 3-input truth table cover?', options: ['4', '6', '8', '16'], answer: '8' },
      { id: 4, question: 'According to De Morgan\'s Law, (A · B)\' is equivalent to:', options: ['A\' + B\'', 'A\' · B\'', 'A + B', '(A + B)\''], answer: 'A\' + B\'' },
      { id: 5, question: 'According to the absorption law, A + A · B simplifies to:', options: ['A', 'B', '0', '1'], answer: 'A' },
      { id: 6, question: 'How many half adders and OR gates are required to construct a full adder?', options: ['1 half adder, 1 OR gate', '2 half adders, 1 OR gate', '2 half adders, 2 OR gates', '3 half adders'], answer: '2 half adders, 1 OR gate' },
      { id: 7, question: 'In a 2-variable Gray code sequence, what is the second code value after 00?', options: ['01', '10', '11', '00'], answer: '01' },
      { id: 8, question: 'Decimal number 15 is represented in 4-bit binary by which pattern?', options: ['1111', '1010', '1100', '0111'], answer: '1111' },
      { id: 9, question: 'An XOR gate output is HIGH (1) when its two inputs are:', options: ['Both High', 'Both Low', 'Different from each other', 'Equal'], answer: 'Different from each other' },
      { id: 10, question: 'A NOT gate in digital electronics is functionally referred to as:', options: ['An Inverter', 'A Buffer', 'A Multiplexer', 'A Flip-Flop'], answer: 'An Inverter' },
      { id: 11, question: 'Two NOT gates connected in series perform the function of a:', options: ['Buffer', 'AND gate', 'NAND gate', 'Oscillator'], answer: 'Buffer' },
      { id: 12, question: 'A digital half adder circuit adds:', options: ['Two 1-bit binary numbers', 'Three 1-bit numbers', 'Two 4-bit words', 'Two floating point numbers'], answer: 'Two 1-bit binary numbers' },
      { id: 13, question: 'According to Boolean duality, the dual of (A + B · C) is:', options: ['A · (B + C)', 'A\' + (B\' · C\')', 'A · B + C', '(A + B) · C'], answer: 'A · (B + C)' },
      { id: 14, question: 'A 2-variable Karnaugh Map (K-Map) contains how many total cells?', options: ['2', '4', '8', '16'], answer: '4' },
      { id: 15, question: 'A 4-to-1 Multiplexer requires how many select lines?', options: ['1', '2', '3', '4'], answer: '2' },
    ],
  },
  {
    id: 2,
    title: 'Database Management Systems - Paper 1',
    category: 'Bihar STET & Engineering',
    questions: 50,
    duration: 60,
    type: 'topic',
    icon: Database,
  },
  {
    id: 3,
    title: 'Computer Networks & Protocols - Paper 1',
    category: 'Bihar STET & Engineering',
    questions: 50,
    duration: 60,
    type: 'topic',
    icon: Network,
  },
  {
    id: 4,
    title: 'Full Syllabus Simulated Exam 1',
    category: 'Bihar STET Paper-II CSE',
    questions: 150,
    duration: 180,
    type: 'full',
    icon: Award,
  },
  {
    id: 5,
    title: 'Official Previous Year Paper 2023',
    category: 'Solved Past Examination',
    questions: 150,
    duration: 180,
    type: 'pyq',
    icon: FileText,
  },
];

const TYPE_LABELS = {
  topic: 'Topic Test',
  full: 'Full Mock',
  pyq: 'Solved PYQ',
};

function formatClock(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function buildResult(exam) {
  const questions = exam.test.questionList || [];
  const correctCount = questions.reduce(
    (total, question) => total + (exam.answers[question.id] === question.answer ? 1 : 0),
    0
  );

  return {
    ...exam,
    submitted: true,
    correctCount,
    total: questions.length,
    percent: questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0,
  };
}

export default function TestsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [previewTest, setPreviewTest] = useState(null);
  const [exam, setExam] = useState(null);

  const tabs = [
    { id: 'all', label: 'All Tests' },
    { id: 'topic', label: 'Topic-wise Tests' },
    { id: 'full', label: 'Full Syllabus Mocks' },
    { id: 'pyq', label: 'Previous Year Papers' },
  ];

  const filteredTests = TESTS.filter((test) => {
    if (activeTab === 'all') return true;
    return test.type === activeTab;
  });

  useEffect(() => {
    if (!exam || exam.submitted) return undefined;

    const interval = setInterval(() => {
      setExam((current) => {
        if (!current || current.submitted) return current;
        if (current.secondsLeft <= 1) return buildResult(current);
        return { ...current, secondsLeft: current.secondsLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [exam?.submitted, exam?.test?.id]);

  const beginExam = (test) => {
    const questionList = test.questionList || [];
    if (questionList.length === 0) return;

    setPreviewTest(null);
    setExam({
      test,
      answers: {},
      current: 0,
      secondsLeft: test.duration * 60,
      submitted: false,
      correctCount: 0,
      total: questionList.length,
      percent: 0,
    });
  };

  const selectAnswer = (questionId, option) => {
    setExam((current) => {
      if (!current || current.submitted) return current;
      return {
        ...current,
        answers: { ...current.answers, [questionId]: option },
      };
    });
  };

  const closeExam = () => setExam(null);

  /* ------------------------------ ACTIVE EXAM UI ------------------------------ */
  if (exam && !exam.submitted) {
    const questions = exam.test.questionList;
    const question = questions[exam.current];
    const answeredCount = Object.keys(exam.answers).length;

    return (
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
        {/* Examination Sticky Topbar */}
        <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {exam.test.category}
              </span>
              <h1 className="truncate font-display text-base font-extrabold text-slate-900 dark:text-white">
                {exam.test.title}
              </h1>
              <span className="text-xs text-slate-500">
                {answeredCount} of {questions.length} answered
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Countdown Timer */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold font-mono ${
                  exam.secondsLeft <= 60
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Timer className="h-4 w-4" />
                <span>{formatClock(exam.secondsLeft)}</span>
              </div>

              <button
                type="button"
                onClick={() => setExam((current) => (current ? buildResult(current) : current))}
                className="btn btn-primary btn-sm font-bold cursor-pointer"
              >
                <span>Submit Exam</span>
              </button>
            </div>
          </div>
        </header>

        {/* Exam Split Screen */}
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Question Palette Sidebar */}
          <aside className="order-2 lg:order-1 lg:col-span-4 space-y-4">
            <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Question Palette
                </h2>
                <span className="badge badge-royal font-mono">
                  {answeredCount}/{questions.length}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 py-4">
                {questions.map((q, idx) => {
                  const isAnswered = Boolean(exam.answers[q.id]);
                  const isCurrent = exam.current === idx;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      aria-label={`Question ${idx + 1}`}
                      onClick={() => setExam((c) => ({ ...c, current: idx }))}
                      className={`h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                          : isAnswered
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5 text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-blue-600" />
                  <span>Current Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-emerald-500" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-slate-200 dark:bg-slate-700" />
                  <span>Unanswered</span>
                </div>
              </div>

              <button
                type="button"
                onClick={closeExam}
                className="btn btn-secondary btn-sm w-full mt-4 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                Exit Exam Without Submitting
              </button>
            </div>
          </aside>

          {/* Active Question Box */}
          <section className="order-1 lg:order-2 lg:col-span-8">
            <div className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[440px] shadow-sm">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="badge badge-royal font-bold">
                    Question {exam.current + 1} of {questions.length}
                  </span>
                  <span className="text-xs text-slate-400">
                    +1.0 Mark · No Negative Penalty
                  </span>
                </div>

                <h2 className="mt-6 font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                  {question.question}
                </h2>

                <div className="mt-6 space-y-3" role="radiogroup">
                  {question.options.map((option, optIdx) => {
                    const isSelected = exam.answers[question.id] === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => selectAnswer(question.id, option)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'border border-slate-300 dark:border-slate-600 text-slate-500'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={exam.current === 0}
                  onClick={() => setExam((c) => ({ ...c, current: Math.max(0, c.current - 1) }))}
                  className="btn btn-secondary btn-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                {exam.current < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setExam((c) => ({ ...c, current: c.current + 1 }))}
                    className="btn btn-primary btn-sm"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setExam((c) => buildResult(c))}
                    className="btn btn-primary btn-sm bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Complete &amp; View Score</span>
                  </button>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  /* ------------------------------ RESULT SCORECARD UI ------------------------------ */
  if (exam && exam.submitted) {
    const questions = exam.test.questionList;
    const unanswered = questions.length - Object.keys(exam.answers).length;
    const incorrect = questions.length - exam.correctCount - unanswered;

    return (
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
        <Header />

        <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-6">
          <div className="card p-6 sm:p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Trophy className="h-7 w-7" />
            </span>

            <span className="eyebrow mt-3 text-center justify-center">
              Examination Results
            </span>

            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {exam.test.title}
            </h1>

            {/* Metrics Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Final Score
                </span>
                <span className="font-display text-2xl font-black text-slate-900 dark:text-white mt-0.5 block">
                  {exam.correctCount}/{exam.total}
                </span>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Correct
                </span>
                <span className="font-display text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {exam.correctCount}
                </span>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                  Incorrect
                </span>
                <span className="font-display text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5 block">
                  {incorrect}
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Unanswered
                </span>
                <span className="font-display text-2xl font-black text-slate-600 dark:text-slate-300 mt-0.5 block">
                  {unanswered}
                </span>
              </div>
            </div>

            {/* Accuracy Bar */}
            <div className="mt-6 max-w-xs mx-auto space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Overall Accuracy</span>
                <span className="font-bold text-slate-900 dark:text-white">{exam.percent}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${exam.percent}%` }}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => beginExam(exam.test)}
                className="btn btn-primary"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retake Test</span>
              </button>
              <button
                type="button"
                onClick={closeExam}
                className="btn btn-secondary"
              >
                <span>Back to Test Directory</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Detailed Question-by-Question Solution Review
            </h2>

            <div className="space-y-3">
              {questions.map((q, idx) => {
                const given = exam.answers[q.id];
                const isCorrect = given === q.answer;

                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border p-4 ${
                      isCorrect
                        ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : given
                          ? 'border-rose-200 dark:border-rose-800/60 bg-rose-50/40 dark:bg-rose-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                          isCorrect ? 'bg-emerald-600' : given ? 'bg-rose-600' : 'bg-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {q.question}
                      </p>
                    </div>

                    <div className="mt-2.5 pl-7 text-xs font-semibold space-y-1">
                      <p className={isCorrect ? 'text-emerald-700 dark:text-emerald-400' : given ? 'text-rose-700 dark:text-rose-400' : 'text-slate-500'}>
                        Your response: {given || 'Not answered'}
                      </p>
                      {!isCorrect && (
                        <p className="text-emerald-700 dark:text-emerald-400 font-bold">
                          Verified answer: {q.answer}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /* ------------------------------ TEST DIRECTORY CATALOG UI ------------------------------ */
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow="Examination Center"
          title="Online Mock Tests &amp; PYQ Papers"
          description="Simulate real examination conditions with timed papers, topic quizzes, instant evaluation, and verified answer keys for Computer Science examinations."
          breadcrumbs={[{ label: 'Mock Tests' }]}
          aside={
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pb-3 border-b border-slate-100 dark:border-slate-800">
                Examination Features
              </span>
              <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs py-1">
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-slate-600 dark:text-slate-400">Available test papers</dt>
                  <dd className="font-display text-base font-extrabold text-slate-900 dark:text-white">
                    {TESTS.length}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-slate-600 dark:text-slate-400">Scorecard delivery</dt>
                  <dd className="font-bold text-emerald-600 dark:text-emerald-400">
                    Instant &amp; Detailed
                  </dd>
                </div>
              </dl>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Standardized STET &amp; BPSC marking</span>
              </div>
            </div>
          }
        />

        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 pb-3">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Test Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTests.map((test) => {
                const Icon = test.icon;
                const hasQuestions = Boolean(test.questionList?.length);

                return (
                  <div
                    key={test.id}
                    className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        <span className="badge badge-royal">
                          {TYPE_LABELS[test.type]}
                        </span>
                      </div>

                      <span className="mt-3 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {test.category}
                      </span>
                      <h3 className="mt-1 font-display text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {test.title}
                      </h3>

                      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                          {test.questions} Questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {test.duration} Minutes
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800">
                      {hasQuestions ? (
                        <button
                          type="button"
                          onClick={() => beginExam(test)}
                          className="btn btn-primary w-full text-xs font-bold"
                        >
                          <Play className="h-3.5 w-3.5" />
                          <span>Start Online Test</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="btn btn-secondary w-full text-xs opacity-60 cursor-not-allowed"
                        >
                          <span>Curating Paper</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
