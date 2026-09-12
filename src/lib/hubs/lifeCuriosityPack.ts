import type { Calculator, CalculatorInput } from "@/lib/types";
import {
  UNIQUE_SEO_CONTEXT,
  uniqueHowToUse,
} from "@/lib/uniqueToolCopy";
import {
  LIFE_CALENDAR_CATEGORY,
  LIFE_FUTURE_CATEGORY,
  MONEY_CURIOSITY_CATEGORY,
  RELATIONSHIP_CURIOSITY_CATEGORY,
} from "@/lib/categoryPaths";

const input = (
  id: string,
  label: string,
  defaultValue: number,
  min: number,
  max: number,
  step: number
): CalculatorInput => ({ id, label, defaultValue, min, max, step });

function tool(spec: {
  slug: string;
  title: string;
  category: string;
  h1: string;
  description: string;
  formulaType: string;
  formulaSummary: string;
  example: string;
  faqs: { question: string; answer: string }[];
}): Calculator {
  return {
    slug: spec.slug,
    title: spec.title,
    category: spec.category,
    description: spec.description,
    formulaType: spec.formulaType,
    useCategoryPath: true,
    ready: true,
    seoTitle: spec.h1,
    seoH1: spec.h1,
    seoDescription: spec.description,
    seoKeywords: [spec.h1.toLowerCase(), spec.title.toLowerCase()],
    inputs: [input("focus", spec.title, 0, 0, 1, 1)],
    formulaSummary: spec.formulaSummary,
    realWorldExample: spec.example,
    seoContextTemplate: UNIQUE_SEO_CONTEXT,
    seoContent: {
      intro: spec.description,
      howToUse: [
        spec.description,
        ...uniqueHowToUse({
          inputLabels: [],
          formulaSummary: spec.formulaSummary,
          example: spec.example,
          domain: "life",
        }).slice(1),
      ],
      faqs: spec.faqs,
    },
  };
}

