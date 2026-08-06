import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "../data/calculators.json");

const i = (id, label, defaultValue, min, max, step) => ({
  id,
  label,
  defaultValue,
  min,
  max,
  step,
});
const f = (question, answer) => ({ question, answer });

function calc({
  slug,
  title,
  category,
  description,
  formulaType,
  inputs,
  intro,
  howToUse,
  faqs,
}) {
  return {
    slug,
    title,
    category,
    description,
    inputs,
    formulaType,
    seoContent: { intro, howToUse, faqs },
  };
}

const EDU = "Education, GPA & Academic";
const STATS = "Statistics, Probability & Advanced Math";
const LEGAL = "Legal, HR & Payroll Management";
const AUTO = "Automotive, Travel & Transit";
const LIFE = "Media, Photography, Cooking & Lifestyle";

const extra = [
  // ——— Education (20) ———
  calc({
    slug: "cumulative-gpa-calculator",
    title: "Cumulative GPA Calculator",
    category: EDU,
    description:
      "Calculate your cumulative GPA from credit hours and grade points. Track academic progress across multiple terms.",
    formulaType: "cumulativeGpa",
    inputs: [
      i("prevGpa", "Previous GPA", 3.2, 0, 4, 0.01),
      i("prevCredits", "Previous Credits", 45, 0, 200, 1),
      i("termGpa", "Current Term GPA", 3.6, 0, 4, 0.01),
      i("termCredits", "Current Term Credits", 15, 1, 30, 1),
    ],
    intro:
      "Your cumulative GPA blends prior and current-term performance weighted by credit hours. This calculator updates your overall GPA after each semester.",
    howToUse: [
      "Enter your previous cumulative GPA and earned credits.",
      "Add this term’s GPA and credit hours.",
      "Review the updated cumulative GPA instantly.",
    ],
    faqs: [
      f("Is this a 4.0 scale?", "Yes—use grade points on a standard 4.0 scale unless your school uses a different system."),
      f("Do failed courses count?", "Usually yes for attempted credits—confirm with your registrar’s policy."),
      f("Can I project future GPA?", "Enter a target term GPA to see how it would change your cumulative average."),
    ],
  }),
  calc({
    slug: "final-exam-grade-needed-calculator",
    title: "Final Exam Grade Needed Calculator",
    category: EDU,
    description:
      "Find the final exam score required to hit your target course grade. Plan study effort with a clear number.",
    formulaType: "finalExamNeeded",
    inputs: [
      i("currentGrade", "Current Grade (%)", 82, 0, 100, 0.5),
      i("desiredGrade", "Desired Final Grade (%)", 90, 0, 100, 0.5),
      i("finalWeight", "Final Exam Weight (%)", 25, 1, 100, 1),
    ],
    intro:
      "Knowing the exact score you need on a final removes guesswork. Enter your current average, target grade, and the exam’s weight to see the required result.",
    howToUse: [
      "Enter your current course percentage.",
      "Set the overall grade you want after the final.",
      "Input how much the final is worth, then review the required score.",
    ],
    faqs: [
      f("What if the required score is over 100%?", "The target may be unreachable at that weight—adjust expectations or confirm extra credit options."),
      f("Does this include curved finals?", "No—curves and drops change outcomes; treat this as a pre-curve estimate."),
      f("Should I use percentage or letter grades?", "Convert letter grades to percentage midpoints before calculating."),
    ],
  }),
  calc({
    slug: "weighted-grade-average-calculator",
    title: "Weighted Grade Average Calculator",
    category: EDU,
    description:
      "Compute a weighted course average from category scores. Handle homework, quizzes, midterms, and projects fairly.",
    formulaType: "weightedGrade",
    inputs: [
      i("score1", "Category 1 Score (%)", 88, 0, 100, 0.5),
      i("weight1", "Category 1 Weight (%)", 20, 0, 100, 1),
      i("score2", "Category 2 Score (%)", 92, 0, 100, 0.5),
      i("weight2", "Category 2 Weight (%)", 30, 0, 100, 1),
      i("score3", "Category 3 Score (%)", 78, 0, 100, 0.5),
      i("weight3", "Category 3 Weight (%)", 50, 0, 100, 1),
    ],
    intro:
      "Weighted averages reflect syllabus category weights rather than simple means. Use this tool to estimate your course grade from up to three weighted components.",
    howToUse: [
      "Enter each category score as a percentage.",
      "Match each score with its syllabus weight.",
      "Review the weighted course average.",
    ],
    faqs: [
      f("Do weights need to total 100%?", "Ideally yes. If they do not, the calculator normalizes by the weight sum."),
      f("How do I handle missing categories?", "Set unused weights to 0."),
      f("Is this the same as GPA?", "No—this is a single-course percentage average, not a GPA."),
    ],
  }),
  calc({
    slug: "sat-act-score-percentile-calculator",
    title: "SAT/ACT Score Percentile Calculator",
    category: EDU,
    description:
      "Estimate percentile standing from SAT or ACT composite scores. Contextualize results against peer performance.",
    formulaType: "satActPercentile",
    inputs: [
      i("testType", "Test Type (1=SAT, 2=ACT)", 1, 1, 2, 1),
      i("score", "Composite Score", 1280, 1, 1600, 1),
    ],
    intro:
      "Percentiles help interpret raw test scores against national distributions. Select SAT or ACT and enter your composite to approximate percentile rank.",
    howToUse: [
      "Choose 1 for SAT or 2 for ACT.",
      "Enter your composite score (SAT 400–1600 or ACT 1–36).",
      "Review the estimated percentile.",
    ],
    faqs: [
      f("Are percentiles official College Board/ACT data?", "These are approximate planning estimates, not official score reports."),
      f("Do superscores change percentiles?", "Superscoring can raise composites; use the score you will report."),
      f("What is a competitive percentile?", "It depends on target schools—research each college’s middle 50% ranges."),
    ],
  }),
  calc({
    slug: "college-tuition-planner-calculator",
    title: "College Tuition Planner Calculator",
    category: EDU,
    description:
      "Project multi-year college costs with tuition inflation. Plan savings and aid gaps before enrollment.",
    formulaType: "collegeTuitionPlanner",
    inputs: [
      i("annualTuition", "Current Annual Cost ($)", 28000, 1000, 90000, 500),
      i("years", "Years Attending", 4, 1, 6, 1),
      i("inflation", "Tuition Inflation (%/yr)", 4, 0, 12, 0.1),
      i("aid", "Annual Aid / Scholarships ($)", 8000, 0, 90000, 500),
    ],
    intro:
      "College costs rise faster than many budgets expect. This planner estimates total net cost over multiple years after aid and tuition inflation.",
    howToUse: [
      "Enter today’s annual all-in cost estimate.",
      "Set years of attendance and expected inflation.",
      "Subtract annual aid, then review total net cost.",
    ],
    faqs: [
      f("What should annual cost include?", "Tuition, fees, housing, meals, books, and typical personal expenses."),
      f("Does aid stay constant?", "Not always—recalculate if scholarships are one-year or merit-renewable."),
      f("Is room and board inflated too?", "This model inflates the full annual cost figure you enter."),
    ],
  }),
  calc({
    slug: "student-loan-amortization-calculator",
    title: "Student Loan Amortization Calculator",
    category: EDU,
    description:
      "Build a student loan amortization estimate with payment and interest totals. Understand repayment before you borrow.",
    formulaType: "studentLoanAmortization",
    inputs: [
      i("principal", "Loan Amount ($)", 40000, 1000, 300000, 500),
      i("annualRate", "Interest Rate (%)", 5.5, 0, 15, 0.1),
      i("termYears", "Term (years)", 10, 1, 30, 1),
    ],
    intro:
      "Amortization shows how each payment splits between interest and principal over time. Use this calculator to estimate monthly cost and lifetime interest on education debt.",
    howToUse: [
      "Enter the loan principal.",
      "Input APR and repayment term in years.",
      "Review monthly payment and total interest.",
    ],
    faqs: [
      f("Is this federal or private loan math?", "It is a standard amortizing loan model useful for both, though federal plans may differ."),
      f("What about income-driven repayment?", "IDR payments are income-based and may not fully amortize on this schedule."),
      f("Can I model extra payments?", "Use the Student Loan Payoff Calculator for accelerated scenarios."),
    ],
  }),
  calc({
    slug: "study-time-allocation-calculator",
    title: "Study Time Allocation Calculator",
    category: EDU,
    description:
      "Allocate weekly study hours across courses by credit load and difficulty. Build a realistic study schedule.",
    formulaType: "studyTimeAllocation",
    inputs: [
      i("credits", "Total Credit Hours", 15, 1, 24, 1),
      i("hoursPerCredit", "Study Hours per Credit", 2.5, 1, 5, 0.5),
      i("availableHours", "Available Study Hours / Week", 30, 5, 80, 1),
    ],
    intro:
      "Effective study plans match workload to available time. This calculator estimates recommended weekly study hours and whether your schedule has enough capacity.",
    howToUse: [
      "Enter total enrolled credit hours.",
      "Set study hours expected per credit.",
      "Add available weekly hours and compare the gap.",
    ],
    faqs: [
      f("Is 2–3 hours per credit standard?", "It is a common guideline, but STEM or writing-heavy courses may need more."),
      f("Should exams weeks differ?", "Yes—increase allocation before midterms and finals."),
      f("What if available hours are too low?", "Reduce course load, cut non-essentials, or seek academic support."),
    ],
  }),
  calc({
    slug: "reading-time-word-count-calculator",
    title: "Reading Time Word Count Calculator",
    category: EDU,
    description:
      "Estimate reading time from word count and reading speed. Plan assignments and research sessions accurately.",
    formulaType: "readingTime",
    inputs: [
      i("wordCount", "Word Count", 5000, 100, 200000, 100),
      i("wpm", "Reading Speed (WPM)", 200, 50, 600, 10),
    ],
    intro:
      "Reading time estimates help you schedule homework and research realistically. Enter word count and words-per-minute speed to get minutes and hours required.",
    howToUse: [
      "Enter the document or chapter word count.",
      "Set your typical reading speed in WPM.",
      "Review estimated reading time.",
    ],
    faqs: [
      f("What is an average adult WPM?", "Around 200–250 WPM for non-technical prose is common."),
      f("Do dense textbooks take longer?", "Yes—lower WPM for technical or unfamiliar material."),
      f("Should I include note-taking?", "Add buffer time if you annotate or outline while reading."),
    ],
  }),
  calc({
    slug: "page-to-word-calculator",
    title: "Page to Word Calculator",
    category: EDU,
    description:
      "Convert page counts to estimated word counts using spacing and font assumptions. Scope essays and reports faster.",
    formulaType: "pageToWord",
    inputs: [
      i("pages", "Number of Pages", 5, 1, 100, 1),
      i("wordsPerPage", "Words per Page", 250, 150, 500, 10),
    ],
    intro:
      "Assignment length is often listed in pages, but drafting works better in words. Convert pages to an estimated word count with your formatting assumptions.",
    howToUse: [
      "Enter the required page count.",
      "Set expected words per page (e.g., 250 double-spaced).",
      "Review the estimated total words.",
    ],
    faqs: [
      f("How many words is a double-spaced page?", "About 250 words is a common estimate with standard fonts."),
      f("Do images reduce word count?", "Yes—pages with figures hold fewer words."),
      f("Single-spaced estimates?", "Often closer to 500 words per page depending on margins."),
    ],
  }),
  calc({
    slug: "scholarship-roi-calculator",
    title: "Scholarship ROI Calculator",
    category: EDU,
    description:
      "Measure scholarship return against application time invested. Prioritize awards with the best payoff.",
    formulaType: "scholarshipRoi",
    inputs: [
      i("awardAmount", "Scholarship Amount ($)", 2500, 50, 50000, 50),
      i("hoursSpent", "Hours to Apply", 8, 0.5, 80, 0.5),
      i("winProbability", "Win Probability (%)", 20, 1, 100, 1),
    ],
    intro:
      "Not every scholarship is worth the same effort. Estimate expected value per hour so you can prioritize higher-ROI applications.",
    howToUse: [
      "Enter the award dollar amount.",
      "Add estimated hours to complete the application.",
      "Set an honest win probability and review expected ROI.",
    ],
    faqs: [
      f("How do I estimate win probability?", "Use competitiveness, eligibility fit, and past winner profiles as guides."),
      f("Should tiny awards be ignored?", "Not if they take almost no time—high probability micro-awards can still pay well."),
      f("Is expected value guaranteed?", "No—it is a planning metric for prioritization."),
    ],
  }),
  calc({
    slug: "ap-exam-score-calculator",
    title: "AP Exam Score Calculator",
    category: EDU,
    description:
      "Estimate AP exam composite conversion to a 1–5 score. Gauge readiness before test day.",
    formulaType: "apExamScore",
    inputs: [
      i("mcCorrect", "Multiple Choice Correct", 35, 0, 55, 1),
      i("mcTotal", "Multiple Choice Total", 55, 1, 60, 1),
      i("frqPercent", "FRQ Score (%)", 70, 0, 100, 1),
      i("mcWeight", "MC Weight (%)", 50, 30, 70, 1),
    ],
    intro:
      "AP scoring combines multiple-choice and free-response performance into a composite that maps to 1–5. This estimator approximates your likely AP score band.",
    howToUse: [
      "Enter multiple-choice corrects and total questions.",
      "Estimate free-response percentage performance.",
      "Confirm section weights and review the projected AP score.",
    ],
    faqs: [
      f("Are cut scores identical every year?", "No—College Board scales composites annually; treat results as estimates."),
      f("Do all AP subjects use the same weights?", "Weights vary by subject—adjust inputs to match your exam."),
      f("What score earns credit?", "Many colleges accept 3+, but selective schools may require 4 or 5."),
    ],
  }),
  calc({
    slug: "class-rank-calculator",
    title: "Class Rank Calculator",
    category: EDU,
    description:
      "Convert class rank and class size into percentile standing. Understand relative academic position quickly.",
    formulaType: "classRank",
    inputs: [
      i("rank", "Your Rank", 25, 1, 2000, 1),
      i("classSize", "Class Size", 400, 2, 5000, 1),
    ],
    intro:
      "Class rank percentile contextualizes raw rank numbers across different school sizes. Enter rank and graduating class size to see your percentile.",
    howToUse: [
      "Enter your class rank (1 = top).",
      "Enter total students in the class.",
      "Review percentile and top-percentage standing.",
    ],
    faqs: [
      f("Is rank 1 the highest?", "Yes—rank 1 is typically the top student."),
      f("Do ties affect rank?", "Schools handle ties differently; use the official rank reported on transcripts."),
      f("Why do colleges care?", "Rank can supplement GPA context, especially when curricula vary in rigor."),
    ],
  }),
  calc({
    slug: "grade-percentage-converter-calculator",
    title: "Grade Percentage Converter Calculator",
    category: EDU,
    description:
      "Convert between letter grades and percentage ranges. Standardize transcripts and syllabus comparisons.",
    formulaType: "gradePercentageConverter",
    inputs: [
      i("percentage", "Percentage Grade", 87, 0, 100, 0.5),
    ],
    intro:
      "Letter and percentage scales are not always labeled the same way across schools. Convert a percentage into a common letter-grade estimate for quick reference.",
    howToUse: [
      "Enter your percentage grade.",
      "Review the estimated letter grade and GPA points.",
    ],
    faqs: [
      f("Is A- always 90–92?", "Cutoffs vary by institution—verify against your syllabus."),
      f("Does this use plus/minus?", "Yes, it maps to a common plus/minus percentage scale."),
      f("Can I convert letter to percent?", "Use the midpoint of your school’s published range for reverse estimates."),
    ],
  }),
  calc({
    slug: "quiz-score-calculator",
    title: "Quiz Score Calculator",
    category: EDU,
    description:
      "Convert correct answers into quiz percentages and letter estimates. Grade practice tests in seconds.",
    formulaType: "quizScore",
    inputs: [
      i("correct", "Correct Answers", 18, 0, 100, 1),
      i("total", "Total Questions", 20, 1, 100, 1),
    ],
    intro:
      "Quick quiz scoring helps students and teachers turn raw corrects into percentages. Enter correct and total questions for an instant score.",
    howToUse: [
      "Enter the number of correct answers.",
      "Enter total questions on the quiz.",
      "Review percentage score and letter estimate.",
    ],
    faqs: [
      f("How is partial credit handled?", "Enter fractional corrects if your platform supports partial scoring."),
      f("What about penalty guessing?", "This tool assumes no wrong-answer penalty."),
      f("Can I weight questions unequally?", "Use the Weighted Grade Average Calculator for unequal point values."),
    ],
  }),
  calc({
    slug: "homeschool-budget-calculator",
    title: "Homeschool Budget Calculator",
    category: EDU,
    description:
      "Estimate annual homeschool costs across curriculum, activities, and supplies. Plan education spending with clarity.",
    formulaType: "homeschoolBudget",
    inputs: [
      i("curriculum", "Curriculum ($/yr)", 800, 0, 10000, 50),
      i("activities", "Activities / Co-ops ($/yr)", 600, 0, 10000, 50),
      i("supplies", "Supplies & Tech ($/yr)", 400, 0, 10000, 50),
      i("students", "Number of Students", 2, 1, 10, 1),
    ],
    intro:
      "Homeschool budgets vary widely by curriculum style and activity load. Aggregate yearly costs and see per-student spending at a glance.",
    howToUse: [
      "Enter annual curriculum costs.",
      "Add activities, co-ops, supplies, and technology.",
      "Set student count and review totals.",
    ],
    faqs: [
      f("Should I include field trips?", "Yes—put travel and admissions under activities."),
      f("Do shared materials lower per-student cost?", "Often yes for younger siblings using the same resources."),
      f("Are there tax considerations?", "Rules vary by location—consult a tax professional for deductions."),
    ],
  }),
  calc({
    slug: "dorm-room-expense-calculator",
    title: "Dorm Room Expense Calculator",
    category: EDU,
    description:
      "Budget dorm setup and monthly living extras beyond tuition. Avoid surprise first-year housing costs.",
    formulaType: "dormRoomExpense",
    inputs: [
      i("setupCost", "One-time Setup ($)", 450, 0, 5000, 25),
      i("monthlyExtras", "Monthly Extras ($)", 120, 0, 2000, 10),
      i("months", "Months on Campus", 9, 1, 12, 1),
    ],
    intro:
      "Dorm life includes setup purchases plus recurring extras like toiletries, laundry, and snacks. Estimate your academic-year dorm spending before move-in.",
    howToUse: [
      "Enter one-time setup costs (bedding, organizers, lamps).",
      "Add expected monthly extras.",
      "Set months on campus and review total cost.",
    ],
    faqs: [
      f("Does this include room and board?", "No—it focuses on personal dorm expenses beyond housing contracts."),
      f("What setup items matter most?", "Bedding, power strips, storage, and basic cleaning supplies are common essentials."),
      f("Can roommates split costs?", "Yes—divide shared item totals before entering setup cost."),
    ],
  }),
  calc({
    slug: "textbook-resale-calculator",
    title: "Textbook Resale Calculator",
    category: EDU,
    description:
      "Estimate textbook resale value and net cost of ownership. Decide whether to buy new, used, or rent.",
    formulaType: "textbookResale",
    inputs: [
      i("purchasePrice", "Purchase Price ($)", 120, 5, 500, 5),
      i("resaleValue", "Expected Resale ($)", 45, 0, 500, 5),
      i("fees", "Resale Fees ($)", 5, 0, 50, 1),
    ],
    intro:
      "The true cost of a textbook is purchase price minus what you recover at resale. Estimate net ownership cost before choosing buy vs rent.",
    howToUse: [
      "Enter what you paid (or will pay) for the book.",
      "Estimate resale value at term end.",
      "Subtract marketplace fees and review net cost.",
    ],
    faqs: [
      f("Do international editions resell well?", "Often less than domestic editions—check demand first."),
      f("Are access codes refundable?", "Usually no—codes can make resale value near zero."),
      f("When is renting better?", "When resale markets are weak or you need the book briefly."),
    ],
  }),
  calc({
    slug: "grad-school-debt-payoff-calculator",
    title: "Grad School Debt Payoff Calculator",
    category: EDU,
    description:
      "Project graduate school loan payoff timelines with optional extra payments. Plan repayment before you enroll.",
    formulaType: "gradSchoolDebtPayoff",
    inputs: [
      i("principal", "Loan Balance ($)", 65000, 1000, 400000, 1000),
      i("annualRate", "Interest Rate (%)", 6.5, 0, 15, 0.1),
      i("termYears", "Term (years)", 15, 5, 30, 1),
      i("extraPayment", "Extra Monthly ($)", 100, 0, 3000, 25),
    ],
    intro:
      "Graduate degrees can create larger loan balances than undergrad paths. Model standard amortization plus extra payments to see interest and payoff timing.",
    howToUse: [
      "Enter expected or current grad loan balance.",
      "Set interest rate and term.",
      "Add extra monthly payment capacity and review results.",
    ],
    faqs: [
      f("Should I include undergrad loans too?", "For total debt planning, yes—combine balances or run separate scenarios."),
      f("Do fellowships change this?", "Funding that reduces borrowing has the largest impact on lifetime interest."),
      f("What about loan forgiveness?", "Public service or institutional programs may alter payoff strategy—verify eligibility."),
    ],
  }),
  calc({
    slug: "online-course-completion-calculator",
    title: "Online Course Completion Calculator",
    category: EDU,
    description:
      "Estimate weeks needed to finish an online course at your weekly study pace. Stay accountable to launch dates.",
    formulaType: "onlineCourseCompletion",
    inputs: [
      i("totalHours", "Total Course Hours", 40, 1, 400, 1),
      i("hoursPerWeek", "Hours Available / Week", 6, 1, 40, 0.5),
      i("completedHours", "Hours Already Completed", 5, 0, 400, 1),
    ],
    intro:
      "Self-paced courses only finish when your calendar matches the remaining workload. Estimate completion time from leftover hours and weekly availability.",
    howToUse: [
      "Enter total estimated course hours.",
      "Add hours already completed.",
      "Set weekly study availability and review weeks remaining.",
    ],
    faqs: [
      f("What counts as course hours?", "Video lectures, readings, assignments, and project work."),
      f("Should I pad the estimate?", "Yes—add buffer for difficult modules or life interruptions."),
      f("Can I model faster completion?", "Increase hours per week to see an accelerated timeline."),
    ],
  }),
  calc({
    slug: "attendance-percentage-calculator",
    title: "Attendance Percentage Calculator",
    category: EDU,
    description:
      "Calculate attendance percentage from classes attended versus scheduled. Monitor course participation requirements.",
    formulaType: "attendancePercentage",
    inputs: [
      i("attended", "Classes Attended", 26, 0, 200, 1),
      i("scheduled", "Classes Scheduled", 30, 1, 200, 1),
    ],
    intro:
      "Many courses enforce minimum attendance thresholds. Convert attended sessions into an attendance percentage before you risk penalties.",
    howToUse: [
      "Enter how many classes you have attended.",
      "Enter total classes scheduled so far or for the term.",
      "Review attendance percentage and absences.",
    ],
    faqs: [
      f("Do excused absences count?", "Policies vary—follow your syllabus for excused vs unexcused rules."),
      f("Should I use term totals or to-date totals?", "Use to-date for current standing; term totals for final projections."),
      f("What if labs and lectures differ?", "Track each component separately if weights differ."),
    ],
  }),

  // ——— Statistics (20) ———
  calc({
    slug: "standard-deviation-variance-calculator",
    title: "Standard Deviation and Variance Calculator",
    category: STATS,
    description:
      "Compute population or sample variance and standard deviation from summary stats. Quantify data spread quickly.",
    formulaType: "stdDevVariance",
    inputs: [
      i("n", "Sample Size (n)", 10, 2, 1000, 1),
      i("sum", "Sum of Values", 500, -100000, 1000000, 1),
      i("sumSquares", "Sum of Squares", 26000, 0, 1e9, 1),
      i("sampleFlag", "Sample (1) or Population (0)", 1, 0, 1, 1),
    ],
    intro:
      "Variance and standard deviation describe how dispersed values are around the mean. Provide n, sum, and sum of squares to compute both measures.",
    howToUse: [
      "Enter the number of observations.",
      "Input the sum of values and sum of squared values.",
      "Choose sample or population mode and review results.",
    ],
    faqs: [
      f("Why divide by n−1 for samples?", "Bessel’s correction reduces bias when estimating population variance from a sample."),
      f("What is sum of squares?", "Each value squared, then summed—used in computational variance formulas."),
      f("Can this handle negative values?", "Yes—the mean and squared deviations handle signed data."),
    ],
  }),
  calc({
    slug: "sample-size-determination-calculator",
    title: "Sample Size Determination Calculator",
    category: STATS,
    description:
      "Estimate required sample size for a proportion survey at a chosen confidence level. Design studies with adequate power basics.",
    formulaType: "sampleSize",
    inputs: [
      i("confidence", "Confidence Level (%)", 95, 80, 99, 1),
      i("marginError", "Margin of Error (%)", 5, 0.5, 20, 0.5),
      i("proportion", "Expected Proportion (%)", 50, 1, 99, 1),
    ],
    intro:
      "Sample size calculators help surveys reach a desired precision. Estimate how many responses you need for a given confidence level and margin of error.",
    howToUse: [
      "Choose a confidence level (commonly 95%).",
      "Set the acceptable margin of error.",
      "Enter expected proportion and review required n.",
    ],
    faqs: [
      f("Why use 50% proportion as default?", "It maximizes required sample size, giving a conservative estimate."),
      f("Does this include finite population correction?", "This version assumes a large population."),
      f("Is confidence the same as probability of being right?", "It refers to long-run coverage of the interval method, not a single-study guarantee."),
    ],
  }),
  calc({
    slug: "confidence-interval-calculator",
    title: "Confidence Interval Calculator",
    category: STATS,
    description:
      "Build a mean confidence interval from sample mean, SD, and n. Report estimates with statistical context.",
    formulaType: "confidenceInterval",
    inputs: [
      i("mean", "Sample Mean", 70, -1000, 10000, 0.1),
      i("sd", "Standard Deviation", 12, 0.01, 1000, 0.1),
      i("n", "Sample Size", 40, 2, 10000, 1),
      i("z", "Z-score (e.g. 1.96)", 1.96, 1, 3.5, 0.01),
    ],
    intro:
      "Confidence intervals communicate estimate uncertainty for a population mean. Enter sample statistics and a z critical value to compute the interval bounds.",
    howToUse: [
      "Enter sample mean and standard deviation.",
      "Add sample size n.",
      "Set z (1.96 for ~95%) and review the interval.",
    ],
    faqs: [
      f("When should I use t instead of z?", "Use t for smaller samples or when sigma is unknown—z is an approximation."),
      f("What does 95% confidence mean?", "In repeated sampling, about 95% of such intervals would contain the true mean."),
      f("Can SD be zero?", "Only if all values are identical—then the interval collapses to the mean."),
    ],
  }),
  calc({
    slug: "z-score-p-value-calculator",
    title: "Z-Score and P-Value Calculator",
    category: STATS,
    description:
      "Convert a raw score into a z-score and approximate two-tailed p-value. Standardize results for comparison.",
    formulaType: "zScorePValue",
    inputs: [
      i("x", "Raw Score (x)", 85, -1000, 10000, 0.1),
      i("mean", "Mean (μ)", 70, -1000, 10000, 0.1),
      i("sd", "Standard Deviation (σ)", 10, 0.01, 1000, 0.1),
    ],
    intro:
      "Z-scores show how many standard deviations a value sits from the mean. This calculator also approximates a two-tailed normal p-value for quick inference checks.",
    howToUse: [
      "Enter the raw score.",
      "Provide population/sample mean and SD.",
      "Review z-score and approximate p-value.",
    ],
    faqs: [
      f("Is the p-value exact?", "It is a normal-approximation estimate suitable for learning and quick checks."),
      f("What is a large |z|?", "Values beyond about 2 are often considered unusual under a standard normal model."),
      f("Can SD be negative?", "No—standard deviation must be positive."),
    ],
  }),
  calc({
    slug: "permutation-combination-calculator",
    title: "Permutation and Combination Calculator",
    category: STATS,
    description:
      "Calculate P(n, r) and C(n, r) for counting problems. Solve ordering and selection scenarios instantly.",
    formulaType: "permutationCombination",
    inputs: [
      i("n", "n (total items)", 10, 0, 170, 1),
      i("r", "r (chosen items)", 3, 0, 170, 1),
    ],
    intro:
      "Permutations count ordered arrangements; combinations count unordered selections. Enter n and r to compute both fundamental counting values.",
    howToUse: [
      "Enter total items n.",
      "Enter items chosen r (r ≤ n).",
      "Review permutations and combinations.",
    ],
    faqs: [
      f("When do I use permutations?", "When order matters, such as rankings or sequences."),
      f("When do I use combinations?", "When order does not matter, such as committees or hand sets."),
      f("What if r > n?", "Both values are undefined/zero in standard counting—keep r ≤ n."),
    ],
  }),
  calc({
    slug: "pythagorean-theorem-calculator",
    title: "Pythagorean Theorem Calculator",
    category: STATS,
    description:
      "Solve right-triangle sides with a² + b² = c². Find hypotenuse or a missing leg instantly.",
    formulaType: "pythagorean",
    inputs: [
      i("a", "Side a", 3, 0.01, 10000, 0.01),
      i("b", "Side b", 4, 0.01, 10000, 0.01),
      i("mode", "Mode (1=hyp, 2=leg a from b,c)", 1, 1, 2, 1),
      i("c", "Hypotenuse c (mode 2)", 5, 0.01, 10000, 0.01),
    ],
    intro:
      "The Pythagorean theorem relates right-triangle side lengths. Compute the hypotenuse from two legs, or solve a missing leg when the hypotenuse is known.",
    howToUse: [
      "Enter known side lengths.",
      "Choose mode 1 to find hypotenuse from a and b.",
      "Choose mode 2 to solve leg a from b and c.",
    ],
    faqs: [
      f("Does this work for non-right triangles?", "No—use law of cosines/sines for oblique triangles."),
      f("Can sides be zero?", "Degenerate triangles are invalid; use positive lengths."),
      f("Units?", "Keep all sides in the same unit."),
    ],
  }),
  calc({
    slug: "quadratic-equation-solver-calculator",
    title: "Quadratic Equation Solver Calculator",
    category: STATS,
    description:
      "Solve ax² + bx + c = 0 for real roots. Inspect discriminant and root values instantly.",
    formulaType: "quadraticSolver",
    inputs: [
      i("a", "Coefficient a", 1, -1000, 1000, 0.1),
      i("b", "Coefficient b", -5, -1000, 1000, 0.1),
      i("c", "Coefficient c", 6, -1000, 1000, 0.1),
    ],
    intro:
      "Quadratic equations appear throughout algebra, physics, and optimization. Enter coefficients a, b, and c to compute the discriminant and real roots when they exist.",
    howToUse: [
      "Enter coefficient a (nonzero).",
      "Enter coefficients b and c.",
      "Review discriminant and solution set.",
    ],
    faqs: [
      f("What if discriminant is negative?", "Roots are complex; this tool reports that no real roots exist."),
      f("What if a = 0?", "The equation becomes linear, not quadratic."),
      f("Do repeated roots count twice?", "A zero discriminant yields one unique real root (multiplicity two)."),
    ],
  }),
  calc({
    slug: "matrix-multiplication-calculator",
    title: "Matrix Multiplication Calculator",
    category: STATS,
    description:
      "Multiply two 2×2 matrices and view the resulting matrix entries. Practice linear algebra fundamentals quickly.",
    formulaType: "matrixMultiply2x2",
    inputs: [
      i("a11", "A[1,1]", 1, -100, 100, 0.1),
      i("a12", "A[1,2]", 2, -100, 100, 0.1),
      i("a21", "A[2,1]", 3, -100, 100, 0.1),
      i("a22", "A[2,2]", 4, -100, 100, 0.1),
      i("b11", "B[1,1]", 5, -100, 100, 0.1),
      i("b12", "B[1,2]", 6, -100, 100, 0.1),
      i("b21", "B[2,1]", 7, -100, 100, 0.1),
      i("b22", "B[2,2]", 8, -100, 100, 0.1),
    ],
    intro:
      "Matrix multiplication combines rows of A with columns of B. This 2×2 calculator returns each entry of the product matrix for fast verification.",
    howToUse: [
      "Enter all four entries of matrix A.",
      "Enter all four entries of matrix B.",
      "Review the four resulting product entries.",
    ],
    faqs: [
      f("Is AB the same as BA?", "Not generally—matrix multiplication is not commutative."),
      f("Why only 2×2?", "It covers the most common homework case with a simple interface."),
      f("What are dimensions requirements?", "A’s columns must match B’s rows—here both are 2×2."),
    ],
  }),
  calc({
    slug: "fraction-decimal-converter-calculator",
    title: "Fraction Decimal Converter Calculator",
    category: STATS,
    description:
      "Convert a fraction numerator/denominator into decimal and percent forms. Simplify homework checks instantly.",
    formulaType: "fractionDecimal",
    inputs: [
      i("numerator", "Numerator", 3, -100000, 100000, 1),
      i("denominator", "Denominator", 4, -100000, 100000, 1),
    ],
    intro:
      "Fractions, decimals, and percents are interchangeable representations of the same ratio. Convert any numerator/denominator pair into decimal and percent outputs.",
    howToUse: [
      "Enter the numerator.",
      "Enter a nonzero denominator.",
      "Review decimal and percent equivalents.",
    ],
    faqs: [
      f("What if denominator is zero?", "Division by zero is undefined."),
      f("Are repeating decimals rounded?", "Results are shown with fixed precision for readability."),
      f("Can negatives be converted?", "Yes—signs carry into the decimal result."),
    ],
  }),
  calc({
    slug: "lcm-gcd-calculator",
    title: "LCM and GCD Calculator",
    category: STATS,
    description:
      "Find the greatest common divisor and least common multiple of two integers. Essential for fractions and scheduling math.",
    formulaType: "lcmGcd",
    inputs: [
      i("a", "First Integer", 48, 1, 1000000, 1),
      i("b", "Second Integer", 18, 1, 1000000, 1),
    ],
    intro:
      "GCD finds the largest shared divisor; LCM finds the smallest shared multiple. Compute both for two positive integers in one step.",
    howToUse: [
      "Enter the first positive integer.",
      "Enter the second positive integer.",
      "Review GCD and LCM results.",
    ],
    faqs: [
      f("How are GCD and LCM related?", "For positives, GCD(a,b) × LCM(a,b) = a × b."),
      f("Does order matter?", "No—GCD and LCM are symmetric."),
      f("What about more than two numbers?", "Reduce pairwise across the full set."),
    ],
  }),
  calc({
    slug: "logarithm-exponential-growth-calculator",
    title: "Logarithm and Exponential Growth Calculator",
    category: STATS,
    description:
      "Evaluate exponential growth and corresponding log time-to-target. Model compounding quantities with clarity.",
    formulaType: "logExponentialGrowth",
    inputs: [
      i("initial", "Initial Value", 1000, 0.01, 1e9, 1),
      i("rate", "Growth Rate (%)", 8, -50, 100, 0.1),
      i("periods", "Periods", 10, 1, 100, 1),
      i("target", "Target Value", 2000, 0.01, 1e9, 1),
    ],
    intro:
      "Exponential growth models appear in finance, biology, and technology adoption. Project future value and estimate periods needed to reach a target.",
    howToUse: [
      "Enter the starting value and growth rate per period.",
      "Set number of periods for projection.",
      "Optionally set a target to estimate time required.",
    ],
    faqs: [
      f("Is the rate continuous or discrete?", "This uses discrete per-period compounding."),
      f("Can rate be negative?", "Yes—negative rates model exponential decay."),
      f("What base is the log?", "Time-to-target uses the growth factor logarithm."),
    ],
  }),
  calc({
    slug: "sequence-progression-calculator",
    title: "Sequence Progression Calculator",
    category: STATS,
    description:
      "Compute nth terms and sums for arithmetic or geometric sequences. Solve progression problems quickly.",
    formulaType: "sequenceProgression",
    inputs: [
      i("type", "Type (1=Arithmetic, 2=Geometric)", 1, 1, 2, 1),
      i("first", "First Term (a1)", 3, -10000, 10000, 0.1),
      i("common", "Common Difference/Ratio", 2, -100, 100, 0.1),
      i("n", "Term Number n", 10, 1, 200, 1),
    ],
    intro:
      "Arithmetic sequences add a constant; geometric sequences multiply by a constant. Calculate the nth term and partial sum for either progression type.",
    howToUse: [
      "Choose arithmetic (1) or geometric (2).",
      "Enter first term and common difference/ratio.",
      "Set n and review term and sum.",
    ],
    faqs: [
      f("What is a common difference?", "The constant added each step in an arithmetic sequence."),
      f("What is a common ratio?", "The constant multiplier in a geometric sequence."),
      f("Can n be zero?", "Standard sequences start at n = 1 in this tool."),
    ],
  }),
  calc({
    slug: "probability-compound-events-calculator",
    title: "Probability of Compound Events Calculator",
    category: STATS,
    description:
      "Calculate AND/OR probabilities for independent events. Combine event likelihoods with correct probability rules.",
    formulaType: "compoundProbability",
    inputs: [
      i("pA", "P(A) (%)", 40, 0, 100, 0.1),
      i("pB", "P(B) (%)", 25, 0, 100, 0.1),
      i("mode", "Mode (1=AND independent, 2=OR mutually exclusive, 3=OR independent)", 1, 1, 3, 1),
    ],
    intro:
      "Compound probability depends on whether events are independent or mutually exclusive. Compute AND/OR results from two event probabilities under common assumptions.",
    howToUse: [
      "Enter probability of event A and event B as percents.",
      "Select AND independent, OR exclusive, or OR independent.",
      "Review the combined probability.",
    ],
    faqs: [
      f("What does independent mean?", "Knowing one event occurred does not change the other event’s probability."),
      f("What does mutually exclusive mean?", "Both events cannot occur together, so P(A and B) = 0."),
      f("Can probabilities exceed 100%?", "Valid single-event inputs stay within 0–100%."),
    ],
  }),
  calc({
    slug: "descriptive-statistics-calculator",
    title: "Descriptive Statistics Calculator",
    category: STATS,
    description:
      "Derive mean estimates from count, sum, min, and max summaries. Summarize datasets with core descriptive metrics.",
    formulaType: "descriptiveStats",
    inputs: [
      i("n", "Count (n)", 12, 1, 100000, 1),
      i("sum", "Sum", 960, -1e9, 1e9, 1),
      i("min", "Minimum", 50, -1e9, 1e9, 1),
      i("max", "Maximum", 110, -1e9, 1e9, 1),
    ],
    intro:
      "Descriptive statistics compress raw data into interpretable summaries. From count and sum you get the mean; min and max establish range.",
    howToUse: [
      "Enter the number of observations.",
      "Input the sum of all values.",
      "Add minimum and maximum to review mean and range.",
    ],
    faqs: [
      f("Is this a full five-number summary?", "It covers mean and range essentials; median/quartiles need ordered data."),
      f("Can min exceed max?", "No—swap values if entered incorrectly."),
      f("Does mean equal median?", "Only for symmetric distributions."),
    ],
  }),
  calc({
    slug: "margin-of-error-calculator",
    title: "Margin of Error Calculator",
    category: STATS,
    description:
      "Estimate survey margin of error from sample size and confidence z-score. Communicate poll precision clearly.",
    formulaType: "marginOfError",
    inputs: [
      i("n", "Sample Size", 1000, 10, 100000, 10),
      i("proportion", "Observed Proportion (%)", 50, 1, 99, 1),
      i("z", "Z-score", 1.96, 1, 3.5, 0.01),
    ],
    intro:
      "Margin of error quantifies sampling uncertainty around a survey proportion. Use sample size, observed proportion, and z critical value to estimate it.",
    howToUse: [
      "Enter sample size n.",
      "Set observed/expected proportion.",
      "Choose z and review margin of error.",
    ],
    faqs: [
      f("Why do larger samples shrink MOE?", "Standard error falls as n increases."),
      f("Is MOE the only poll error?", "No—bias, wording, and nonresponse also matter."),
      f("What z for 99% confidence?", "Approximately 2.58."),
    ],
  }),
  calc({
    slug: "hypothesis-testing-calculator",
    title: "Hypothesis Testing Calculator",
    category: STATS,
    description:
      "Compute a one-sample z test statistic from mean hypotheses. Compare evidence against a null value.",
    formulaType: "hypothesisTesting",
    inputs: [
      i("sampleMean", "Sample Mean", 102, -10000, 10000, 0.1),
      i("nullMean", "Null Hypothesis Mean", 100, -10000, 10000, 0.1),
      i("sd", "Standard Deviation", 15, 0.01, 10000, 0.1),
      i("n", "Sample Size", 50, 2, 100000, 1),
    ],
    intro:
      "Hypothesis tests evaluate whether sample evidence conflicts with a stated null mean. Compute the z test statistic from sample mean, null value, SD, and n.",
    howToUse: [
      "Enter the sample mean and null hypothesis mean.",
      "Provide SD and sample size.",
      "Review the z test statistic magnitude.",
    ],
    faqs: [
      f("How do I use the z statistic?", "Compare |z| to critical values or convert to a p-value."),
      f("Is this one-tailed or two-tailed?", "The statistic is the same; tail choice affects the critical threshold."),
      f("When is t preferred?", "When sigma is estimated from small samples."),
    ],
  }),
  calc({
    slug: "correlation-coefficient-calculator",
    title: "Correlation Coefficient Calculator",
    category: STATS,
    description:
      "Estimate Pearson correlation from summarized covariance inputs. Gauge linear association strength quickly.",
    formulaType: "correlationCoefficient",
    inputs: [
      i("covariance", "Covariance", 12, -100000, 100000, 0.1),
      i("sdX", "SD of X", 4, 0.01, 10000, 0.1),
      i("sdY", "SD of Y", 5, 0.01, 10000, 0.1),
    ],
    intro:
      "Pearson’s correlation standardizes covariance by the product of standard deviations. Enter those summaries to estimate r between two variables.",
    howToUse: [
      "Enter covariance of X and Y.",
      "Enter standard deviations of X and Y.",
      "Review correlation r and association strength.",
    ],
    faqs: [
      f("What range can r take?", "From −1 to +1 for real-valued Pearson correlation."),
      f("Does correlation imply causation?", "No—association is not causal proof."),
      f("What if SD is zero?", "Correlation is undefined when a variable has no variability."),
    ],
  }),
  calc({
    slug: "factorial-exponent-calculator",
    title: "Factorial and Exponent Calculator",
    category: STATS,
    description:
      "Compute n! and base^exponent for common math tasks. Handle counting and power calculations quickly.",
    formulaType: "factorialExponent",
    inputs: [
      i("n", "n for Factorial", 6, 0, 170, 1),
      i("base", "Exponent Base", 2, -100, 100, 0.1),
      i("exp", "Exponent", 8, -20, 100, 1),
    ],
    intro:
      "Factorials and exponents underpin combinatorics and growth models. Calculate n! and a power expression side by side for homework or analysis.",
    howToUse: [
      "Enter n for the factorial.",
      "Enter base and exponent for the power.",
      "Review both results.",
    ],
    faqs: [
      f("Why is n capped?", "Factorials grow extremely fast and can overflow impractical ranges."),
      f("Is 0! defined?", "Yes—by convention 0! = 1."),
      f("Can exponents be negative?", "Yes—results become reciprocal powers of the base."),
    ],
  }),
  calc({
    slug: "polygon-geometry-calculator",
    title: "Polygon Geometry Calculator",
    category: STATS,
    description:
      "Calculate interior angle sums and regular polygon area from sides and side length. Solve geometry problems faster.",
    formulaType: "polygonGeometry",
    inputs: [
      i("sides", "Number of Sides", 6, 3, 30, 1),
      i("sideLength", "Side Length", 10, 0.1, 1000, 0.1),
    ],
    intro:
      "Polygon geometry formulas unlock angle sums and areas for regular shapes. Enter side count and side length to compute key measurements.",
    howToUse: [
      "Enter the number of sides (n ≥ 3).",
      "Enter each side length for a regular polygon.",
      "Review interior angle sum and area.",
    ],
    faqs: [
      f("What is interior angle sum?", "(n − 2) × 180° for a simple polygon."),
      f("Does area assume a regular polygon?", "Yes—equal sides and angles are assumed."),
      f("Can I use this for irregular polygons?", "Angle sum still holds; area would need another method."),
    ],
  }),
  calc({
    slug: "circle-geometry-calculator",
    title: "Circle Geometry Calculator",
    category: STATS,
    description:
      "Compute circumference and area from radius or diameter. Cover essential circle formulas in one place.",
    formulaType: "circleGeometry",
    inputs: [
      i("radius", "Radius", 7, 0.01, 10000, 0.01),
    ],
    intro:
      "Circle measurements depend on radius through π. Calculate diameter, circumference, and area from a single radius input.",
    howToUse: [
      "Enter the circle radius.",
      "Review diameter, circumference, and area.",
    ],
    faqs: [
      f("What if I only know diameter?", "Radius is half the diameter—enter that value."),
      f("Which π value is used?", "JavaScript’s Math.PI high-precision constant."),
      f("Are units squared for area?", "Yes—area uses squared units of the radius."),
    ],
  }),
];

console.log("Education+Stats so far:", extra.length);
fs.writeFileSync("/tmp/extra_part1.json", JSON.stringify(extra));
