import fs from "fs";

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

const LIFE = "Media, Photography, Cooking & Lifestyle";

const extra = [
  calc({
    slug: "recipe-ingredient-scaler-calculator",
    title: "Recipe Ingredient Scaler Calculator",
    category: LIFE,
    description:
      "Scale recipe ingredient quantities up or down by serving size. Adapt any recipe without guesswork.",
    formulaType: "recipeScaler",
    inputs: [
      i("originalServings", "Original Servings", 4, 1, 50, 1),
      i("desiredServings", "Desired Servings", 6, 1, 100, 1),
      i("ingredientAmount", "Ingredient Amount", 2, 0.1, 1000, 0.1),
    ],
    intro:
      "Recipe scaling keeps ingredient ratios intact when changing serving counts. Enter original and desired servings to resize any single ingredient amount.",
    howToUse: [
      "Enter the recipe’s original serving count.",
      "Set how many servings you want.",
      "Enter an ingredient amount and review the scaled quantity.",
    ],
    faqs: [
      f("Do spices scale linearly?", "Mostly, but very large batches may need taste adjustments."),
      f("What about baking yeast?", "Yeast and leaveners can be sensitive—scale carefully and watch rise times."),
      f("Can I scale by percentage?", "Desired/original servings is the scale factor."),
    ],
  }),
  calc({
    slug: "baking-pan-converter-calculator",
    title: "Baking Pan Converter Calculator",
    category: LIFE,
    description:
      "Convert batter volume between baking pan areas. Move recipes across pan sizes with better confidence.",
    formulaType: "bakingPanConverter",
    inputs: [
      i("fromLength", "From Pan Length (in)", 9, 4, 18, 0.5),
      i("fromWidth", "From Pan Width (in)", 13, 4, 18, 0.5),
      i("toLength", "To Pan Length (in)", 8, 4, 18, 0.5),
      i("toWidth", "To Pan Width (in)", 8, 4, 18, 0.5),
      i("batterCups", "Batter Volume (cups)", 8, 0.5, 30, 0.5),
    ],
    intro:
      "Pan area differences change batter depth and bake time. Convert a known batter volume from one rectangular pan size to another using area ratios.",
    howToUse: [
      "Enter original pan length and width.",
      "Enter new pan dimensions.",
      "Add batter cups and review the adjusted volume guidance.",
    ],
    faqs: [
      f("Does this work for round pans?", "Convert round pans using πr² area before comparing."),
      f("Will bake time stay the same?", "No—deeper or shallower batter changes time and temperature needs."),
      f("What if the new pan overflows?", "Fill pans only about halfway to two-thirds full."),
    ],
  }),
  calc({
    slug: "coffee-to-water-brew-ratio-calculator",
    title: "Coffee-to-Water Brew Ratio Calculator",
    category: LIFE,
    description:
      "Calculate coffee dose and water from brew ratios. Dial in pour-over and batch brew strength.",
    formulaType: "coffeeBrewRatio",
    inputs: [
      i("ratio", "Brew Ratio (water:coffee)", 16, 10, 20, 0.5),
      i("coffeeGrams", "Coffee (grams)", 20, 5, 100, 1),
      i("mode", "Mode (1=water from coffee, 2=coffee from water)", 1, 1, 2, 1),
      i("waterGrams", "Water (grams)", 320, 50, 2000, 10),
    ],
    intro:
      "Brew ratio controls extraction strength more reliably than scoops. Compute water needed for a coffee dose—or coffee needed for a target water yield.",
    howToUse: [
      "Set your preferred brew ratio (e.g., 16).",
      "Choose mode 1 to calculate water from coffee dose.",
      "Or choose mode 2 to calculate coffee from water amount.",
    ],
    faqs: [
      f("Is 1:16 a good starting point?", "Yes for many pour-overs; adjust to taste."),
      f("Grams or milliliters for water?", "For water, grams ≈ milliliters."),
      f("Does grind size matter?", "Yes—ratio is only one variable alongside grind and time."),
    ],
  }),
  calc({
    slug: "meat-cooking-time-calculator",
    title: "Meat Cooking Time Calculator",
    category: LIFE,
    description:
      "Estimate roasting time from weight and minutes-per-pound guidance. Plan oven schedules with fewer surprises.",
    formulaType: "meatCookingTime",
    inputs: [
      i("weightLbs", "Meat Weight (lbs)", 4, 0.5, 30, 0.5),
      i("minutesPerLb", "Minutes per Pound", 20, 5, 60, 1),
      i("restMinutes", "Rest Time (minutes)", 15, 0, 60, 5),
    ],
    intro:
      "Roast timing depends on weight, cut, and oven temperature. Estimate cook plus rest time using minutes-per-pound guidelines before relying on a thermometer finish.",
    howToUse: [
      "Enter the meat weight in pounds.",
      "Set minutes-per-pound for your method.",
      "Add rest time and review total schedule.",
    ],
    faqs: [
      f("Is time alone safe enough?", "No—always verify doneness with an internal thermometer."),
      f("Do bone-in cuts differ?", "Yes—bone-in and stuffed roasts often need more time."),
      f("What about altitude?", "High altitude can require recipe adjustments."),
    ],
  }),
  calc({
    slug: "shutter-speed-exposure-value-calculator",
    title: "Shutter Speed Exposure Value Calculator",
    category: LIFE,
    description:
      "Relate shutter speed, aperture, and ISO to exposure value. Balance photo exposure settings faster.",
    formulaType: "shutterExposure",
    inputs: [
      i("aperture", "Aperture (f-number)", 2.8, 1, 22, 0.1),
      i("iso", "ISO", 200, 50, 102400, 50),
      i("ev", "Target EV", 12, -5, 20, 0.5),
    ],
    intro:
      "Exposure value ties aperture, shutter, and ISO together. Estimate a shutter speed that targets a chosen EV for your aperture and ISO.",
    howToUse: [
      "Enter aperture f-number.",
      "Set ISO sensitivity.",
      "Choose a target EV and review suggested shutter speed.",
    ],
    faqs: [
      f("What is EV?", "Exposure Value is a standardized brightness scale for camera settings."),
      f("Is this exact for every camera?", "It is a physics-based estimate; metering and metering modes still matter."),
      f("How does ISO affect shutter?", "Higher ISO allows faster shutters at the same brightness."),
    ],
  }),
  calc({
    slug: "depth-of-field-hyperfocal-calculator",
    title: "Depth of Field Hyperfocal Calculator",
    category: LIFE,
    description:
      "Estimate hyperfocal distance from focal length, aperture, and circle of confusion. Maximize landscape sharpness.",
    formulaType: "hyperfocalDistance",
    inputs: [
      i("focalLength", "Focal Length (mm)", 35, 8, 400, 1),
      i("aperture", "Aperture (f-number)", 8, 1.2, 32, 0.1),
      i("coc", "Circle of Confusion (mm)", 0.02, 0.005, 0.05, 0.001),
    ],
    intro:
      "Hyperfocal focusing maximizes depth of field from a near limit to infinity. Estimate hyperfocal distance for your lens and aperture settings.",
    howToUse: [
      "Enter lens focal length in millimeters.",
      "Set aperture f-number.",
      "Confirm circle of confusion and review hyperfocal distance.",
    ],
    faqs: [
      f("What is circle of confusion?", "A sharpness tolerance related to sensor size and viewing assumptions."),
      f("Why focus at hyperfocal?", "It keeps infinity acceptably sharp while pushing the near limit farther out."),
      f("Does crop factor matter?", "Use an appropriate CoC for your sensor format."),
    ],
  }),
  calc({
    slug: "time-lapse-interval-calculator",
    title: "Time-Lapse Interval Calculator",
    category: LIFE,
    description:
      "Calculate time-lapse shooting intervals from event duration and clip length. Plan smoother sequences.",
    formulaType: "timelapseInterval",
    inputs: [
      i("eventMinutes", "Real Event Duration (min)", 120, 1, 1440, 1),
      i("clipSeconds", "Final Clip Length (sec)", 10, 1, 120, 1),
      i("fps", "Playback FPS", 30, 12, 60, 1),
    ],
    intro:
      "Time-lapse interval planning starts from how long the event lasts and how long the final clip should run. Compute shot interval and total frames needed.",
    howToUse: [
      "Enter real-world event duration in minutes.",
      "Set desired final clip seconds and FPS.",
      "Review interval and total frames.",
    ],
    faqs: [
      f("What interval for clouds?", "Often a few seconds—test locally for motion speed."),
      f("Does battery life matter?", "Yes—long intervals still need power and storage planning."),
      f("Can I change FPS later?", "Yes, but it alters perceived speed and clip length."),
    ],
  }),
  calc({
    slug: "video-bitrate-file-size-calculator",
    title: "Video Bitrate File Size Calculator",
    category: LIFE,
    description:
      "Estimate video file size from bitrate and duration. Plan storage and upload bandwidth ahead of shoots.",
    formulaType: "videoBitrateSize",
    inputs: [
      i("bitrateMbps", "Video Bitrate (Mbps)", 50, 1, 400, 1),
      i("minutes", "Duration (minutes)", 15, 0.5, 300, 0.5),
      i("audioKbps", "Audio Bitrate (kbps)", 256, 64, 1600, 64),
    ],
    intro:
      "Bitrate × time determines approximate media file size. Estimate gigabytes needed for a clip including audio overhead.",
    howToUse: [
      "Enter video bitrate in Mbps.",
      "Set duration in minutes.",
      "Add audio bitrate and review estimated file size.",
    ],
    faqs: [
      f("Is this exact?", "Container overhead and variable bitrate make it an estimate."),
      f("What bitrate for 4K?", "It depends on codec and motion—often tens of Mbps or more."),
      f("Does audio matter?", "Less than video, but it still adds up on long recordings."),
    ],
  }),
  calc({
    slug: "audio-frequency-wavelength-calculator",
    title: "Audio Frequency Wavelength Calculator",
    category: LIFE,
    description:
      "Convert sound frequency to wavelength in air. Useful for room treatment and speaker placement intuition.",
    formulaType: "audioWavelength",
    inputs: [
      i("frequency", "Frequency (Hz)", 440, 20, 20000, 1),
      i("speedOfSound", "Speed of Sound (m/s)", 343, 300, 360, 1),
    ],
    intro:
      "Wavelength equals speed of sound divided by frequency. Calculate the physical length of a sound wave for acoustics planning.",
    howToUse: [
      "Enter the audio frequency in Hz.",
      "Confirm speed of sound for your conditions.",
      "Review wavelength in meters and feet.",
    ],
    faqs: [
      f("Why 343 m/s?", "It is a common room-temperature approximation for air."),
      f("Do temperature changes matter?", "Yes—speed of sound rises with temperature."),
      f("How does this help mixing rooms?", "Low-frequency wavelengths inform bass trap and mode thinking."),
    ],
  }),
  calc({
    slug: "lighting-lumen-calculator",
    title: "Lighting Lumen Calculator",
    category: LIFE,
    description:
      "Estimate lumens needed from room area and foot-candle targets. Plan brighter, more usable spaces.",
    formulaType: "lightingLumens",
    inputs: [
      i("areaSqFt", "Room Area (sq ft)", 200, 20, 5000, 10),
      i("footCandles", "Target Foot-Candles", 30, 5, 100, 1),
    ],
    intro:
      "Lighting design often starts with target illuminance over area. Multiply square footage by foot-candles to estimate required lumens.",
    howToUse: [
      "Enter room area in square feet.",
      "Set a target foot-candle level for the room’s use.",
      "Review estimated lumen requirement.",
    ],
    faqs: [
      f("What foot-candles for living rooms?", "Often around 10–30 depending on task lighting needs."),
      f("Are fixture losses included?", "This is a starting estimate before fixture efficiency and layout losses."),
      f("Lumens vs watts?", "Lumens measure light output; watts measure power draw."),
    ],
  }),
  calc({
    slug: "plant-watering-schedule-calculator",
    title: "Plant Watering Schedule Calculator",
    category: LIFE,
    description:
      "Estimate watering frequency from soil dry-down days and climate multipliers. Build a practical plant care cadence.",
    formulaType: "plantWatering",
    inputs: [
      i("baseDays", "Base Dry-Down Days", 7, 1, 30, 1),
      i("climateFactor", "Climate Factor", 1, 0.5, 2, 0.1),
      i("plantFactor", "Plant Factor", 1, 0.5, 2, 0.1),
    ],
    intro:
      "Watering schedules depend on plant type and environment. Adjust a base dry-down interval with climate and plant factors to estimate days between waterings.",
    howToUse: [
      "Enter a base number of days between waterings.",
      "Increase climate factor for hotter/drier conditions.",
      "Adjust plant factor for thirstier species and review interval.",
    ],
    faqs: [
      f("Should I water on a fixed calendar only?", "Prefer soil checks—calculators guide, plants confirm."),
      f("Do seasons change factors?", "Yes—reduce watering in dormant seasons for many species."),
      f("What about succulents?", "They often need longer dry-down intervals."),
    ],
  }),
  calc({
    slug: "aquarium-volume-calculator",
    title: "Aquarium Volume Calculator",
    category: LIFE,
    description:
      "Calculate aquarium gallons from length, width, and height. Size filters and stocking with better accuracy.",
    formulaType: "aquariumVolume",
    inputs: [
      i("length", "Length (in)", 48, 6, 120, 1),
      i("width", "Width (in)", 18, 6, 48, 1),
      i("height", "Height (in)", 20, 6, 36, 1),
    ],
    intro:
      "Tank volume drives filtration, heating, and stocking decisions. Compute gallons from rectangular dimensions for aquariums and terrariums.",
    howToUse: [
      "Enter internal length, width, and height in inches.",
      "Review gallons and liters estimates.",
    ],
    faqs: [
      f("Should I use internal dimensions?", "Yes—glass thickness can reduce true water volume."),
      f("Do substrate and décor reduce volume?", "Yes—usable water volume is lower than nominal."),
      f("Is this for cylinders?", "This version is for rectangular tanks."),
    ],
  }),
  calc({
    slug: "paint-coverage-calculator",
    title: "Paint Coverage Calculator",
    category: LIFE,
    description:
      "Estimate paint gallons needed from wall area, coats, and coverage rating. Buy the right amount before painting day.",
    formulaType: "paintCoverage",
    inputs: [
      i("wallArea", "Wall Area (sq ft)", 400, 20, 10000, 10),
      i("coats", "Number of Coats", 2, 1, 4, 1),
      i("coverage", "Coverage per Gallon (sq ft)", 350, 100, 500, 10),
    ],
    intro:
      "Paint purchases are easier when coverage is calculated up front. Estimate gallons from area, coats, and the product’s rated square feet per gallon.",
    howToUse: [
      "Enter total paintable wall area.",
      "Set number of coats.",
      "Enter coverage per gallon and review gallons needed.",
    ],
    faqs: [
      f("Should I subtract windows?", "Yes for accuracy—exclude openings from wall area."),
      f("Do textured walls need more paint?", "Often yes—reduce effective coverage."),
      f("Primer coat counting?", "Count primer separately if using a different product."),
    ],
  }),
  calc({
    slug: "wallpaper-roll-calculator",
    title: "Wallpaper Roll Calculator",
    category: LIFE,
    description:
      "Estimate wallpaper rolls from wall area and roll coverage. Reduce leftover waste and mid-project shortages.",
    formulaType: "wallpaperRolls",
    inputs: [
      i("wallArea", "Wall Area (sq ft)", 280, 20, 5000, 10),
      i("rollCoverage", "Coverage per Roll (sq ft)", 30, 10, 60, 1),
      i("wastePercent", "Waste / Match (%)", 15, 0, 40, 1),
    ],
    intro:
      "Pattern matching creates wallpaper waste beyond raw area math. Estimate rolls needed including a waste percentage for repeats and trimming.",
    howToUse: [
      "Enter total wall area.",
      "Set coverage per roll.",
      "Add waste percentage and review rolls to buy.",
    ],
    faqs: [
      f("Why add waste?", "Repeats, mistakes, and trimming consume extra material."),
      f("Do dye lots matter?", "Yes—buy enough from one lot when possible."),
      f("What about peel-and-stick?", "Use the same area math with product-specific coverage."),
    ],
  }),
  calc({
    slug: "flooring-material-waste-calculator",
    title: "Flooring Material Waste Calculator",
    category: LIFE,
    description:
      "Calculate flooring material needed with waste allowance. Order planks or tile with fewer shortages.",
    formulaType: "flooringWaste",
    inputs: [
      i("roomArea", "Room Area (sq ft)", 320, 20, 10000, 5),
      i("wastePercent", "Waste Percentage (%)", 10, 0, 25, 1),
    ],
    intro:
      "Flooring installs need extra material for cuts and mistakes. Apply a waste percentage to room area to estimate total square footage to order.",
    howToUse: [
      "Enter room area in square feet.",
      "Set waste percentage for your material pattern.",
      "Review total material area to purchase.",
    ],
    faqs: [
      f("How much waste is typical?", "Often 5–15% depending on layout and diagonal installs."),
      f("Should closets be included?", "Yes if they receive the same flooring."),
      f("Do box sizes matter?", "Round up to whole boxes after calculating area."),
    ],
  }),
  calc({
    slug: "moving-box-truck-size-calculator",
    title: "Moving Box and Truck Size Calculator",
    category: LIFE,
    description:
      "Estimate moving truck size from rooms and box counts. Plan move day capacity with less stress.",
    formulaType: "movingTruckSize",
    inputs: [
      i("rooms", "Number of Rooms", 4, 1, 15, 1),
      i("boxes", "Number of Boxes", 40, 0, 500, 5),
      i("cuFtPerRoom", "Cu Ft per Room", 150, 50, 400, 10),
      i("cuFtPerBox", "Cu Ft per Box", 3, 1, 8, 0.5),
    ],
    intro:
      "Truck sizing depends on furniture volume and packed boxes. Estimate cubic feet from rooms and boxes to choose a better moving truck class.",
    howToUse: [
      "Enter number of rooms being moved.",
      "Add packed box count.",
      "Adjust cubic-feet assumptions and review total volume.",
    ],
    faqs: [
      f("Are cubic-feet assumptions exact?", "They are planning averages—large furniture can dominate."),
      f("Should I reserve larger?", "A little extra space is usually cheaper than a second trip."),
      f("Do appliances count as rooms?", "Include bulky items in room volume or add separately."),
    ],
  }),
  calc({
    slug: "holiday-gift-budget-calculator",
    title: "Holiday Gift Budget Calculator",
    category: LIFE,
    description:
      "Allocate a holiday gift budget across recipients evenly or with priorities. Stay festive without overspending.",
    formulaType: "holidayGiftBudget",
    inputs: [
      i("totalBudget", "Total Gift Budget ($)", 600, 20, 20000, 10),
      i("recipients", "Number of Recipients", 8, 1, 50, 1),
      i("reserved", "Already Spent / Reserved ($)", 75, 0, 20000, 5),
    ],
    intro:
      "Gift budgets fail when totals are vague. Divide remaining budget across recipients to set a clear per-person spending target.",
    howToUse: [
      "Enter your total gift budget.",
      "Set number of recipients.",
      "Subtract already spent amounts and review per-person budget.",
    ],
    faqs: [
      f("Should every person get the same amount?", "Not necessarily—use this as an average ceiling."),
      f("Do group gifts count?", "Include your share in reserved or total budget."),
      f("What about shipping?", "Pad the budget for wrapping and shipping costs."),
    ],
  }),
  calc({
    slug: "wedding-seating-arrangement-calculator",
    title: "Wedding Seating Arrangement Calculator",
    category: LIFE,
    description:
      "Estimate tables needed from guest count and seats per table. Plan reception layouts quickly.",
    formulaType: "weddingSeating",
    inputs: [
      i("guests", "Guest Count", 140, 2, 1000, 1),
      i("seatsPerTable", "Seats per Table", 8, 4, 12, 1),
      i("headTableSeats", "Head Table Seats", 8, 0, 20, 1),
    ],
    intro:
      "Reception seating starts with guest count and table capacity. Calculate how many tables you need after reserving head-table seats.",
    howToUse: [
      "Enter confirmed guest count.",
      "Set seats per standard table.",
      "Reserve head-table seats and review tables required.",
    ],
    faqs: [
      f("Should I plan for no-shows?", "Use your confirmed RSVP count plus a small buffer if desired."),
      f("Do kids’ tables differ?", "Yes—adjust seats per table for those layouts."),
      f("What about dance floor space?", "Table count affects floor plan—coordinate with your venue."),
    ],
  }),
  calc({
    slug: "pet-food-portion-calculator",
    title: "Pet Food Portion Calculator",
    category: LIFE,
    description:
      "Estimate daily pet food portions from weight and calories per cup. Support healthier feeding routines.",
    formulaType: "petFoodPortion",
    inputs: [
      i("petWeight", "Pet Weight (lbs)", 40, 1, 200, 1),
      i("caloriesPerLb", "Calories per lb Bodyweight", 20, 10, 40, 1),
      i("caloriesPerCup", "Calories per Cup", 350, 50, 800, 10),
    ],
    intro:
      "Portion control depends on calorie needs and food density. Estimate daily cups from bodyweight calorie guidelines and label calories per cup.",
    howToUse: [
      "Enter your pet’s weight.",
      "Set calorie needs per pound (vet guidance preferred).",
      "Enter food calories per cup and review daily portion.",
    ],
    faqs: [
      f("Is this a veterinary prescription?", "No—use vet advice for medical or weight-loss diets."),
      f("Do puppies differ?", "Growing animals often need different calorie densities."),
      f("Treats count too?", "Yes—include treats in daily calorie totals."),
    ],
  }),
  calc({
    slug: "aquarium-co2-dosage-calculator",
    title: "Aquarium CO2 Dosage Calculator",
    category: LIFE,
    description:
      "Estimate CO2 injection rate targets from tank volume and drop-checker goals. Support planted tank stability.",
    formulaType: "aquariumCo2",
    inputs: [
      i("gallons", "Tank Volume (gal)", 40, 5, 300, 1),
      i("bubbleRate", "Bubbles per Second", 2, 0.5, 10, 0.5),
      i("hours", "Injection Hours / Day", 8, 1, 24, 1),
    ],
    intro:
      "Planted tanks often dose CO2 by bubble rate over photoperiod hours. Estimate daily bubble counts as a starting point before verifying with drop checkers and fish safety.",
    howToUse: [
      "Enter tank volume in gallons.",
      "Set bubbles per second during injection.",
      "Add hours of CO2 injection and review daily totals.",
    ],
    faqs: [
      f("Is bubble rate universal?", "No—diffuser efficiency and sealing change effective concentration."),
      f("Can too much CO2 harm fish?", "Yes—monitor animals and use detectors/drop checkers."),
      f("Should CO2 run at night?", "Usually off when lights are off to avoid pH crashes."),
    ],
  }),
];

console.log("Lifestyle count:", extra.length);
fs.writeFileSync("/tmp/extra_part3.json", JSON.stringify(extra));