export const LIFE_CURIOSITY_TOOLS: Calculator[] = [
  tool({
    slug: "when-can-i-retire",
    title: "When Can I Retire?",
    category: LIFE_FUTURE_CATEGORY,
    h1: "When Can I Retire?",
    description:
      "Plug in your age, savings, monthly investing, and the income you actually want later. The date that comes back is the first year the 4% rule (or your own withdrawal rate) covers that income—not a promise from a brochure.",
    formulaType: "lifeRetireWhen",
    formulaSummary:
      "Grow today’s savings plus monthly deposits to a nest egg = annual spend ÷ withdrawal rate. Age at that year is the earliest retirement age in this model.",
    example:
      "Age 34, $48,000 saved, $900/mo invested at 7%, needing $42,000/year at 4% → nest egg $1.05M, around age 58 if deposits stay constant.",
    faqs: [
      {
        question: "Does this include Social Security or a pension?",
        answer:
          "No. Subtract those from the income you type if you want a smaller nest egg. If you are not sure you will get them, leave the income high.",
      },
      {
        question: "Why does a 1% return change the year so much?",
        answer:
          "Most of the pile is compound growth, not deposits. A lower return means you need more years of $900/mo to reach the same target.",
      },
    ],
  }),
  tool({
    slug: "how-long-will-my-money-last",
    title: "How Long Will My Money Last?",
    category: LIFE_FUTURE_CATEGORY,
    h1: "How Long Will My Money Last?",
    description:
      "You already have a pile of cash or investments and a yearly spend. This walks that balance forward, growing it at your assumed return and raising spend with inflation, until the account hits zero.",
    formulaType: "lifeMoneyLasts",
    formulaSummary:
      "Each year: balance = balance × (1 + return) − that year’s spend. Spend rises with inflation. Count years until the balance cannot cover the next year.",
    example:
      "$380,000, spending $32,000, 5% return, 2.5% inflation → roughly 14–16 years, not “forever.”",
    faqs: [
      {
        question: "Is this the same as the 4% rule?",
        answer:
          "No. The 4% rule asks how big the pile should be. This asks how long a pile you already have survives your actual spending.",
      },
      {
        question: "What if I still earn some money?",
        answer:
          "Put net spending here—what you take out of savings after any part-time income. Using gross lifestyle spend overstates how fast you go broke.",
      },
    ],
  }),
  tool({
    slug: "how-rich-will-i-be-at-40",
    title: "How Rich Will I Be at 40?",
    category: LIFE_FUTURE_CATEGORY,
    h1: "How Rich Will I Be at 40?",
    description:
      "A straight-line look at invested savings by your 40th birthday. It ignores promotions, kids, and house purchases on purpose so you can see the path if nothing else changes.",
    formulaType: "lifeNetWorthAt40",
    formulaSummary:
      "Future value of current invested savings plus monthly contributions until age 40 at the rate you set.",
    example:
      "Age 29, $22,000 invested, $500/mo, 7% → a bit over $130,000 at 40 if you never pause deposits.",
    faqs: [
      {
        question: "Is this net worth or just investments?",
        answer:
          "Investments only unless you add home equity or debt yourself. A house and a student loan can swing “rich” more than this chart.",
      },
      {
        question: "I am already past 40.",
        answer:
          "Use the age-50 or age-60 versions. This page is for people who still have years before 40.",
      },
    ],
  }),
  tool({
    slug: "what-will-my-net-worth-be-at-50",
    title: "What Will My Net Worth Be at 50?",
    category: LIFE_FUTURE_CATEGORY,
    h1: "What Will My Net Worth Be at 50?",
    description:
      "A checkpoint at 50: current invested savings, the monthly amount you can still send, and a return you would accept. Peak-earnings years and college bills sit in this window, so run it twice—full deposits and a gap.",
    formulaType: "lifeNetWorthAt50",
    formulaSummary:
      "Future value of invested savings plus monthly contributions from now until age 50.",
    example:
      "Age 37, $90,000 invested, $800/mo, 7% → around $400,000 at 50 if markets and deposits cooperate.",
    faqs: [
      {
        question: "Should I count my house?",
        answer:
          "Only if you would sell it or borrow against it. Occupied home equity is not spendable the way a brokerage account is.",
      },
      {
        question: "College for kids is in this window.",
        answer:
          "Lower the monthly contribution for those years in your head, or run the number twice—once with full deposits, once with a gap.",
      },
    ],
  }),
  tool({
    slug: "when-will-i-become-a-millionaire",
    title: "When Will I Become a Millionaire?",
    category: LIFE_FUTURE_CATEGORY,
    h1: "When Will I Become a Millionaire?",
    description:
      "A million dollars is a round number, not a personality. This finds the month your invested pile plus deposits hits $1,000,000 at the return you assume.",
    formulaType: "lifeMillionaireWhen",
    formulaSummary:
      "Solve for months until future value of current savings and monthly deposits equals $1,000,000.",
    example:
      "$40,000 saved, $1,200/mo, 7% → a little under 22 years. At 4% it stretches past 28.",
    faqs: [
      {
        question: "Is a million still “rich”?",
        answer:
          "In 2000 it bought more. Use the inflation page if you want today’s million in future dollars. This page is the raw $1,000,000 mark people still search for.",
      },
      {
        question: "What if I get a windfall?",
        answer:
          "Add it to current savings and rerun. A single $50,000 deposit usually moves the date more than a $50 raise in monthly investing.",
      },
    ],
  }),
  tool({
    slug: "how-much-money-do-i-need-to-retire",
    title: "How Much Money Do I Need to Retire?",
    category: LIFE_FUTURE_CATEGORY,
    h1: "How Much Money Do I Need to Retire?",
    description:
      "Start from the yearly spend you could live on, pick a withdrawal rate, and get the pile you need on day one of retirement. No age, no salary story—just the target.",
    formulaType: "lifeNestEgg",
    formulaSummary:
      "Nest egg = annual spending ÷ (withdrawal percent ÷ 100). Default 4%.",
    example:
      "$48,000/year at 4% → $1.2 million. At 3.5% the same lifestyle wants about $1.37 million.",
    faqs: [
      {
        question: "Why not always use 4%?",
        answer:
          "4% is a historical rule of thumb for a 30-year retirement in US stock/bond mixes. Longer retirements or a cautious streak usually drop toward 3–3.5%.",
      },
      {
        question: "Do I count healthcare?",
        answer:
          "Yes, in the yearly spend. Premiums after a job ends are often the line people forget.",
      },
    ],
  }),
  tool({
    slug: "what-age-can-i-stop-working",
    title: "What Age Can I Stop Working?",
    category: LIFE_FUTURE_CATEGORY,
    h1: "What Age Can I Stop Working?",
    description:
      "Same engine as “When can I retire?” with the question phrased the way people say it at dinner. The age is when invested savings can cover the income you type.",
    formulaType: "lifeRetireWhen",
    formulaSummary:
      "Grow savings and monthly deposits until they reach annual spend ÷ withdrawal rate. Report that age.",
    example:
      "Age 41, $160,000 saved, $1,400/mo, 6.5%, $50,000/year at 4% → often the early 60s if you do not raise spending.",
    faqs: [
      {
        question: "Can I stop working earlier if I move?",
        answer:
          "If the new city cuts yearly spend, drop that number and the age falls. Housing is usually the lever.",
      },
      {
        question: "I have a pension.",
        answer:
          "Subtract the pension from the income you need from investments. The remaining gap is what this calculator sizes.",
      },
    ],
  }),
  tool({
    slug: "how-much-will-i-have-saved-at-60",
    title: "How Much Will I Have Saved at 60?",
    category: LIFE_FUTURE_CATEGORY,
    h1: "How Much Will I Have Saved at 60?",
    description:
      "A checkpoint many people use because 60 is close enough to feel real and far enough to still change deposits. Investments only unless you add other assets yourself.",
    formulaType: "lifeNetWorthAt60",
    formulaSummary:
      "Future value of invested savings plus monthly contributions until age 60.",
    example:
      "Age 44, $210,000 invested, $1,000/mo, 6% → roughly $650,000–$700,000 at 60.",
    faqs: [
      {
        question: "Should I assume I get raises?",
        answer:
          "This page holds monthly deposits flat. If you invest half of every raise, the real number is higher.",
      },
      {
        question: "What about catching up after 50?",
        answer:
          "Raise the monthly field to whatever you can actually keep. Catch-up limits on retirement accounts are a legal cap, not a plan.",
      },
    ],
  }),
  tool({
    slug: "what-will-1000-a-month-become-in-20-years",
    title: "What Will $1,000/Month Become in 20 Years?",
    category: LIFE_FUTURE_CATEGORY,
    h1: "What Will $1,000 a Month Become in 20 Years?",
    description:
      "Twenty years of $1,000 a month is $240,000 of your own cash. The rest is whatever the market did. This splits those two so the “interest” is not a mystery lump.",
    formulaType: "lifeThousandAMonth",
    formulaSummary:
      "Future value of $0 starting balance plus $1,000/mo (or your amount) for 20 years at the annual rate you set.",
    example:
      "$1,000/mo for 20 years at 7% → about $520,000. You put in $240,000; growth did the rest.",
    faqs: [
      {
        question: "Can I change the $1,000?",
        answer:
          "Yes. The title is the search people type. The slider is whatever you can actually send every month.",
      },
      {
        question: "Is 7% realistic?",
        answer:
          "It is a long-run stock-heavy average, not a promise. Try 4% and 9% and live with the spread.",
      },
    ],
  }),
  tool({
    slug: "how-much-time-do-i-have-left-to-retire",
    title: "How Much Time Do I Have Left to Retire?",
    category: LIFE_FUTURE_CATEGORY,
    h1: "How Much Time Do I Have Left to Retire?",
    description:
      "You already picked a retirement age. This counts the years and months from today, then shows whether your current savings rate is on track for the nest egg that age implies.",
    formulaType: "lifeTimeLeftToRetire",
    formulaSummary:
      "Years left = target age − current age. Compare future value of savings at that date with nest egg = spend ÷ withdrawal rate.",
    example:
      "Age 46 aiming at 62, $190,000 saved, $700/mo, $40,000/year at 4% → 16 years left; the gap tells you if $700 is enough.",
    faqs: [
      {
        question: "I do not have a target age.",
        answer:
          "Use “When can I retire?” first. This page is for people who already said “I want out by 58” or “I’ll work till 67.”",
      },
      {
        question: "What if I am already past the target age?",
        answer:
          "The clock reads zero. Switch to “How long will my money last?” with what you have now.",
      },
    ],
  }),
  tool({
    slug: "how-many-days-have-i-been-alive",
    title: "How Many Days Have I Been Alive?",
    category: LIFE_CALENDAR_CATEGORY,
    h1: "How Many Days Have I Been Alive?",
    description:
      "Birthday to today, in days. No astrology, no “life path number.” Leap days are included because they happened.",
    formulaType: "lifeDaysAlive",
    formulaSummary: "Days = calendar days from birth date through today.",
    example: "Born 12 March 1993 → a bit over 12,200 days in September 2026.",
    faqs: [
      {
        question: "Does it count today?",
        answer:
          "It counts full days since your birth date. Today is not finished, so it is not added as a complete day.",
      },
      {
        question: "Why would anyone need this?",
        answer:
          "Curiosity, a tattoo, a speech, or a reminder that weeks are a bigger unit than they feel on a Thursday.",
      },
    ],
  }),
  tool({
    slug: "days-until-i-turn-30-40-50",
    title: "How Many Days Until I Turn 30, 40, or 50?",
    category: LIFE_CALENDAR_CATEGORY,
    h1: "How Many Days Until I Turn 30, 40, or 50?",
    description:
      "Pick the birthday you are walking toward. If that age already passed, it says so instead of inventing a future date.",
    formulaType: "lifeDaysUntilAge",
    formulaSummary:
      "Days from today to the birthday when you reach the target age.",
    example:
      "Turning 40 on 4 June 2028 from 8 September 2026 → a few hundred days, not “someday.”",
    faqs: [
      {
        question: "What if my birthday already happened this year?",
        answer:
          "The count uses the actual calendar date of that birthday in the correct year, including leap-day births (those move to 28 February in common years).",
      },
      {
        question: "Can I use 25 or 65?",
        answer:
          "Yes. 30/40/50 are the ages people search. The control accepts other ages.",
      },
    ],
  }),
  tool({
    slug: "weekends-left-until-80",
    title: "How Many Weekends Do I Have Left Until 80?",
    category: LIFE_CALENDAR_CATEGORY,
    h1: "How Many Weekends Do I Have Left Until 80?",
    description:
      "A rough count of Saturdays-and-Sundays between now and your 80th birthday. It is meant to make a weekend feel spendable, not to predict your health.",
    formulaType: "lifeWeekendsLeft",
    formulaSummary:
      "Weekends ≈ full weeks between today and the 80th birthday.",
    example:
      "Age 36 → on the order of 2,200 weekends before 80, if you get there. That is not a guarantee.",
    faqs: [
      {
        question: "Why 80?",
        answer:
          "It is a common planning horizon, not a medical forecast. You can read it as “weekends in the working-and-retired stretch people talk about.”",
      },
      {
        question: "I work weekends.",
        answer:
          "Then these are calendar weekends, not days off. The number is still the same; the feeling is not.",
      },
    ],
  }),
  tool({
    slug: "hours-spent-sleeping",
    title: "How Many Hours Have I Spent Sleeping?",
    category: LIFE_CALENDAR_CATEGORY,
    h1: "How Many Hours Have I Spent Sleeping?",
    description:
      "Days alive times the hours you think you actually sleep, not the eight hours a poster recommended. Night-shift and new parents should type the honest number.",
    formulaType: "lifeHoursSleeping",
    formulaSummary: "Hours asleep ≈ days alive × hours of sleep per night.",
    example:
      "12,000 days × 7 hours → 84,000 hours, about 9.6 years in bed.",
    faqs: [
      {
        question: "Infants sleep more.",
        answer:
          "This uses one average for your whole life. It is a sketch, not a sleep-lab log.",
      },
      {
        question: "Should I count naps?",
        answer:
          "If they are regular, fold them into the nightly average. Occasional Sunday naps do not move the total much.",
      },
    ],
  }),
  tool({
    slug: "how-much-of-my-life-have-i-spent-working",
    title: "How Much of My Life Have I Spent Working?",
    category: LIFE_CALENDAR_CATEGORY,
    h1: "How Much of My Life Have I Spent Working?",
    description:
      "Paid hours versus days you have been alive. Commute is separate on another page. Unpaid care work is not in this number unless you add those hours yourself.",
    formulaType: "lifeSpentWorking",
    formulaSummary:
      "Work hours = years working × weeks/year × hours/week. Share of life = work hours ÷ (days alive × 24).",
    example:
      "12 years × 48 weeks × 42 hours on a 34-year-old life → work is a visible slice, not “my whole life,” unless the hours are brutal.",
    faqs: [
      {
        question: "I had gaps between jobs.",
        answer:
          "Use years you were actually employed, not age minus 18. Gaps are the point of typing it yourself.",
      },
      {
        question: "Salaried people do not work 40.",
        answer:
          "Type 50 or 55 if that is the truth. The default 40 is a habit, not a compliment.",
      },
    ],
  }),
  tool({
    slug: "phone-time-in-a-lifetime",
    title: "How Much Time Do I Spend on My Phone in a Lifetime?",
    category: LIFE_CALENDAR_CATEGORY,
    h1: "How Much Time Do I Spend on My Phone in a Lifetime?",
    description:
      "Screen time for the years you have already lived, plus a projection if the daily habit stays put until a life expectancy you choose. Your phone’s weekly report is a better input than a guess.",
    formulaType: "lifePhoneTime",
    formulaSummary:
      "Past hours = days alive × hours/day. Future hours = days left × the same daily habit.",
    example:
      "3 hours/day from age 16 to 35 is already more than a full-time year. Keeping it to 80 adds several more years of glass.",
    faqs: [
      {
        question: "I did not have a smartphone as a kid.",
        answer:
          "Lower days of phone use, or start the habit at the age you got one. Do not count 1998 as Instagram.",
      },
      {
        question: "Is this supposed to shame me?",
        answer:
          "No. It is a unit conversion. If the number bothers you, the lever is daily hours, not the calculator.",
      },
    ],
  }),
  tool({
    slug: "days-spent-commuting",
    title: "How Many Days Do I Spend Commuting?",
    category: LIFE_CALENDAR_CATEGORY,
    h1: "How Many Days Do I Spend Commuting?",
    description:
      "Workdays times years on that commute, plus a simple hour total. Remote days should come out of the workweek you type.",
    formulaType: "lifeCommuteDays",
    formulaSummary:
      "Commute days = years × workdays per week × weeks per year. Hours = days × minutes each way × 2 ÷ 60.",
    example:
      "8 years, 5 days, 48 weeks, 35 minutes each way → about 1,920 days and well over 2,000 hours in transit.",
    faqs: [
      {
        question: "I WFH two days a week.",
        answer:
          "Set workdays per week to 3. That is the whole difference between this page and a guilt trip.",
      },
      {
        question: "Does a 90-minute train count as one day?",
        answer:
          "Yes for the day count. The hour total is where a long commute shows up.",
      },
    ],
  }),
  tool({
    slug: "years-spent-working",
    title: "How Many Years Do I Spend Working?",
    category: LIFE_CALENDAR_CATEGORY,
    h1: "How Many Years Do I Spend Working?",
    description:
      "Career start to an end age you choose—retirement, a planned exit, or “I have no idea, try 67.” It is elapsed years, not vesting years.",
    formulaType: "lifeYearsWorking",
    formulaSummary: "Years working = end age − start age, floored at zero.",
    example:
      "Started at 22, planning to stop at 64 → 42 years on a badge, before anyone mentions overtime.",
    faqs: [
      {
        question: "I changed careers at 31.",
        answer:
          "This counts calendar years in paid work, not years in one industry. Two careers still add.",
      },
      {
        question: "School and internships?",
        answer:
          "Start the clock when pay became the point. Unpaid internships are optional—include them only if you want that story.",
      },
    ],
  }),
  tool({
    slug: "how-much-of-my-life-is-left",
    title: "How Much of My Life Is Left?",
    category: LIFE_CALENDAR_CATEGORY,
    h1: "How Much of My Life Is Left?",
    description:
      "Age versus a life-expectancy number you type. Averages hide illness and luck. Use a table from your country’s stats office if you want a less made-up expectancy.",
    formulaType: "lifeYearsLeft",
    formulaSummary:
      "Years left = max(0, expectancy − current age). Days left ≈ years × 365.25.",
    example:
      "Age 39, expectancy 82 → about 43 years, ~15,700 days. That is a planning horizon, not a booking.",
    faqs: [
      {
        question: "Where do I get expectancy?",
        answer:
          "National period life tables are public. Smokers, certain jobs, and family history move the number; this page will not guess that for you.",
      },
      {
        question: "This feels grim.",
        answer:
          "It is arithmetic. Close the tab if you came here after a diagnosis—talk to a clinician, not a website.",
      },
    ],
  }),
  tool({
    slug: "percentage-of-life-lived",
    title: "What Percentage of My Life Have I Lived?",
    category: LIFE_CALENDAR_CATEGORY,
    h1: "What Percentage of My Life Have I Lived?",
    description:
      "Current age divided by the expectancy you assume. Halfway is not a moral event. It is just 50%.",
    formulaType: "lifePercentLived",
    formulaSummary: "Percent lived = current age ÷ expectancy × 100.",
    example: "Age 36 / 84 → 43%. Age 36 / 72 → 50%. The denominator does the work.",
    faqs: [
      {
        question: "Should I use healthy years or total years?",
        answer:
          "Total years is what this page does. “Healthy life expectancy” is a different statistic and usually shorter.",
      },
      {
        question: "I am older than the expectancy I typed.",
        answer:
          "The percent caps at 100. Raise expectancy or ignore the bar—you already beat the average you entered.",
      },
    ],
  }),
  tool({
    slug: "if-i-invested-100-every-month",
    title: "What Would I Be Worth If I Invested $100 Every Month?",
    category: MONEY_CURIOSITY_CATEGORY,
    h1: "What Would I Be Worth If I Invested $100 Every Month?",
    description:
      "$100 is small enough that people dismiss it. Twenty or thirty years later it is not small. This is the same compounding math as the $1,000 page with a humbler default.",
    formulaType: "lifeHundredAMonth",
    formulaSummary:
      "Future value of $100/mo (or your amount) for the years and rate you set, starting from whatever you already have.",
    example:
      "$100/mo for 30 years at 7% with $0 to start → about $114,000. You deposited $36,000.",
    faqs: [
      {
        question: "Fees eat $100 accounts.",
        answer:
          "Use a low-fee fund or you are donating the compounding. This page assumes the rate you type is after fees.",
      },
      {
        question: "Can I do $25?",
        answer:
          "Yes. The search is $100 because that is the phrase. The math does not care.",
      },
    ],
  }),
  tool({
    slug: "money-worth-in-10-years",
    title: "What Would My Money Be Worth in 10 Years?",
    category: MONEY_CURIOSITY_CATEGORY,
    h1: "What Would My Money Be Worth in 10 Years?",
    description:
      "A ten-year future value for money you already have, with an optional monthly add. Ten years is long enough for compounding to show and short enough to remember the assumption.",
    formulaType: "lifeMoneyInTenYears",
    formulaSummary:
      "Future value over 10 years of a starting balance plus monthly deposits at your rate.",
    example:
      "$15,000 now, $200/mo, 6% → a bit over $50,000 in ten years.",
    faqs: [
      {
        question: "What about inflation?",
        answer:
          "This page is nominal dollars. Pair it with the inflation tool if you want today’s purchasing power.",
      },
      {
        question: "Cash in a checking account?",
        answer:
          "Set the rate near 0–4% depending on the account. Do not use a stock average for money you will spend next spring.",
      },
    ],
  }),
  tool({
    slug: "money-lost-to-inflation",
    title: "How Much Money Am I Losing to Inflation?",
    category: MONEY_CURIOSITY_CATEGORY,
    h1: "How Much Money Am I Losing to Inflation?",
    description:
      "What a pile of cash buys after N years if prices rise at the rate you type. It is not “lost” from the bank. It is lost at the grocery store.",
    formulaType: "lifeInflationLoss",
    formulaSummary:
      "Real value = amount ÷ (1 + inflation)^years. Lost purchasing power = amount − real value.",
    example:
      "$20,000 left in a 0% account at 3% inflation for 10 years still says $20,000. It buys about $14,900 of today’s goods.",
    faqs: [
      {
        question: "Which inflation rate?",
        answer:
          "Long-run consumer inflation in many rich countries has hovered near 2–3%. Use 6–8% only if you are stress-testing a bad decade.",
      },
      {
        question: "My savings account pays 4%.",
        answer:
          "Then the real loss is smaller. This page assumes the cash does not earn. Subtract your yield from inflation in your head for a rough real rate.",
      },
    ],
  }),
  tool({
    slug: "lifestyle-cost-per-year",
    title: "How Much Does My Lifestyle Cost Me Per Year?",
    category: MONEY_CURIOSITY_CATEGORY,
    h1: "How Much Does My Lifestyle Cost Me Per Year?",
    description:
      "Monthly extras plus the quiet annual bills (insurance, trips, subscriptions you forgot). The yearly total is what a raise has to beat after tax.",
    formulaType: "lifeLifestyleYear",
    formulaSummary:
      "Yearly lifestyle = monthly discretionary × 12 + annual bills you list.",
    example:
      "$1,100/mo eating and streaming + $4,800 travel and gifts → $18,000 a year, before rent.",
    faqs: [
      {
        question: "Should rent be in here?",
        answer:
          "Only if you are asking “what does my whole life cost?” Housing belongs in a budget, not always in a “lifestyle” curiosity number. This page leaves it optional.",
      },
      {
        question: "I share costs with a partner.",
        answer:
          "Type your share. Combined lifestyle is a different conversation.",
      },
    ],
  }),
  tool({
    slug: "how-much-does-my-car-really-cost",
    title: "How Much Does My Car Really Cost Me?",
    category: MONEY_CURIOSITY_CATEGORY,
    h1: "How Much Does My Car Really Cost Me?",
    description:
      "Payment is the loud number. Insurance, fuel, maintenance, parking, and a simple depreciation guess are the rest. Add them and you get a monthly cost you can compare to a transit pass.",
    formulaType: "lifeCarReallyCosts",
    formulaSummary:
      "Monthly all-in = payment + insurance/12 + fuel + maintenance/12 + parking + depreciation/12.",
    example:
      "$420 payment, $1,800 insurance, $160 fuel, $900 upkeep, $80 parking, $2,400/year value drop → about $900/mo, not $420.",
    faqs: [
      {
        question: "The car is paid off.",
        answer:
          "Set payment to 0. Depreciation and insurance usually remain. That is still a real monthly cost.",
      },
      {
        question: "How do I estimate depreciation?",
        answer:
          "Used-car listings a year apart for your model are better than a rule of thumb. If you have nothing, 10–15% of value per year is a blunt start.",
      },
    ],
  }),
  tool({
    slug: "coffee-spend-in-a-lifetime",
    title: "How Much Do I Spend on Coffee in a Lifetime?",
    category: MONEY_CURIOSITY_CATEGORY,
    h1: "How Much Do I Spend on Coffee in a Lifetime?",
    description:
      "Drinks per week times price, stretched across the years you expect to keep the habit. It is not an argument for quitting coffee. It is the receipt.",
    formulaType: "lifeCoffeeLifetime",
    formulaSummary:
      "Lifetime spend = drinks/week × price × 52 × years you keep buying them.",
    example:
      "5 drinks, $5.50, 40 years → about $57,000 before anyone mentions oat milk.",
    faqs: [
      {
        question: "I brew at home.",
        answer:
          "Use the cost per mug of beans and filters. $0.60 × 10/week is a different story than $6 lattes.",
      },
      {
        question: "Will investing that money make me rich?",
        answer:
          "Maybe. Run the $10/day or $100/month pages with the same yearly total. Skipping coffee is not the only way to find $100.",
      },
    ],
  }),
  tool({
    slug: "if-i-stop-spending-10-a-day",
    title: "What Happens If I Stop Spending $10 a Day?",
    category: MONEY_CURIOSITY_CATEGORY,
    h1: "What Happens If I Stop Spending $10 a Day?",
    description:
      "Ten dollars is a takeout lunch or two delivery fees. Invested on a boring schedule it stops being a joke. This assumes you actually send the money somewhere that earns the rate you type.",
    formulaType: "lifeStopTenADay",
    formulaSummary:
      "$10/day ≈ $304/month. Future value of that monthly amount for the years and rate you set.",
    example:
      "Redirect $10/day for 20 years at 7% → on the order of $160,000. You “saved” about $73,000 of your own cash.",
    faqs: [
      {
        question: "I will not invest it. I will just not spend it.",
        answer:
          "Set the return to 0. You still keep the cash. You just do not get the compounding story.",
      },
      {
        question: "Why $10?",
        answer:
          "It is the sentence people type. Change it if your leak is $4 or $18.",
      },
    ],
  }),
  tool({
    slug: "if-i-started-investing-10-years-ago",
    title: "How Much Would I Have If I Started Investing 10 Years Ago?",
    category: MONEY_CURIOSITY_CATEGORY,
    h1: "How Much Would I Have If I Started Investing 10 Years Ago?",
    description:
      "A counterfactual, not a time machine. It shows the pile you would have if the monthly amount and average return you type had run for the last decade. Real markets were lumpier.",
    formulaType: "lifeStartedTenYearsAgo",
    formulaSummary:
      "Future value of 10 years of monthly deposits at your assumed average return, optional lump sum at the start.",
    example:
      "$250/mo for 10 years at 8% with $0 down → about $45,000. Beating yourself up does not add a year.",
    faqs: [
      {
        question: "I did start, just later.",
        answer:
          "This page is the missed-path version. Your real account is the one that exists. Use a 10-year-forward page for the next decade.",
      },
      {
        question: "2016–2026 was a strong stretch for US stocks.",
        answer:
          "Then 8–10% may even be low for that window. The next ten years can be worse. Do not treat the past decade as a promise.",
      },
    ],
  }),
  tool({
    slug: "how-long-to-save-first-100k",
    title: "How Long Until I Save My First $100K?",
    category: MONEY_CURIOSITY_CATEGORY,
    h1: "How Long Until I Save My First $100K?",
    description:
      "The first hundred thousand is mostly deposits. After that, growth does more of the lifting. This solves for the month you cross $100,000.",
    formulaType: "lifeFirst100k",
    formulaSummary:
      "Months until current savings plus monthly deposits at your rate reach $100,000.",
    example:
      "$8,000 saved, $600/mo, 5% → a bit over 11 years. At $1,200/mo it compresses under 7.",
    faqs: [
      {
        question: "Should I include my emergency fund?",
        answer:
          "Only if you would count it toward the $100k milestone. Many people keep the emergency fund separate and chase $100k in investments.",
      },
      {
        question: "I already have $100k.",
        answer:
          "The answer is zero months. Use a millionaire page or a net-worth-at-age page for the next checkpoint.",
      },
    ],
  }),
  tool({
    slug: "what-salary-to-become-a-millionaire",
    title: "What Salary Do I Need to Become a Millionaire?",
    category: MONEY_CURIOSITY_CATEGORY,
    h1: "What Salary Do I Need to Become a Millionaire?",
    description:
      "Backs into the yearly income that supports a savings rate big enough to hit $1,000,000 in the years you have left, given what you already invested. It assumes you can save a percent of salary, not that you spend nothing.",
    formulaType: "lifeSalaryForMillion",
    formulaSummary:
      "Required monthly deposit comes from the $1M gap. Salary ≈ monthly × 12 ÷ savings rate.",
    example:
      "15 years, $40,000 already invested, 7%, saving 20% of gross → salary in the low six figures, not a lottery ticket.",
    faqs: [
      {
        question: "Raises and job hops?",
        answer:
          "This holds salary flat. If you save more as you earn more, you can hit the mark on a lower starting salary.",
      },
      {
        question: "Employer match?",
        answer:
          "Treat the match as extra monthly investing, which lowers the salary this page asks for.",
      },
    ],
  }),
  tool({
    slug: "how-long-have-i-known-my-partner",
    title: "How Long Have I Known My Partner?",
    category: RELATIONSHIP_CURIOSITY_CATEGORY,
    h1: "How Long Have I Known My Partner?",
    description:
      "The day you met—not the day you made it official. Type that date and get years, months, and days. Arguments about “when it counted” are not the calculator’s job.",
    formulaType: "lifeKnownPartner",
    formulaSummary: "Elapsed calendar time from the date you met through today.",
    example:
      "Met 18 October 2019 → in September 2026 that is almost seven years and a few hundred extra days.",
    faqs: [
      {
        question: "We met online months before in person.",
        answer:
          "Pick the date you tell the story with. The math will accept either. People usually pick the first real conversation or the first meeting.",
      },
      {
        question: "We broke up in the middle.",
        answer:
          "This is continuous time from one date. It does not subtract the gap. If you need a gap, you are writing a different history.",
      },
    ],
  }),
  tool({
    slug: "days-we-have-been-together",
    title: "How Many Days Have We Been Together?",
    category: RELATIONSHIP_CURIOSITY_CATEGORY,
    h1: "How Many Days Have We Been Together?",
    description:
      "Anniversary date to today. Useful for a card, a fight about “how long has it been,” or a 500-day dinner you would otherwise miss.",
    formulaType: "lifeDaysTogether",
    formulaSummary: "Days from the start-of-relationship date through today.",
    example: "Started 2 February 2024 → about 580 days by early September 2026.",
    faqs: [
      {
        question: "Is this different from “how long have I known them?”",
        answer:
          "Yes. Known can be longer. Together starts when you both treat it as a relationship.",
      },
      {
        question: "Time zones / we live apart.",
        answer:
          "The count is calendar days, not hours on a call. Distance does not add or subtract days here.",
      },
    ],
  }),
  tool({
    slug: "percentage-of-life-together",
    title: "What Percentage of My Life Have We Been Together?",
    category: RELATIONSHIP_CURIOSITY_CATEGORY,
    h1: "What Percentage of My Life Have We Been Together?",
    description:
      "Days together divided by days you have been alive. High school sweethearts get a bigger percent than people who met at 34. Neither is a score.",
    formulaType: "lifePercentTogether",
    formulaSummary:
      "Percent = days since you got together ÷ days since your birth × 100.",
    example:
      "Together 2,200 days, alive 12,000 days → about 18% of your life so far.",
    faqs: [
      {
        question: "Should I use their age too?",
        answer:
          "This page is your life. Their percentage is a second run with their birthday.",
      },
      {
        question: "We have been together longer than I have been an adult.",
        answer:
          "That is common if you started dating young. The percent will look large. It is still just a ratio.",
      },
    ],
  }),
  tool({
    slug: "days-until-1000th-day-together",
    title: "How Long Until Our 1,000th Day Together?",
    category: RELATIONSHIP_CURIOSITY_CATEGORY,
    h1: "How Long Until Our 1,000th Day Together?",
    description:
      "1,000 days is about 2 years and 9 months. If you already passed it, the page says how long ago instead of inventing a future party.",
    formulaType: "lifeThousandthDay",
    formulaSummary:
      "Days remaining = 1,000 − days together. Negative means you are past it.",
    example:
      "Together 740 days → 260 days until 1,000. Together 1,100 days → you are 100 days past it.",
    faqs: [
      {
        question: "Why 1,000?",
        answer:
          "It is a round number people celebrate when a yearly anniversary feels too formal. You can treat 500 or 2,000 the same way in your head.",
      },
      {
        question: "Leap days.",
        answer:
          "They are included in the day count. A 1,000-day mark can land on a leap day; that is just the calendar.",
      },
    ],
  }),
  tool({
    slug: "memories-we-have-created-together",
    title: "How Many Memories Have We Probably Created Together?",
    category: RELATIONSHIP_CURIOSITY_CATEGORY,
    h1: "How Many Memories Have We Probably Created Together?",
    description:
      "Not photos, not a scientific count. You pick how many shared “events” you think happen in a typical week—meals that were not leftovers, trips, fights you still tell, concerts. The page multiplies that by time together.",
    formulaType: "lifeMemoriesGuess",
    formulaSummary:
      "Guess = days together × (shared events per week ÷ 7). It is a sketch.",
    example:
      "800 days × 4 events/week → about 460 “memories.” Raise the weekly number if you live in each other’s pockets.",
    faqs: [
      {
        question: "What counts as a memory?",
        answer:
          "Anything you would still mention in a year. Do not count every text. Do count the Tuesday you both remember.",
      },
      {
        question: "Long-distance.",
        answer:
          "Use a smaller weekly number. Visits are dense; the weeks between them are not.",
      },
    ],
  }),
];

export const LIFE_CURIOSITY_SLUGS = new Set(
  LIFE_CURIOSITY_TOOLS.map((t) => t.slug)
);

export const LIFE_CURIOSITY_FORMULA_TYPES = new Set(
  LIFE_CURIOSITY_TOOLS.map((t) => t.formulaType)
);

export function getLifeCuriosityToolBySlug(
  slug: string
): Calculator | undefined {
  return LIFE_CURIOSITY_TOOLS.find((t) => t.slug === slug);
}

export function isLifeCuriosityFormula(formulaType: string): boolean {
  return LIFE_CURIOSITY_FORMULA_TYPES.has(formulaType);
}
