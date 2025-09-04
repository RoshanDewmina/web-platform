"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Calculator, 
  TrendingUp, 
  DollarSign,
  Zap,
  Info
} from "lucide-react";

interface CalculationResults {
  paybackPeriod: number;
  totalSavings: number;
  roi: number;
  monthlyBillReduction: number;
}

export function PaybackCalculator() {
  const [systemSize, setSystemSize] = useState(100); // kW
  const [costPerKW, setCostPerKW] = useState(2500); // $/kW
  const [currentMonthlyBill, setCurrentMonthlyBill] = useState(5000); // $
  const [electricityRate, setElectricityRate] = useState(0.12); // $/kWh
  const [solarProduction, setSolarProduction] = useState(1200); // kWh/kW/year
  const [incentives, setIncentives] = useState(30); // % of system cost
  
  const [results, setResults] = useState<CalculationResults | null>(null);

  const calculate = () => {
    // System cost calculations
    const totalSystemCost = systemSize * costPerKW;
    const incentiveAmount = (totalSystemCost * incentives) / 100;
    const netSystemCost = totalSystemCost - incentiveAmount;
    
    // Energy production and savings
    const annualProduction = systemSize * solarProduction;
    const annualSavings = annualProduction * electricityRate;
    const monthlyBillReduction = annualSavings / 12;
    
    // Financial metrics
    const paybackPeriod = netSystemCost / annualSavings;
    const twentyYearSavings = (annualSavings * 20) - netSystemCost;
    const roi = (twentyYearSavings / netSystemCost) * 100;
    
    setResults({
      paybackPeriod,
      totalSavings: twentyYearSavings,
      roi,
      monthlyBillReduction
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Solar Payback Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* System Size */}
          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              System Size
              <span className="text-sm font-normal text-muted-foreground">
                {systemSize} kW
              </span>
            </Label>
            <Slider
              value={[systemSize]}
              onValueChange={(value) => setSystemSize(value[0])}
              min={10}
              max={500}
              step={10}
            />
            <p className="text-xs text-muted-foreground">
              Typical range: 10-500 kW for community projects
            </p>
          </div>

          {/* Cost per kW */}
          <div className="space-y-2">
            <Label htmlFor="cost-per-kw">
              Cost per kW installed
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="cost-per-kw"
                type="number"
                value={costPerKW}
                onChange={(e) => setCostPerKW(Number(e.target.value))}
                className="pl-9"
              />
            </div>
          </div>

          {/* Current Monthly Bill */}
          <div className="space-y-2">
            <Label htmlFor="monthly-bill">
              Current Monthly Electricity Bill
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="monthly-bill"
                type="number"
                value={currentMonthlyBill}
                onChange={(e) => setCurrentMonthlyBill(Number(e.target.value))}
                className="pl-9"
              />
            </div>
          </div>

          {/* Electricity Rate */}
          <div className="space-y-2">
            <Label htmlFor="electricity-rate">
              Electricity Rate ($/kWh)
            </Label>
            <div className="relative">
              <Zap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="electricity-rate"
                type="number"
                step="0.01"
                value={electricityRate}
                onChange={(e) => setElectricityRate(Number(e.target.value))}
                className="pl-9"
              />
            </div>
          </div>

          {/* Solar Production */}
          <div className="space-y-2">
            <Label htmlFor="solar-production">
              Annual Solar Production (kWh/kW/year)
            </Label>
            <Input
              id="solar-production"
              type="number"
              value={solarProduction}
              onChange={(e) => setSolarProduction(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Ontario average: 1,100-1,300 kWh/kW/year
            </p>
          </div>

          {/* Incentives */}
          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              Grants & Incentives
              <span className="text-sm font-normal text-muted-foreground">
                {incentives}% of system cost
              </span>
            </Label>
            <Slider
              value={[incentives]}
              onValueChange={(value) => setIncentives(value[0])}
              min={0}
              max={100}
              step={5}
            />
          </div>

          <Button onClick={calculate} className="w-full" size="lg">
            Calculate Payback
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Payback Period</span>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">
                  {results.paybackPeriod.toFixed(1)} years
                </div>
              </div>

              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">20-Year Net Savings</span>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(results.totalSavings)}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Return on Investment</span>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {results.roi.toFixed(0)}%
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Bill Reduction</span>
                  <Zap className="h-4 w-4 text-slate-600" />
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(results.monthlyBillReduction)}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-semibold mb-1">Important Note:</p>
                  <p>
                    This is a simplified calculation for educational purposes. 
                    Actual payback periods depend on many factors including 
                    maintenance costs, electricity rate changes, system degradation, 
                    and specific site conditions.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
