/**
 * Health, Fitness & Wellness hub pack — 48 interactive calculators.
 * Routes: /tools/health-fitness-and-wellness/{slug}
 */

import type { Calculator, CalculatorInput, LongTailModifier } from "@/lib/types";
import { HEALTH_DISPLAY_CATEGORY } from "@/lib/categoryPaths";

export { HEALTH_DISPLAY_CATEGORY };

const input = (
  id: string,
  label: string,
  defaultValue: number,
  min: number,
  max: number,
  step: number
): CalculatorInput => ({ id, label, defaultValue, min, max, step });

function modifier(
  slug: string,
  focusKeyword: string,
  explanation: string,
  extras?: Partial<LongTailModifier>
): LongTailModifier {
  return {
    slug,
    focusKeyword,
    explanation,
    route: true,
    benefit: extras?.benefit ?? "Instant estimate",
    faqs: extras?.faqs,
  };
}

function buildHealthTool(spec: {
  slug: string;
  title: string;
  seoH1: string;
  seoDescription: string;
  focusKeyword: string;
  formulaType: string;
  description: string;
  formulaSummary: string;
  realWorldExample: string;
  inputs: CalculatorInput[];
}): Calculator {
  const metric = spec.title.replace(/ Calculator$/i, "");
  return {
    slug: spec.slug,
    title: spec.title,
    category: HEALTH_DISPLAY_CATEGORY,
    description: spec.description,
    formulaType: spec.formulaType,
    useCategoryPath: true,
    ready: true,
    seoTitle: spec.seoH1,
    seoH1: spec.seoH1,
    seoDescription: spec.seoDescription,
    seoKeywords: [spec.focusKeyword, spec.title, "free online", "health calculator"],
    inputs: spec.inputs,
    formulaSummary: spec.formulaSummary,
    realWorldExample: spec.realWorldExample,
    seoContextTemplate:
      'Looking for "{{focusKeyword}}"? {{formulaSummary}} Example: {{example}} Free {{title}} for {{year}}—instant, no sign up. Estimates only, not medical advice.',
    explanationTemplate:
      '{{variantExplanation}} Free {{title}} for "{{focusKeyword}}" ({{year}}).',
    longTailModifiers: [
      modifier(
        "free-online",
        spec.focusKeyword,
        spec.description,
        {
          benefit: "Instant estimate",
          faqs: [
            {
              question: `How do I use the ${spec.title}?`,
              answer: spec.formulaSummary,
            },
            {
              question: `Is this ${metric.toLowerCase()} free?`,
              answer:
                "Yes. Results run instantly in your browser with no sign up. Outputs are planning estimates—not medical, legal, or financial advice.",
            },
          ],
        }
      ),
    ],
    seoContent: {
      intro: `${spec.description} Estimates only—not a diagnosis or prescription.`,
      howToUse: [
        "Adjust the sliders or enter values for your situation.",
        "Read the primary result and supporting metrics.",
        "Use the figures for planning; confirm health decisions with a qualified professional.",
      ],
      faqs: [
        {
          question: `How is ${metric.toLowerCase()} calculated?`,
          answer: spec.formulaSummary,
        },
        {
          question: `What is a real-world example?`,
          answer: spec.realWorldExample,
        },
        {
          question: "Is this tool medical advice?",
          answer:
            "No. These calculators provide general estimates for education and planning. They do not replace advice from a doctor, dietitian, or other licensed professional.",
        },
      ],
    },
  };
}

