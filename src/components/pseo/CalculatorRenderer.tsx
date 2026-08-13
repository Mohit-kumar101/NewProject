"use client";

import { AiAgentRoiCalculator } from "@/components/pseo/AiAgentRoiCalculator";
import {
  BcPttFirstTimeBuyerCalculator,
  BcStatHolidayPayCalculator,
  BcUsedCarPstCalculator,
} from "@/components/pseo/BcTaxCalculators";
import { ContractorVsEmployeeCalculator } from "@/components/pseo/ContractorVsEmployeeCalculator";
import { HiringCostCalculator } from "@/components/pseo/HiringCostCalculator";
import { MeetingCostCalculator } from "@/components/pseo/MeetingCostCalculator";
import {
  EngineerTurnoverCalculator,
  ProratedPtoCalculator,
  RestaurantLaborCalculator,
  SoloDevRateCalculator,
  TimeAndHalfOvertimeCalculator,
} from "@/components/pseo/RemainingHrCalculators";
import { SaasRunwayCalculator } from "@/components/pseo/SaasRunwayCalculator";
import {
  DropshippingRoasCalculator,
  Mt4UsdJpyLotCalculator,
  PmVsDowntimeCalculator,
  WarehousePickerCalculator,
  YoutubeRpmCalculator,
} from "@/components/pseo/SpecializedCalculators";

export function CalculatorRenderer({ id }: { id: string }) {
  switch (id) {
    case "saas-net-burn-runway":
      return <SaasRunwayCalculator />;
    case "engineering-meeting-cost":
      return <MeetingCostCalculator />;
    case "ai-support-roi":
      return <AiAgentRoiCalculator />;
    case "1099-vs-w2-true-cost":
      return <ContractorVsEmployeeCalculator />;
    case "cost-to-hire-developer":
      return <HiringCostCalculator />;
    case "engineer-turnover-replacement":
      return <EngineerTurnoverCalculator />;
    case "prorated-pto-accrual":
      return <ProratedPtoCalculator />;
    case "time-and-half-overtime":
      return <TimeAndHalfOvertimeCalculator />;
    case "restaurant-shift-labor":
      return <RestaurantLaborCalculator />;
    case "solo-dev-minimum-rate":
      return <SoloDevRateCalculator />;
    case "bc-used-car-pst-black-book":
      return <BcUsedCarPstCalculator />;
    case "bc-ptt-first-time-buyer-2026":
      return <BcPttFirstTimeBuyerCalculator />;
    case "bc-stat-holiday-pay":
      return <BcStatHolidayPayCalculator />;
    case "mt4-usd-jpy-lot-risk":
      return <Mt4UsdJpyLotCalculator />;
    case "warehouse-picker-lph":
      return <WarehousePickerCalculator />;
    case "faceless-youtube-rpm-breakeven":
      return <YoutubeRpmCalculator />;
    case "dropshipping-breakeven-roas":
      return <DropshippingRoasCalculator />;
    case "pm-vs-downtime-cost":
      return <PmVsDowntimeCalculator />;
    default:
      return (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-10 text-center sm:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
            Interactive calculator
          </p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
            Formula live — inputs shipping next
          </p>
        </div>
      );
  }
}
