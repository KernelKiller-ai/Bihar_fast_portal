import { useMemo, useState } from "react";
import {
  AlertCircle,
  Calculator,
  CheckCircle2,
  FileText,
  GraduationCap,
  IndianRupee,
  Landmark,
} from "lucide-react";

const REPAYMENT_YEARS = 7;

const guideSections = [
  {
    title: "What this calculator estimates",
    body: "The Bihar Student Credit Card scheme is part of the Mukhyamantri Nishchay Swayam Sahayata Bhatta Yojana (MNSSBY) programme. This independent calculator gives a planning estimate for a loan of up to ₹4 lakh. It applies the annual rate selected below to the full amount for the course period and the additional moratorium period, using simple interest for that waiting period. The resulting moratorium interest is added to the balance, then a reducing-balance monthly EMI is estimated over seven years. Actual eligibility, disbursement dates, interest treatment, charges, and repayment terms are determined by the current scheme rules and lender records, not by this calculator.",
  },
  {
    title: "Who may be eligible",
    body: "The programme is intended to help eligible Bihar students pursue higher education when financing is a barrier. Applicants generally need to meet the Bihar residence requirements, have completed the prescribed prior qualification, and have secured admission to an eligible course at an institution accepted under the scheme. Course lists, institution recognition, age or academic conditions, co-applicant requirements, and exceptions can change and may differ by course. A student should verify the latest eligibility checklist on the official MNSSBY portal or with the District Registration and Counselling Centre (DRCC) before paying fees or relying on a loan estimate.",
  },
  {
    title: "Prepare the application and documents",
    body: "Collect clear, readable copies before starting an online application. Commonly requested records include the student's Aadhaar or other accepted identity proof, Bihar residence proof, recent photograph, Class 10 and Class 12 marksheets or certificates, and the current admission letter or proof of enrolment. Keep the institution's course and fee structure, bank account details, and contact information available. The portal may also request income, caste, disability, or other certificates when relevant to the applicant, as well as identity, address, income, or bank documents for a parent or co-applicant. This list is a preparation guide, not a substitute for the live portal checklist.",
  },
  {
    title: "Typical application journey",
    body: "First, read the current instructions on the official MNSSBY portal and create an applicant registration with a mobile number and email address you can access. Complete the Student Credit Card form carefully, enter the course and institution exactly as shown in admission records, and upload legible documents in the permitted format and size. Save the acknowledgement or application number. Follow the portal's instructions to schedule or attend document verification at the assigned DRCC; bring originals as requested so officials can compare them with uploaded copies. Respond promptly if the verification team asks for corrections or missing records.",
  },
  {
    title: "Verification, sanction, and payment",
    body: "After document verification, the application proceeds through the scheme's review and participating financial institution processes. Approval is not automatic: the institution, course, student details, documents, and other scheme conditions may be checked. Track the application on the official portal and use only contact details published by the relevant department or DRCC if a status is unclear. Read the sanction and loan documents before accepting them, especially the approved amount, rate, disbursement schedule, repayment start date, moratorium, and any conditions. Funds may be released in stages or paid according to eligible education expenses; this calculator assumes one full disbursement for simplicity.",
  },
  {
    title: "Interest concession and repayment planning",
    body: "For this estimate, male applicants are shown at 4% annual interest and women or Divyang applicants at 1%, as specified for this tool. The first part of the estimate uses simple interest during the course plus the moratorium. The EMI phase uses a standard monthly amortization formula at the same annual rate. These are explicit modelling assumptions for comparison, not a representation of a lender's official ledger. Ask the DRCC or lender how interest is actually accrued, when the moratorium ends, whether any concession depends on timely repayment, and what repayment period applies to your sanction. A longer or shorter repayment period materially changes the monthly EMI and total interest.",
  },
  {
    title: "Documents and practical checks before submission",
    body: "Use consistent spellings of names and dates across identity documents, marksheets, bank records, and the admission letter; resolve discrepancies through the issuing authority where possible. Make sure scans are complete, readable, correctly oriented, and within the file limits on the portal. Keep original certificates and a safe copy of the submitted form and receipt. Do not share OTPs, passwords, or banking credentials with agents or unofficial callers. Never pay an unofficial fee to obtain approval. Use the official portal for current appointment instructions and report suspected fraud to the appropriate public authority.",
  },
  {
    title: "Use the result responsibly",
    body: "The figures below are educational planning estimates only. They are not a loan offer, sanction, financial recommendation, or guarantee that a student or course qualifies. A course may have a different permitted moratorium, disbursement pattern, or repayment schedule, and an official scheme update can change those terms. Compare the estimate with written information from the DRCC and lender; use their approved repayment schedule for budgeting. If a repayment amount seems unaffordable, ask about the scheme's official repayment rules and available support before accepting financing. Do not enter personal identity, bank, or account details into this page.",
  },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export default function StudentCreditCardCalculator() {
  const [amount, setAmount] = useState(200000);
  const [courseYears, setCourseYears] = useState(3);
  const [moratoriumYears, setMoratoriumYears] = useState(1);
  const [category, setCategory] = useState("male");
  const annualRate = category === "male" ? 0.04 : 0.01;

  const estimate = useMemo(() => {
    const principal = Number(amount);
    const courseInterest = principal * annualRate * Number(courseYears);
    const additionalMoratoriumInterest = principal * annualRate * Number(moratoriumYears);
    const moratoriumInterest = courseInterest + additionalMoratoriumInterest;
    const repaymentBalance = principal + moratoriumInterest;
    const monthlyRate = annualRate / 12;
    const repaymentMonths = REPAYMENT_YEARS * 12;
    const monthlyEmi = repaymentBalance * monthlyRate
      / (1 - ((1 + monthlyRate) ** -repaymentMonths));
    const totalRepayment = monthlyEmi * repaymentMonths;

    return {
      courseInterest,
      additionalMoratoriumInterest,
      moratoriumInterest,
      repaymentBalance,
      monthlyEmi,
      totalInterest: totalRepayment - principal,
      totalRepayment,
    };
  }, [amount, annualRate, courseYears, moratoriumYears]);

  const handleAmountChange = (event) => {
    const nextAmount = Number(event.target.value);
    if (Number.isFinite(nextAmount)) setAmount(Math.max(10000, Math.min(400000, nextAmount)));
  };

  const interestShare = estimate.totalRepayment > 0
    ? (estimate.totalInterest / estimate.totalRepayment) * 100
    : 0;

  return (
    <main className="mx-auto min-h-[55vh] max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">MNSSBY planning tool</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0B2545] sm:text-4xl">Bihar Student Credit Card EMI Calculator</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Estimate moratorium interest, monthly EMI, and total repayment for a Student Credit Card loan of up to ₹4 lakh.
        </p>
        <p className="mt-4 flex max-w-3xl items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          This is an illustrative estimate, not an official sanction. It assumes the full amount is disbursed at once and uses a seven-year repayment period.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]" aria-label="Loan inputs and repayment estimate">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-2xl bg-blue-50 p-3 text-blue-800"><Calculator size={22} /></span>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Your loan details</h2>
              <p className="text-xs text-slate-500">Change any value to update the estimate.</p>
            </div>
          </div>

          <label htmlFor="loan-amount" className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700">
            Loan amount <span className="text-blue-800">{formatCurrency(amount)}</span>
          </label>
          <input
            id="loan-amount"
            type="range"
            min="10000"
            max="400000"
            step="5000"
            value={amount}
            onChange={handleAmountChange}
            className="mt-3 w-full accent-blue-800"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-500"><span>₹10,000</span><span>₹4,00,000</span></div>
          <label htmlFor="loan-amount-number" className="sr-only">Enter loan amount in rupees</label>
          <div className="relative mt-3">
            <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="loan-amount-number"
              type="number"
              min="10000"
              max="400000"
              step="5000"
              value={amount}
              onChange={handleAmountChange}
              className="min-h-11 w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-sm font-semibold text-slate-900 focus:border-blue-700 focus:outline-none"
            />
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="course-duration" className="block text-sm font-bold text-slate-700">Course duration</label>
              <div className="mt-2 flex items-center gap-2">
                <input id="course-duration" type="number" min="1" max="8" step="0.5" value={courseYears} onChange={(event) => setCourseYears(Math.max(1, Math.min(8, Number(event.target.value) || 1)))} className="min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-semibold" />
                <span className="text-xs text-slate-500">years</span>
              </div>
            </div>
            <div>
              <label htmlFor="moratorium-period" className="block text-sm font-bold text-slate-700">Moratorium period</label>
              <div className="mt-2 flex items-center gap-2">
                <input id="moratorium-period" type="number" min="0" max="5" step="0.5" value={moratoriumYears} onChange={(event) => setMoratoriumYears(Math.max(0, Math.min(5, Number(event.target.value) || 0)))} className="min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-semibold" />
                <span className="text-xs text-slate-500">extra years</span>
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">Enter course duration and the additional period after study before repayment starts.</p>

          <fieldset className="mt-6">
            <legend className="text-sm font-bold text-slate-700">Gender / concession category</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {[
                { id: "male", label: "Male", rate: "4% p.a." },
                { id: "woman", label: "Woman", rate: "1% p.a." },
                { id: "divyang", label: "Divyang", rate: "1% p.a." },
              ].map((option) => (
                <label key={option.id} className={`cursor-pointer rounded-xl border p-3 transition ${category === option.id ? "border-blue-700 bg-blue-50 ring-1 ring-blue-700" : "border-slate-200 hover:bg-slate-50"}`}>
                  <input type="radio" name="applicant-category" value={option.id} checked={category === option.id} onChange={() => setCategory(option.id)} className="sr-only" />
                  <span className="block text-sm font-bold text-slate-800">{option.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{option.rate}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-live="polite">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-2xl bg-emerald-50 p-3 text-emerald-800"><Landmark size={22} /></span>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Estimated repayment</h2>
              <p className="text-xs text-slate-500">{(annualRate * 100).toFixed(0)}% annual rate · {REPAYMENT_YEARS}-year EMI period</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0B2545] p-5 text-white sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-100">Estimated monthly EMI</p>
            <p className="mt-1 text-3xl font-black sm:text-4xl">{formatCurrency(estimate.monthlyEmi)}<span className="ml-1 text-sm font-semibold text-blue-100">/ month</span></p>
            <p className="mt-2 text-xs text-blue-100">For {REPAYMENT_YEARS * 12} monthly instalments after the moratorium.</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-500">Total estimated interest</p>
              <p className="mt-1 text-xl font-black text-slate-900">{formatCurrency(estimate.totalInterest)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-500">Total payable</p>
              <p className="mt-1 text-xl font-black text-slate-900">{formatCurrency(estimate.totalRepayment)}</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><GraduationCap size={17} className="text-blue-800" /> Moratorium interest breakdown</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4 text-slate-600"><span>During course ({courseYears} years)</span><strong className="text-slate-900">{formatCurrency(estimate.courseInterest)}</strong></div>
              <div className="flex justify-between gap-4 text-slate-600"><span>Additional moratorium ({moratoriumYears} years)</span><strong className="text-slate-900">{formatCurrency(estimate.additionalMoratoriumInterest)}</strong></div>
              <div className="flex justify-between gap-4 border-t border-blue-100 pt-2 font-extrabold text-slate-900"><span>Total before EMI</span><span>{formatCurrency(estimate.moratoriumInterest)}</span></div>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600"><span>Principal</span><span>Estimated interest</span></div>
            <div className="flex h-3 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`${interestShare.toFixed(0)} percent of total repayment is estimated interest`}>
              <div className="bg-blue-700" style={{ width: `${100 - interestShare}%` }} />
              <div className="bg-amber-500" style={{ width: `${interestShare}%` }} />
            </div>
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-700" />
            Calculation assumes simple interest on the full principal during study plus moratorium, then monthly reducing-balance EMI on the resulting balance.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <div className="mb-6 flex items-start gap-3">
          <span className="rounded-xl bg-amber-50 p-2.5 text-amber-700"><FileText size={20} /></span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">MNSSBY guide</p>
            <h2 className="mt-1 text-2xl font-black text-[#0B2545]">Bihar Student Credit Card: application, eligibility, and documents</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Understand the usual application journey and use an official source to confirm current requirements.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {guideSections.map((section) => (
            <article key={section.title}>
              <h3 className="text-base font-extrabold text-slate-900">{section.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{section.body}</p>
            </article>
          ))}
        </div>
        <a
          href="https://www.7nishchay-yuvaupmission.bihar.gov.in/"
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-100"
        >
          <Landmark size={17} /> Check official MNSSBY portal
        </a>
        <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-6 text-slate-500">
          BiharFast is an independent information portal. Scheme rules, eligibility, rates, and repayment terms can change; confirm them with the current official portal and your DRCC or lender before applying or making financial decisions.
        </p>
      </section>
    </main>
  );
}