export const HEALTH_TOOLS: Calculator[] = [
buildHealthTool({
  slug: "bmi-calculator-for-adults",
  title: "BMI Calculator",
  seoH1: "Free BMI Calculator for Adult Men and Women",
  seoDescription: "Calculate adult BMI from height and weight in seconds. See WHO category, healthy range, and next steps. Free, instant, no sign up—not a medical diagnosis.",
  focusKeyword: "bmi calculator for adult men and women",
  formulaType: "healthBmi",
  description: "Calculate adult BMI from height and weight with WHO category bands.",
  formulaSummary: "BMI = (weight lbs × 703) ÷ height in².",
  realWorldExample: "170 lb at 5'9\" (69 in) → BMI ≈ 25.1 (overweight band).",
  inputs: [
    input("weightLbs", "Weight (lbs)", 170, 80, 400, 1),
    input("heightIn", "Height (in)", 69, 48, 84, 0.5)
  ],
}),
buildHealthTool({
  slug: "childrens-bmi-calculator-by-age",
  title: "Children's BMI Calculator",
  seoH1: "Children's BMI Calculator by Age and Sex",
  seoDescription: "Find your child's BMI percentile from age, sex, height, and weight using CDC-style growth bands. Free kids BMI check in seconds—screening only, not a diagnosis.",
  focusKeyword: "bmi calculator for children by age and sex",
  formulaType: "healthChildrenBmi",
  description: "Estimate a child's BMI percentile from age, sex, height, and weight.",
  formulaSummary: "BMI compared to age/sex growth curves (simplified percentile model).",
  realWorldExample: "Age 10, 95 lb, 54 in → BMI ~20 with an estimated percentile band.",
  inputs: [
    input("ageYears", "Age (years)", 10, 2, 17, 1),
    input("sex", "Sex (0=F, 1=M)", 0, 0, 1, 1),
    input("weightLbs", "Weight (lbs)", 95, 30, 250, 1),
    input("heightIn", "Height (in)", 54, 30, 78, 0.5)
  ],
}),
buildHealthTool({
  slug: "body-fat-percentage-calculator-navy-method",
  title: "Body Fat Percentage Calculator",
  seoH1: "Body Fat Percentage Calculator (Navy Tape Method)",
  seoDescription: "Estimate body fat % with a tape measure using the U.S. Navy method. Enter neck, waist, hips, and height. Free, private, instant—not a DEXA or medical test.",
  focusKeyword: "body fat percentage calculator navy method tape measure",
  formulaType: "healthBodyFatNavy",
  description: "Estimate body fat % with neck, waist, hip, and height tape measurements.",
  formulaSummary: "U.S. Navy circumference formula from neck, waist, hips, and height.",
  realWorldExample: "5'10\" male, 15 in neck, 34 in waist → ~18% body fat (estimate).",
  inputs: [
    input("sex", "Sex (0=F, 1=M)", 1, 0, 1, 1),
    input("heightIn", "Height (in)", 70, 48, 84, 0.5),
    input("neckIn", "Neck (in)", 15, 10, 25, 0.1),
    input("waistIn", "Waist (in)", 34, 20, 60, 0.1),
    input("hipIn", "Hip (in, women)", 0, 0, 60, 0.1)
  ],
}),
buildHealthTool({
  slug: "army-body-fat-calculator",
  title: "Army Body Fat Calculator",
  seoH1: "Army Body Fat Calculator — Tape Test Standards",
  seoDescription: "Check Army-style body fat from height, weight, neck, and waist measurements. Compare to tape-test screening limits. Free, instant, unofficial estimate.",
  focusKeyword: "army body fat calculator tape test standards",
  formulaType: "healthArmyBodyFat",
  description: "Check body fat against approximate Army tape-test screening limits.",
  formulaSummary: "Navy-method body fat estimate compared to age/sex Army maximums.",
  realWorldExample: "Age 24 male at 17% body fat is below a ~22% screening ceiling (unofficial).",
  inputs: [
    input("sex", "Sex (0=F, 1=M)", 1, 0, 1, 1),
    input("ageYears", "Age (years)", 24, 17, 50, 1),
    input("heightIn", "Height (in)", 70, 48, 84, 0.5),
    input("weightLbs", "Weight (lbs)", 180, 100, 300, 1),
    input("neckIn", "Neck (in)", 16, 10, 25, 0.1),
    input("waistIn", "Waist (in)", 32, 20, 60, 0.1),
    input("hipIn", "Hip (in, women)", 0, 0, 60, 0.1)
  ],
}),
buildHealthTool({
  slug: "ideal-weight-calculator-by-height",
  title: "Ideal Weight Calculator",
  seoH1: "Ideal Weight Calculator by Height and Gender",
  seoDescription: "Estimate a healthy weight range from height and sex using Hamwi, Devine, Robinson, and Miller formulas. Free comparison—planning figures, not a prescription.",
  focusKeyword: "ideal weight calculator by height and gender",
  formulaType: "healthIdealWeight",
  description: "Compare Hamwi, Devine, Robinson, and Miller ideal weight formulas.",
  formulaSummary: "Four clinical height-based ideal weight formulas averaged for a range.",
  realWorldExample: "5'8\" male → Hamwi ~154 lb, Devine ~160 lb, average near 156 lb.",
  inputs: [
    input("sex", "Sex (0=F, 1=M)", 1, 0, 1, 1),
    input("heightIn", "Height (in)", 68, 48, 84, 0.5)
  ],
}),
buildHealthTool({
  slug: "lean-body-mass-calculator",
  title: "Lean Body Mass Calculator",
  seoH1: "Lean Body Mass Calculator from Weight and Body Fat",
  seoDescription: "Calculate lean body mass and fat mass from scale weight and body-fat %. Track muscle-focused progress instantly. Free estimate only—not a DEXA body scan.",
  focusKeyword: "lean body mass calculator from weight and body fat",
  formulaType: "healthLeanBodyMass",
  description: "Split scale weight into lean mass and fat mass from body-fat %.",
  formulaSummary: "LBM = weight × (1 − body fat % ÷ 100).",
  realWorldExample: "180 lb at 20% fat → 144 lb lean mass, 36 lb fat.",
  inputs: [
    input("weightLbs", "Weight (lbs)", 180, 80, 350, 1),
    input("bodyFatPct", "Body fat (%)", 20, 3, 60, 0.5)
  ],
}),
buildHealthTool({
  slug: "waist-to-hip-ratio-calculator",
  title: "Waist-to-Hip Ratio Calculator",
  seoH1: "Waist-to-Hip Ratio Calculator for Men and Women",
  seoDescription: "Measure waist-to-hip ratio and see common health-risk bands for men and women. Free WHR check in seconds—a screening aid only, not a clinical diagnosis.",
  focusKeyword: "waist to hip ratio calculator for men and women",
  formulaType: "healthWaistHipRatio",
  description: "Measure waist-to-hip ratio and common health-risk screening bands.",
  formulaSummary: "WHR = waist ÷ hip; risk bands differ for men and women.",
  realWorldExample: "32 in waist, 38 in hips → WHR 0.84 (moderate risk band for women).",
  inputs: [
    input("sex", "Sex (0=F, 1=M)", 0, 0, 1, 1),
    input("waistIn", "Waist (in)", 32, 20, 60, 0.1),
    input("hipIn", "Hip (in)", 38, 25, 60, 0.1)
  ],
}),
buildHealthTool({
  slug: "waist-to-height-ratio-calculator",
  title: "Waist-to-Height Ratio Calculator",
  seoH1: "Waist-to-Height Ratio Calculator for Health Risk",
  seoDescription: "Divide waist by height to flag central fat risk. A simple WHtR check used in public-health screening. Free, instant—not a substitute for medical advice.",
  focusKeyword: "waist to height ratio calculator health risk",
  formulaType: "healthWaistHeightRatio",
  description: "Flag central adiposity risk with a simple waist ÷ height check.",
  formulaSummary: "WHtR = waist ÷ height; values above 0.50 raise concern.",
  realWorldExample: "34 in waist, 68 in height → WHtR 0.50 (upper healthy limit).",
  inputs: [
    input("waistIn", "Waist (in)", 34, 20, 60, 0.1),
    input("heightIn", "Height (in)", 68, 48, 84, 0.5)
  ],
}),
buildHealthTool({
  slug: "ffmi-calculator-fat-free-mass-index",
  title: "FFMI Calculator",
  seoH1: "FFMI Calculator — Fat-Free Mass Index for Lifters",
  seoDescription: "Calculate fat-free mass index from height, weight, and body fat. Compare lean mass to typical natural-lifter ranges. Free FFMI tool—not a steroid test.",
  focusKeyword: "ffmi calculator fat free mass index natural",
  formulaType: "healthFfmi",
  description: "Calculate fat-free mass index and normalized FFMI for lifters.",
  formulaSummary: "FFMI = lean mass kg ÷ height m²; normalized adjusts for height.",
  realWorldExample: "180 lb, 12% fat, 5'10\" → FFMI near 22 (strong natural range).",
  inputs: [
    input("heightIn", "Height (in)", 70, 48, 84, 0.5),
    input("weightLbs", "Weight (lbs)", 180, 100, 350, 1),
    input("bodyFatPct", "Body fat (%)", 12, 3, 40, 0.5)
  ],
}),
buildHealthTool({
  slug: "body-roundness-index-calculator",
  title: "Body Roundness Index Calculator",
  seoH1: "Body Roundness Index (BRI) Calculator from Waist",
  seoDescription: "Compute Body Roundness Index from height and waist circumference. A modern body-shape metric beyond BMI. Free BRI calculator—research-style estimate only.",
  focusKeyword: "body roundness index calculator bri from waist",
  formulaType: "healthBri",
  description: "Compute Body Roundness Index from height and waist circumference.",
  formulaSummary: "BRI uses waist and height to estimate body roundness beyond BMI.",
  realWorldExample: "5'9\" with 36 in waist → BRI in moderate adiposity band.",
  inputs: [
    input("heightIn", "Height (in)", 69, 48, 84, 0.5),
    input("waistIn", "Waist (in)", 36, 20, 60, 0.1)
  ],
}),
buildHealthTool({
  slug: "bmr-calculator-mifflin-st-jeor",
  title: "BMR Calculator",
  seoH1: "BMR Calculator (Mifflin–St Jeor) by Age and Sex",
  seoDescription: "Estimate basal metabolic rate with Mifflin–St Jeor from age, sex, height, and weight. See calories at rest. Free, no sign up—not medical nutrition advice.",
  focusKeyword: "bmr calculator mifflin st jeor by age and sex",
  formulaType: "healthBmr",
  description: "Estimate basal metabolic rate (calories at rest) with Mifflin–St Jeor.",
  formulaSummary: "Men: 10×kg + 6.25×cm − 5×age + 5; women subtract 161.",
  realWorldExample: "30-year-old 180 lb, 5'10\" male → BMR ≈ 1,780 kcal/day.",
  inputs: [
    input("sex", "Sex (0=F, 1=M)", 1, 0, 1, 1),
    input("ageYears", "Age (years)", 30, 15, 90, 1),
    input("weightLbs", "Weight (lbs)", 180, 80, 350, 1),
    input("heightIn", "Height (in)", 70, 48, 84, 0.5)
  ],
}),
buildHealthTool({
  slug: "tdee-calculator-weight-loss",
  title: "TDEE Calculator",
  seoH1: "TDEE Calculator for Weight Loss and Maintenance",
  seoDescription: "Find total daily energy expenditure from BMR and activity. Set maintenance, cut, or surplus calories. Free TDEE math—planning estimates, not a meal plan.",
  focusKeyword: "tdee calculator for weight loss and maintenance",
  formulaType: "healthTdee",
  description: "Find total daily energy expenditure from BMR and activity level.",
  formulaSummary: "TDEE = BMR × activity factor (1.2 sedentary → 1.9 very active).",
  realWorldExample: "BMR 1,780 × 1.55 activity → ~2,759 kcal maintenance.",
  inputs: [
    input("sex", "Sex (0=F, 1=M)", 1, 0, 1, 1),
    input("ageYears", "Age (years)", 30, 15, 90, 1),
    input("weightLbs", "Weight (lbs)", 180, 80, 350, 1),
    input("heightIn", "Height (in)", 70, 48, 84, 0.5),
    input("activityMultiplier", "Activity (1.2–1.9)", 1.55, 1.2, 1.9, 0.05)
  ],
}),
buildHealthTool({
  slug: "calorie-deficit-calculator",
  title: "Calorie Deficit Calculator",
  seoH1: "Calorie Deficit Calculator to Lose Weight Per Week",
  seoDescription: "Turn a weekly fat-loss goal into a daily calorie deficit and target intake from your TDEE. Free, instant math—safe-rate planning, not a diet prescription.",
  focusKeyword: "calorie deficit calculator to lose weight per week",
  formulaType: "healthCalorieDeficit",
  description: "Turn a weekly fat-loss goal into a daily calorie deficit and target.",
  formulaSummary: "Daily deficit = (weekly lb loss × 3,500) ÷ 7; target = TDEE − deficit.",
  realWorldExample: "TDEE 2,500, lose 1 lb/week → ~2,000 kcal/day target.",
  inputs: [
    input("tdee", "TDEE (kcal/day)", 2500, 1200, 5000, 50),
    input("weeklyLossLbs", "Goal loss (lb/week)", 1, 0.25, 3, 0.25)
  ],
}),
buildHealthTool({
  slug: "weight-loss-timeline-calculator",
  title: "Weight Loss Timeline Calculator",
  seoH1: "Weight Loss Timeline Calculator — Time to Goal Weight",
  seoDescription: "Estimate weeks to your goal weight from current weight, target, and weekly loss rate. Free timeline in seconds—results vary; not a medical weight-loss plan.",
  focusKeyword: "how long to reach goal weight calculator",
  formulaType: "healthWeightLossTimeline",
  description: "Estimate weeks to reach a goal weight at a chosen weekly loss rate.",
  formulaSummary: "Weeks = (current − target) ÷ weekly loss rate.",
  realWorldExample: "200 lb → 170 lb at 1 lb/week ≈ 30 weeks.",
  inputs: [
    input("currentLbs", "Current weight (lbs)", 200, 80, 500, 1),
    input("targetLbs", "Goal weight (lbs)", 170, 80, 500, 1),
    input("weeklyLossLbs", "Loss rate (lb/week)", 1, 0.25, 3, 0.25)
  ],
}),
buildHealthTool({
  slug: "protein-intake-calculator",
  title: "Protein Intake Calculator",
  seoH1: "Protein Intake Calculator — Grams per Pound of Bodyweight",
  seoDescription: "Set daily protein grams from body weight and goal: fat loss, maintenance, or muscle gain. Free protein target instantly—nutrition estimate, not medical advice.",
  focusKeyword: "protein intake calculator grams per pound of bodyweight",
  formulaType: "healthProteinIntake",
  description: "Set daily protein grams from body weight and training goal.",
  formulaSummary: "Protein (g) = bodyweight kg × g/kg target (often 1.6–2.2).",
  realWorldExample: "180 lb (82 kg) at 2.0 g/kg → ~164 g protein/day.",
  inputs: [
    input("weightLbs", "Weight (lbs)", 180, 80, 350, 1),
    input("gramsPerKg", "Protein (g/kg)", 2, 0.8, 2.5, 0.1)
  ],
}),
buildHealthTool({
  slug: "calories-burned-calculator-by-activity",
  title: "Calories Burned Calculator",
  seoH1: "Calories Burned Calculator by Activity and Duration",
  seoDescription: "Estimate calories burned from activity type, duration, and body weight using MET values. Free workout burn check—averages only, not a lab measurement.",
  focusKeyword: "calories burned calculator by activity and duration",
  formulaType: "healthCaloriesBurned",
  description: "Estimate calories burned using MET values for activity and duration.",
  formulaSummary: "Calories = MET × weight kg × hours.",
  realWorldExample: "70 kg person, MET 8, 45 min → ~420 kcal burned.",
  inputs: [
    input("met", "MET value", 8, 1, 18, 0.5),
    input("weightLbs", "Weight (lbs)", 154, 80, 350, 1),
    input("durationMin", "Duration (min)", 45, 5, 300, 5)
  ],
}),
buildHealthTool({
  slug: "steps-to-calories-calculator",
  title: "Steps to Calories Calculator",
  seoH1: "Steps to Calories Converter by Body Weight",
  seoDescription: "Convert daily steps into estimated calories using body weight and stride. Free step-to-calorie math—ballpark figures, not a fitness-tracker replacement.",
  focusKeyword: "steps to calories converter calculator by weight",
  formulaType: "healthStepsToCalories",
  description: "Convert daily steps into estimated calories using stride and weight.",
  formulaSummary: "Distance from steps × stride; calories from walking MET × weight.",
  realWorldExample: "10,000 steps, 30 in stride, 170 lb → ~350–450 kcal (estimate).",
  inputs: [
    input("steps", "Steps", 10000, 1000, 30000, 500),
    input("weightLbs", "Weight (lbs)", 170, 80, 350, 1),
    input("strideIn", "Stride (in)", 30, 20, 36, 0.5),
    input("walkSpeedMph", "Walk speed (mph)", 3.2, 2, 4.5, 0.1)
  ],
}),
buildHealthTool({
  slug: "weight-gain-calorie-surplus-calculator",
  title: "Weight Gain Calculator",
  seoH1: "Weight Gain Calorie Surplus Calculator for Muscle",
  seoDescription: "Calculate a daily calorie surplus and timeline to gain weight at a chosen weekly rate. Free surplus planner in seconds—estimates only, not a bulking meal plan.",
  focusKeyword: "weight gain calorie surplus calculator for muscle",
  formulaType: "healthWeightGain",
  description: "Calculate a daily surplus and timeline to gain weight at a chosen rate.",
  formulaSummary: "Surplus kcal/day = (weekly lb gain × 3,500) ÷ 7 added to TDEE.",
  realWorldExample: "TDEE 2,800 + 500 kcal surplus → ~1 lb/week gain target.",
  inputs: [
    input("tdee", "TDEE (kcal/day)", 2800, 1500, 5000, 50),
    input("weeklyGainLbs", "Gain goal (lb/week)", 0.5, 0.25, 2, 0.25)
  ],
}),
buildHealthTool({
  slug: "heart-rate-zone-calculator-karvonen",
  title: "Heart Rate Zone Calculator",
  seoH1: "Heart Rate Zone Calculator (Karvonen) by Age",
  seoDescription: "Find fat-burn, aerobic, and peak training zones from age and resting HR using Karvonen. Free heart-rate zone chart—training aid, not a cardiac diagnosis.",
  focusKeyword: "heart rate zone calculator karvonen by age",
  formulaType: "healthHeartRateZones",
  description: "Find fat-burn, aerobic, and peak zones from age and resting heart rate.",
  formulaSummary: "Target HR = resting + (max − resting) × intensity (Karvonen).",
  realWorldExample: "Age 35, resting 60 bpm → fat-burn zone roughly 132–145 bpm.",
  inputs: [
    input("ageYears", "Age (years)", 35, 15, 90, 1),
    input("restingHr", "Resting HR (bpm)", 60, 40, 100, 1)
  ],
}),
buildHealthTool({
  slug: "maximum-heart-rate-calculator",
  title: "Maximum Heart Rate Calculator",
  seoH1: "Maximum Heart Rate Calculator by Age",
  seoDescription: "Estimate max heart rate from age with common formulas (220−age and variants). Use it to set training zones. Free—population estimate, not a stress test.",
  focusKeyword: "max heart rate calculator by age formula",
  formulaType: "healthMaxHeartRate",
  description: "Estimate max heart rate from age using common population formulas.",
  formulaSummary: "Classic: 220 − age; Tanaka: 208 − 0.7×age.",
  realWorldExample: "Age 40 → classic max HR ≈ 180 bpm.",
  inputs: [
    input("ageYears", "Age (years)", 40, 15, 90, 1)
  ],
}),
buildHealthTool({
  slug: "one-rep-max-calculator",
  title: "One-Rep Max Calculator",
  seoH1: "One-Rep Max Calculator for Bench, Squat, and Deadlift",
  seoDescription: "Estimate one-rep max from a submaximal set using Brzycki, Epley, and Lander formulas. Plan percentages safely. Free 1RM tool—not a substitute for a tested max.",
  focusKeyword: "one rep max calculator bench squat deadlift",
  formulaType: "healthOneRepMax",
  description: "Estimate 1RM from a submaximal set using Brzycki, Epley, and Lander.",
  formulaSummary: "Brzycki: weight × 36 ÷ (37 − reps); averaged with Epley and Lander.",
  realWorldExample: "225 lb × 5 reps → estimated 1RM ≈ 253 lb.",
  inputs: [
    input("weightLifted", "Weight lifted (lbs)", 225, 45, 600, 5),
    input("reps", "Reps performed", 5, 1, 12, 1)
  ],
}),
buildHealthTool({
  slug: "running-pace-calculator-5k",
  title: "Running Pace Calculator",
  seoH1: "Running Pace Calculator for 5K Finish Time",
  seoDescription: "Convert distance and time into mile or km pace, or predict a 5K finish from goal pace. Free running pace chart—race estimates, not a training prescription.",
  focusKeyword: "running pace calculator for 5k finish time",
  formulaType: "healthRunningPace",
  description: "Convert distance and time into pace, speed, and 5K projections.",
  formulaSummary: "Pace (min/mi) = time ÷ distance; speed = distance ÷ time.",
  realWorldExample: "3.1 mi in 27 min → ~8:42/mi pace, ~5.2 mph.",
  inputs: [
    input("distanceMiles", "Distance (mi)", 3.1, 0.5, 26.2, 0.1),
    input("timeMin", "Time (minutes)", 27, 5, 600, 0.5)
  ],
}),
buildHealthTool({
  slug: "vo2-max-calculator-cooper-test",
  title: "VO2 Max Calculator",
  seoH1: "VO2 Max Calculator from Run Time and Distance",
  seoDescription: "Estimate VO2 max from a timed run (Cooper-style) using distance or finish time. Free cardio fitness score in seconds—field estimate, not a lab VO2 test.",
  focusKeyword: "vo2 max calculator from running time and distance",
  formulaType: "healthVo2Max",
  description: "Estimate VO₂ max from a 12-minute Cooper test distance.",
  formulaSummary: "VO₂ max ≈ 22.351 × km − 11.288 (Cooper field test).",
  realWorldExample: "1.75 mi in 12 min → VO₂ max ≈ 38 ml/kg/min (estimate).",
  inputs: [
    input("distanceMiles12Min", "12-min distance (mi)", 1.75, 0.5, 3.5, 0.05)
  ],
}),
buildHealthTool({
  slug: "walking-calories-calculator",
  title: "Walking Calories Calculator",
  seoH1: "Walking Calories Calculator by Distance and Weight",
  seoDescription: "Estimate calories burned walking from distance, walking pace, and body weight. Free walk-burn math for daily steps—averages only, not a medical reading.",
  focusKeyword: "calories burned walking calculator by distance and weight",
  formulaType: "healthWalkingCalories",
  description: "Estimate walking calories from distance, speed, and body weight.",
  formulaSummary: "MET-based burn from walking speed and duration.",
  realWorldExample: "3 mi walk at 3.5 mph, 170 lb → ~280 kcal (estimate).",
  inputs: [
    input("distanceMiles", "Distance (mi)", 3, 0.5, 20, 0.1),
    input("weightLbs", "Weight (lbs)", 170, 80, 350, 1),
    input("walkSpeedMph", "Speed (mph)", 3.5, 2, 5, 0.1)
  ],
}),
buildHealthTool({
  slug: "cycling-calories-calculator",
  title: "Cycling Calories Calculator",
  seoH1: "Cycling Calories Calculator by Miles and Speed",
  seoDescription: "Estimate bike-ride calories from distance, speed, and body weight with MET factors. Free cycling burn check—planning figures, not a power-meter reading.",
  focusKeyword: "cycling calories burned calculator by miles and speed",
  formulaType: "healthCyclingCalories",
  description: "Estimate bike-ride calories from distance, speed, and weight.",
  formulaSummary: "MET scales with cycling speed × weight × hours.",
  realWorldExample: "15 mi at 14 mph, 180 lb → ~650 kcal (estimate).",
  inputs: [
    input("distanceMiles", "Distance (mi)", 15, 1, 100, 1),
    input("weightLbs", "Weight (lbs)", 180, 80, 350, 1),
    input("speedMph", "Speed (mph)", 14, 8, 25, 0.5)
  ],
}),
buildHealthTool({
  slug: "weight-lifting-calories-calculator",
  title: "Weight Lifting Calories Calculator",
  seoH1: "Weight Lifting Calories Calculator by Duration",
  seoDescription: "Estimate calories burned during resistance training from body weight, minutes, and intensity. Free lifting burn—MET averages, not a metabolic lab test.",
  focusKeyword: "calories burned weightlifting calculator by duration",
  formulaType: "healthWeightLiftingCalories",
  description: "Estimate resistance-training calories from duration and intensity.",
  formulaSummary: "MET 3.5–6 × weight kg × hours by intensity.",
  realWorldExample: "60 min moderate lifting, 190 lb → ~380 kcal (estimate).",
  inputs: [
    input("weightLbs", "Weight (lbs)", 190, 80, 350, 1),
    input("durationMin", "Duration (min)", 60, 10, 180, 5),
    input("intensity", "Intensity (1=light, 3=heavy)", 2, 1, 3, 1)
  ],
}),
buildHealthTool({
  slug: "pregnancy-due-date-calculator",
  title: "Pregnancy Due Date Calculator",
  seoH1: "Pregnancy Due Date Calculator from Last Period",
  seoDescription: "Estimate due date and gestational age from the first day of your last period (Naegele’s rule). Free EDD tool—planning only, confirm with your clinician.",
  focusKeyword: "pregnancy due date calculator from last period",
  formulaType: "healthDueDate",
  description: "Estimate due date and gestational age from days since last period (LMP).",
  formulaSummary: "Naegele: due date = LMP + 280 days (40 weeks).",
  realWorldExample: "28 days since LMP → ~252 days until due date, ~4 weeks pregnant.",
  inputs: [
    input("daysSinceLmp", "Days since last period started", 28, 0, 280, 1)
  ],
}),
buildHealthTool({
  slug: "conception-date-calculator",
  title: "Conception Date Calculator",
  seoH1: "Conception Date Calculator from Due Date",
  seoDescription: "Back-calculate an estimated conception window from due date or last menstrual period. Free conception date range—not proof of the exact day you conceived.",
  focusKeyword: "conception date calculator from due date",
  formulaType: "healthConceptionDate",
  description: "Back-calculate an estimated conception window from cycle timing.",
  formulaSummary: "Conception often occurs ~14 days after LMP in a 28-day cycle.",
  realWorldExample: "Day 28 since LMP → conception likely near cycle day 14.",
  inputs: [
    input("daysSinceLmp", "Days since LMP started", 28, 0, 280, 1)
  ],
}),
buildHealthTool({
  slug: "ovulation-calculator",
  title: "Ovulation Calculator",
  seoH1: "Ovulation Calculator for Regular and Irregular Cycles",
  seoDescription: "Predict ovulation day and fertile window from last period and cycle length, including irregular cycles. Free fertility estimate—not a contraception method.",
  focusKeyword: "ovulation calculator for irregular periods",
  formulaType: "healthOvulation",
  description: "Predict ovulation day and fertile window from cycle length and LMP.",
  formulaSummary: "Ovulation ≈ cycle length − 14; fertile window ~5 days before + 1 after.",
  realWorldExample: "28-day cycle, day 10 since LMP → ovulation in ~4 days (day 14).",
  inputs: [
    input("cycleLengthDays", "Cycle length (days)", 28, 21, 40, 1),
    input("daysSinceLmp", "Days since LMP", 10, 0, 40, 1)
  ],
}),
buildHealthTool({
  slug: "period-calculator-next-date",
  title: "Period Calculator",
  seoH1: "Period Calculator — Next Period Date from Cycle Length",
  seoDescription: "Project your next period start date from last period and average cycle length. Free period predictor—cycles vary; not a diagnosis or birth-control method.",
  focusKeyword: "period calculator next period date from cycle length",
  formulaType: "healthPeriod",
  description: "Project your next period from last start date and average cycle length.",
  formulaSummary: "Next period ≈ last period + cycle length days.",
  realWorldExample: "22 days since period, 28-day cycle → next period in ~6 days.",
  inputs: [
    input("cycleLengthDays", "Cycle length (days)", 28, 21, 40, 1),
    input("daysSinceLastPeriod", "Days since last period", 22, 0, 40, 1)
  ],
}),
buildHealthTool({
  slug: "pregnancy-week-calculator",
  title: "Pregnancy Week Calculator",
  seoH1: "How Many Weeks Pregnant Am I? Calculator",
  seoDescription: "Convert last period or due date into current pregnancy week and trimester instantly. Free week tracker—gestational age estimate; confirm at prenatal visits.",
  focusKeyword: "how many weeks pregnant am i calculator",
  formulaType: "healthPregnancyWeek",
  description: "Convert days since LMP into pregnancy week and trimester.",
  formulaSummary: "Gestational weeks = days since LMP ÷ 7.",
  realWorldExample: "49 days since LMP → 7.0 weeks, first trimester.",
  inputs: [
    input("daysSinceLmp", "Days since LMP", 49, 0, 280, 1)
  ],
}),
buildHealthTool({
  slug: "pregnancy-weight-gain-calculator",
  title: "Pregnancy Weight Gain Calculator",
  seoH1: "Pregnancy Weight Gain Calculator by Pre-Pregnancy BMI",
  seoDescription: "See IOM-style total and weekly gain ranges from pre-pregnancy BMI, including twin pregnancy. Free guideline chart—follow your OB’s personalized target.",
  focusKeyword: "pregnancy weight gain calculator by pre pregnancy bmi",
  formulaType: "healthPregnancyWeightGain",
  description: "See IOM-style total gain ranges from pre-pregnancy BMI.",
  formulaSummary: "IOM total gain ranges by pre-pregnancy BMI category.",
  realWorldExample: "Pre-pregnancy BMI 22 → recommended gain ~25–35 lb (singleton).",
  inputs: [
    input("prePregnancyLbs", "Pre-pregnancy weight (lbs)", 140, 80, 300, 1),
    input("heightIn", "Height (in)", 65, 48, 78, 0.5),
    input("twins", "Twins (0=no, 1=yes)", 0, 0, 1, 1)
  ],
}),
buildHealthTool({
  slug: "ivf-due-date-calculator",
  title: "IVF Due Date Calculator",
  seoH1: "IVF Due Date Calculator from Embryo Transfer Date",
  seoDescription: "Estimate IVF due date from embryo transfer date and embryo day (day-3 or day-5 blastocyst). Free IVF EDD calculator—clinic dating still takes priority.",
  focusKeyword: "ivf due date calculator from transfer date",
  formulaType: "healthIvfDueDate",
  description: "Estimate IVF due date from embryo transfer day and embryo age.",
  formulaSummary: "Day-5 transfer + 261 days; day-3 transfer + 263 days.",
  realWorldExample: "Day-5 transfer 10 days ago → ~251 days until due date.",
  inputs: [
    input("daysSinceTransfer", "Days since transfer", 10, 0, 280, 1),
    input("embryoDay", "Embryo day (3 or 5)", 5, 3, 5, 2)
  ],
}),
buildHealthTool({
  slug: "breastfeeding-calorie-needs-calculator",
  title: "Breastfeeding Calorie Needs Calculator",
  seoH1: "Breastfeeding Calorie Needs Calculator — Extra Calories/Day",
  seoDescription: "Estimate extra daily calories while breastfeeding from body weight, feedings, and activity. Free lactation energy check—not a substitute for a dietitian.",
  focusKeyword: "breastfeeding calorie calculator extra calories per day",
  formulaType: "healthBreastfeedingCalories",
  description: "Estimate extra daily calories while breastfeeding.",
  formulaSummary: "Maintenance TDEE + ~400–500 kcal for lactation.",
  realWorldExample: "2,400 kcal maintenance + 500 lactation → ~2,900 kcal/day.",
  inputs: [
    input("sex", "Sex (0=F, 1=M)", 0, 0, 1, 1),
    input("ageYears", "Age (years)", 30, 15, 50, 1),
    input("weightLbs", "Weight (lbs)", 155, 90, 280, 1),
    input("heightIn", "Height (in)", 65, 48, 78, 0.5),
    input("activityMultiplier", "Activity (1.2–1.55)", 1.45, 1.2, 1.55, 0.05),
    input("monthsPostpartum", "Months postpartum", 3, 0, 24, 1)
  ],
}),
buildHealthTool({
  slug: "daily-water-intake-calculator",
  title: "Daily Water Intake Calculator",
  seoH1: "Daily Water Intake Calculator by Weight and Activity",
  seoDescription: "Estimate daily water needs from body weight, exercise minutes, and climate. Free hydration target in cups and liters—guideline only, not medical advice.",
  focusKeyword: "daily water intake calculator by weight and activity",
  formulaType: "healthWaterIntake",
  description: "Estimate daily water needs from weight, exercise, and climate.",
  formulaSummary: "Base 35 ml/kg + exercise bonus; hot climate adds ~10%.",
  realWorldExample: "170 lb, 30 min exercise → ~2.7–3.0 L/day target.",
  inputs: [
    input("weightLbs", "Weight (lbs)", 170, 80, 350, 1),
    input("exerciseMin", "Exercise (min/day)", 30, 0, 180, 5),
    input("hotClimate", "Hot climate (0=no, 1=yes)", 0, 0, 1, 1)
  ],
}),
buildHealthTool({
  slug: "sleep-cycle-calculator",
  title: "Sleep Cycle Calculator",
  seoH1: "Sleep Cycle Calculator — What Time Should I Wake Up?",
  seoDescription: "Pick a bedtime or wake-up time that lands on 90-minute sleep cycles. Free sleep-cycle planner for fewer groggy mornings—not a sleep-disorder diagnosis.",
  focusKeyword: "sleep cycle calculator what time should i wake up",
  formulaType: "healthSleepCycle",
  description: "Pick bedtime or wake time aligned to 90-minute sleep cycles.",
  formulaSummary: "Bedtime = wake time − (cycles × 90 min) − 15 min to fall asleep.",
  realWorldExample: "Wake 7:00 AM, 5 cycles → bedtime ~10:45 PM.",
  inputs: [
    input("wakeTimeMin", "Wake time (min from midnight)", 420, 0, 1439, 15),
    input("sleepCycles", "Sleep cycles (90 min each)", 5, 3, 6, 1)
  ],
}),
buildHealthTool({
  slug: "caffeine-half-life-calculator",
  title: "Caffeine Half-Life Calculator",
  seoH1: "Caffeine Half-Life Calculator — How Long in Your System?",
  seoDescription: "See remaining caffeine over time from dose, drink count, and a ~5-hour half-life. Free clearance timeline—averages vary; not medical or pregnancy advice.",
  focusKeyword: "caffeine half life calculator how long in your system",
  formulaType: "healthCaffeineHalfLife",
  description: "See remaining caffeine over time from dose and half-life.",
  formulaSummary: "Remaining = dose × 0.5^(hours ÷ half-life).",
  realWorldExample: "200 mg caffeine, 5 hr half-life, 6 hr ago → ~70 mg left.",
  inputs: [
    input("caffeineMg", "Caffeine consumed (mg)", 200, 0, 600, 10),
    input("hoursSince", "Hours since consumed", 6, 0, 24, 0.5),
    input("halfLifeHours", "Half-life (hours)", 5, 3, 8, 0.5)
  ],
}),
buildHealthTool({
  slug: "bac-calculator-by-weight",
  title: "BAC Calculator",
  seoH1: "BAC Calculator by Weight, Gender, and Drinks",
  seoDescription: "Estimate blood alcohol content from drinks, hours, body weight, and sex (Widmark-style). Free BAC math—not legal proof or a test of whether you can drive.",
  focusKeyword: "bac calculator by weight gender and drinks",
  formulaType: "healthBac",
  description: "Estimate blood alcohol content from drinks, weight, and time (Widmark).",
  formulaSummary: "BAC ≈ (grams alcohol ÷ (weight × r)) − 0.015×hours; r differs by sex.",
  realWorldExample: "2 drinks, 180 lb male, 2 hr → BAC ~0.03% (estimate only).",
  inputs: [
    input("standardDrinks", "Standard drinks (14g each)", 2, 0, 15, 0.5),
    input("hoursSince", "Hours since first drink", 2, 0, 12, 0.5),
    input("weightLbs", "Weight (lbs)", 180, 100, 350, 1),
    input("sex", "Sex (0=F, 1=M)", 1, 0, 1, 1)
  ],
}),
buildHealthTool({
  slug: "intermittent-fasting-calculator",
  title: "Intermittent Fasting Calculator",
  seoH1: "Intermittent Fasting Calculator — 16:8 Eating Window",
  seoDescription: "Set 16:8, 18:6, or a custom fast and eat window from your wake time. Free intermittent fasting schedule—planning aid, not medical or eating-disorder advice.",
  focusKeyword: "intermittent fasting calculator 16 8 eating window",
  formulaType: "healthIntermittentFasting",
  description: "Set 16:8, 18:6, or custom fast/eat windows from wake time.",
  formulaSummary: "Feeding window length = 24 − fast hours, anchored after wake.",
  realWorldExample: "Wake 7 AM, 16:8 fast → eat roughly 8 AM–4 PM (example schedule).",
  inputs: [
    input("wakeTimeMin", "Wake time (min from midnight)", 420, 0, 1439, 15),
    input("fastHours", "Fast length (hours)", 16, 12, 20, 1)
  ],
}),
buildHealthTool({
  slug: "hydration-calculator-for-exercise",
  title: "Hydration Calculator for Exercise",
  seoH1: "Hydration Calculator for Exercise and Sweat Loss",
  seoDescription: "Estimate fluid to replace from workout duration, intensity, and sweat rate. Free exercise hydration planner in seconds—guidelines only, not medical treatment.",
  focusKeyword: "hydration calculator for exercise and sweat loss",
  formulaType: "healthHydrationActivity",
  description: "Estimate fluid to replace from workout duration and intensity.",
  formulaSummary: "Base hydration + sweat rate × exercise minutes.",
  realWorldExample: "60 min hard workout adds ~1.4 L on top of base needs.",
  inputs: [
    input("weightLbs", "Weight (lbs)", 170, 80, 350, 1),
    input("exerciseMin", "Exercise (min)", 60, 10, 180, 5),
    input("intensity", "Intensity (1=light, 3=hard)", 2, 1, 3, 1)
  ],
}),
buildHealthTool({
  slug: "daily-caffeine-intake-calculator",
  title: "Daily Caffeine Intake Calculator",
  seoH1: "Daily Caffeine Intake Calculator from Coffee and Energy Drinks",
  seoDescription: "Add up milligrams from coffee, tea, soda, and energy drinks vs common daily limits. Free caffeine tally—FDA-style guidance, not personal medical advice.",
  focusKeyword: "daily caffeine intake calculator milligrams from drinks",
  formulaType: "healthCaffeineIntake",
  description: "Add up caffeine milligrams from coffee, tea, and energy drinks.",
  formulaSummary: "Sum mg from each drink type vs ~400 mg/day adult guidance.",
  realWorldExample: "3 coffees (95 mg) + 1 energy (160 mg) → 445 mg total.",
  inputs: [
    input("coffeeCups", "Coffee cups", 3, 0, 10, 1),
    input("mgPerCoffee", "Mg per coffee", 95, 50, 200, 5),
    input("teaCups", "Tea cups", 1, 0, 10, 1),
    input("mgPerTea", "Mg per tea", 40, 10, 80, 5),
    input("energyDrinks", "Energy drinks", 0, 0, 5, 1),
    input("mgPerEnergy", "Mg per energy drink", 160, 80, 300, 10)
  ],
}),
buildHealthTool({
  slug: "sleep-debt-calculator",
  title: "Sleep Debt Calculator",
  seoH1: "Sleep Debt Calculator — How Much Sleep to Catch Up",
  seoDescription: "Compare hours slept versus your sleep need to estimate weekly sleep debt and recovery nights. Free catch-up planner—not a diagnosis of insomnia or apnea.",
  focusKeyword: "sleep debt calculator how much sleep i need to catch up",
  formulaType: "healthSleepDebt",
  description: "Compare hours slept vs need to estimate weekly sleep debt.",
  formulaSummary: "Debt = (need − slept) × nights tracked.",
  realWorldExample: "Need 8 hr, slept 6.5 hr × 7 nights → 10.5 hr debt.",
  inputs: [
    input("sleepNeedHours", "Sleep need (hr/night)", 8, 6, 10, 0.5),
    input("avgSleepHours", "Average slept (hr)", 6.5, 0, 12, 0.25),
    input("nightsTracked", "Nights tracked", 7, 1, 14, 1)
  ],
}),
buildHealthTool({
  slug: "gym-cost-per-workout-calculator",
  title: "Gym Cost Per Workout Calculator",
  seoH1: "Gym Membership Cost Per Workout Calculator",
  seoDescription: "Divide monthly dues, initiation fees, and extras by workouts you actually attend. See true cost per session. Free gym-value check—no sign up required.",
  focusKeyword: "gym membership cost per workout calculator",
  formulaType: "healthGymCostPerWorkout",
  description: "Divide monthly dues and fees by workouts you actually attend.",
  formulaSummary: "Cost/workout = (dues + annual/12 + extras) ÷ workouts per month.",
  realWorldExample: "$60/mo + $120/yr, 12 workouts → ~$6.25 per session.",
  inputs: [
    input("monthlyDues", "Monthly dues ($)", 60, 10, 300, 5),
    input("annualFee", "Annual fee ($)", 120, 0, 500, 10),
    input("extrasMonthly", "Extras ($/mo)", 0, 0, 100, 5),
    input("workoutsPerMonth", "Workouts / month", 12, 1, 30, 1)
  ],
}),
buildHealthTool({
  slug: "protein-powder-cost-per-serving-calculator",
  title: "Protein Powder Cost Per Serving Calculator",
  seoH1: "Protein Powder Cost Per Serving Calculator",
  seoDescription: "Compare protein tubs by price, servings, and grams of protein per scoop. Find cost per serving and per 25g of protein. Free, instant—shopping math only.",
  focusKeyword: "protein powder cost per serving calculator",
  formulaType: "healthProteinPowderCost",
  description: "Compare tubs by price, servings, and grams of protein per scoop.",
  formulaSummary: "$/serving = tub price ÷ servings; $/25g = serving cost scaled.",
  realWorldExample: "$54 tub, 30 servings, 24g protein → $1.80/serving, $1.88/25g.",
  inputs: [
    input("tubPrice", "Tub price ($)", 54, 10, 150, 1),
    input("servingsPerTub", "Servings per tub", 30, 5, 100, 1),
    input("proteinPerServing", "Protein per scoop (g)", 24, 10, 50, 1)
  ],
}),
buildHealthTool({
  slug: "monthly-supplement-cost-calculator",
  title: "Monthly Supplement Cost Calculator",
  seoH1: "Monthly Supplement Cost Calculator for Your Stack",
  seoDescription: "Tally pills, powders, and daily servings into a realistic monthly supplement budget. Free stack-cost planner—price math only, not health or dosing advice.",
  focusKeyword: "monthly supplement cost calculator stack budget",
  formulaType: "healthSupplementCost",
  description: "Tally pills and powders into a realistic monthly supplement budget.",
  formulaSummary: "Monthly total = sum of recurring supplement line items.",
  realWorldExample: "$35 protein + $20 creatine + $15 vitamins → $70/mo stack.",
  inputs: [
    input("item1Monthly", "Item 1 ($/mo)", 35, 0, 200, 5),
    input("item2Monthly", "Item 2 ($/mo)", 20, 0, 200, 5),
    input("item3Monthly", "Item 3 ($/mo)", 15, 0, 200, 5)
  ],
}),
buildHealthTool({
  slug: "physical-therapy-cost-calculator",
  title: "Physical Therapy Cost Calculator",
  seoH1: "Physical Therapy Cost Calculator — Sessions and Copays",
  seoDescription: "Estimate physical therapy costs from sessions per week, copay, coinsurance, and deductible. Free therapy-budget tool—not a bill quote or insurance advice.",
  focusKeyword: "physical therapy cost calculator per session and copay",
  formulaType: "healthPtCost",
  description: "Estimate PT costs from sessions, copay, and deductible.",
  formulaSummary: "Total ≈ sessions × (copay + deductible ÷ sessions).",
  realWorldExample: "2×/wk × 8 wk, $40 copay → $640 before deductible spread.",
  inputs: [
    input("sessionsPerWeek", "Sessions / week", 2, 1, 5, 1),
    input("weeks", "Weeks of care", 8, 1, 24, 1),
    input("copay", "Copay per session ($)", 40, 0, 150, 5),
    input("deductibleRemaining", "Deductible remaining ($)", 500, 0, 5000, 50)
  ],
}),
buildHealthTool({
  slug: "glasses-vs-contacts-cost-calculator",
  title: "Glasses vs Contacts Cost Calculator",
  seoH1: "Glasses vs Contacts Cost Comparison Calculator (Yearly)",
  seoDescription: "Compare yearly cost of glasses versus contacts: exams, lenses, solution, and replacements. Free 12-month tally—prices vary; not a vision prescription.",
  focusKeyword: "glasses vs contacts cost comparison calculator yearly",
  formulaType: "healthGlassesVsContacts",
  description: "Compare first-year cost of glasses versus contacts.",
  formulaSummary: "Year-1 totals for exams, lenses, frames, solution, and replacements.",
  realWorldExample: "$450 glasses vs $520 contacts → glasses cheaper by ~$70.",
  inputs: [
    input("glassesExam", "Glasses exam ($)", 120, 0, 400, 10),
    input("glassesFrames", "Frames ($)", 180, 0, 600, 10),
    input("glassesLenses", "Lenses ($)", 150, 0, 500, 10),
    input("contactsExam", "Contacts exam ($)", 120, 0, 400, 10),
    input("contactsLensesYear", "Contacts lenses ($/yr)", 280, 0, 800, 10),
    input("contactsSolutionYear", "Solution ($/yr)", 120, 0, 300, 10)
  ],
}),
buildHealthTool({
  slug: "home-workout-vs-gym-cost-calculator",
  title: "Home Workout vs Gym Cost Calculator",
  seoH1: "Home Workout vs Gym Membership Cost Calculator",
  seoDescription: "Compare home equipment, apps, and space versus gym dues over 12 months. See which setup is cheaper. Free break-even math—not personal fitness coaching.",
  focusKeyword: "home workout vs gym membership cost calculator",
  formulaType: "healthHomeVsGym",
  description: "Compare home equipment and apps vs gym dues over 12 months.",
  formulaSummary: "12-mo gym = monthly×12 + initiation; home = gear + apps + upkeep.",
  realWorldExample: "$720/yr gym vs $550 home setup → home saves ~$170 year one.",
  inputs: [
    input("gymMonthly", "Gym ($/mo)", 60, 10, 300, 5),
    input("gymInitiation", "Gym initiation ($)", 50, 0, 300, 10),
    input("homeEquipment", "Home equipment ($)", 400, 0, 5000, 50),
    input("homeAppMonthly", "Apps ($/mo)", 10, 0, 50, 5),
    input("homeOtherYearly", "Other home ($/yr)", 50, 0, 500, 10)
  ],
})
];

export const HEALTH_READY_TOOLS = HEALTH_TOOLS.filter((tool) => tool.ready !== false);
export const HEALTH_SLUGS = new Set(HEALTH_TOOLS.map((t) => t.slug));

export function getHealthToolBySlug(slug: string): Calculator | undefined {
  return HEALTH_TOOLS.find((tool) => tool.slug === slug);
}

