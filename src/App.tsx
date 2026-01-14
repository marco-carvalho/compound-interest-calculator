import React, { useState, useMemo } from "react";
import InputComponent from "./components/InputComponent";
import SelectComponent from "./components/SelectComponent";
import moment from "moment";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Position {
  date: Date;
  partialBalance: number;
  monthlyContribution: number;
  annualContribution?: number;
}

const CompoundInterestCalculator: React.FC = () => {
  const [initialValue, setInitialValue] = useState<number>(1000000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(10000);
  const [annualMonthlyContributionAdjustment, setAnnualMonthlyContributionAdjustment] = useState<number>(0.1);
  const [annualContribution, setAnnualContribution] = useState<number>(0);
  const [annualContributionMonth, setAnnualContributionMonth] = useState<number>(2);
  const [annualYearlyContributionAdjustment, setAnnualYearlyContributionAdjustment] = useState<number>(0.1);
  const [monthlyReturn, setMonthlyReturn] = useState<number>(0.01);
  const [annualReturn, setAnnualReturn] = useState<number>(0.12682503013196977);
  const [termInMonths, setTermInMonths] = useState<number>(120);
  const [termInYears, setTermInYears] = useState<number>(10);
  const [viewMode, setViewMode] = useState<"table" | "graph">("table");

  const formatToCurrency = (value: number | null) => {
    if (!value) {
      return null;
    }
    return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
  };

  const positions = useMemo(() => {
    const positions: Position[] = [];
    positions.push({
      date: new Date(),
      partialBalance: initialValue,
      monthlyContribution: monthlyContribution,
      annualContribution: 0,
    });
    for (let i = 0; i < termInMonths; i++) {
      const date = moment(positions[i].date).add(1, "M").toDate();
      const partialBalance = (positions[i].partialBalance + positions[i].monthlyContribution + (positions[i].annualContribution || 0)) * (1 + monthlyReturn);
      let currentMonthlyContribution: number;
      if (moment(positions[i].date).year() === moment(date).year()) {
        currentMonthlyContribution = positions[i].monthlyContribution;
      } else {
        currentMonthlyContribution = positions[i].monthlyContribution * (1 + annualMonthlyContributionAdjustment);
      }
      const position: Position = {
        date,
        partialBalance,
        monthlyContribution: currentMonthlyContribution,
      };
      if (annualContribution > 0 && moment(date).month() === annualContributionMonth) {
        position.annualContribution = annualContribution;
      }
      positions.push(position);
    }
    return positions;
  }, [
    initialValue,
    monthlyContribution,
    annualMonthlyContributionAdjustment,
    annualContribution,
    annualContributionMonth,
    monthlyReturn,
    termInMonths,
  ]);

  return (
    <div className="container mx-auto">
      <div className="text-center uppercase font-bold text-2xl">Compound Interest Calculator</div>
      <hr />
      <div className="mb-4">
        <InputComponent
          label="Initial Value (in $)"
          value={initialValue}
          onChange={(e) => setInitialValue(Number(e.target.value))}
          type="number"
          placeholder="e.g.: 15000"
          step="1000"
        />
      </div>
      <div className="flex -mx-2">
        <div className="px-2 mb-4 w-3/4">
          <InputComponent
            label="Monthly Contribution (in $)"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            type="number"
            placeholder="e.g.: 2200"
            step="100"
          />
        </div>
        <div className="px-2 mb-4 w-1/4">
          <InputComponent
            label="Annual Monthly Contribution Adjustment"
            value={annualMonthlyContributionAdjustment}
            onChange={(e) => setAnnualMonthlyContributionAdjustment(Number(e.target.value))}
            type="number"
            placeholder="e.g.: 0.1"
            step="0.1"
          />
        </div>
      </div>
      <div className="flex -mx-2">
        <div className="px-2 mb-4 w-1/3">
          <InputComponent
            label="Annual Contribution (in $)"
            value={annualContribution}
            onChange={(e) => setAnnualContribution(Number(e.target.value))}
            type="number"
            placeholder="e.g.: 100000"
            step="1000"
          />
        </div>
        <div className="px-2 mb-4 w-1/3">
          <SelectComponent
            label="Annual Contribution Month"
            value={annualContributionMonth}
            onChange={(e) => setAnnualContributionMonth(Number(e.target.value))}
            options={Array.from({ length: 12 }, (_, i) => moment().locale('en').month(i).format("MMMM"))}
            disabled={annualContribution === 0}
          />
        </div>
        <div className="px-2 mb-4 w-1/3">
          <InputComponent
            label="Annual Yearly Contribution Adjustment"
            value={annualYearlyContributionAdjustment}
            onChange={(e) => setAnnualYearlyContributionAdjustment(Number(e.target.value))}
            type="number"
            placeholder="e.g.: 0.1"
            step="0.1"
            disabled={annualContribution === 0}
          />
        </div>
      </div>
      <div className="flex -mx-2">
        <div className="px-2 mb-4 w-1/2">
          <InputComponent
            label="Return (monthly)"
            value={monthlyReturn}
            onChange={(e) => {
              const value = Number(e.target.value);
              setMonthlyReturn(value);
              setAnnualReturn(Math.pow(1 + value, 12) - 1);
            }}
            type="number"
            placeholder="e.g.: 0.005"
            step="0.001"
          />
        </div>
        <div className="px-2 mb-4 w-1/2">
          <InputComponent
            label="Return (annual)"
            value={annualReturn}
            onChange={(e) => {
              const value = Number(e.target.value);
              setAnnualReturn(value);
              setMonthlyReturn(Math.pow(1 + value, 1 / 12) - 1);
            }}
            type="number"
            placeholder="e.g.: 0.06"
            step="0.01"
          />
        </div>
      </div>
      <div className="flex -mx-2">
        <div className="px-2 mb-4 w-1/2">
          <InputComponent
            label="Term (in months)"
            value={termInMonths}
            onChange={(e) => {
              const value = Number(e.target.value);
              setTermInMonths(value);
              setTermInYears(Number((value / 12).toFixed(2)));
            }}
            type="number"
            placeholder="e.g.: 108"
          />
        </div>
        <div className="px-2 mb-4 w-1/2">
          <InputComponent
            label="Term (in years)"
            value={termInYears}
            onChange={(e) => {
              const value = Number(e.target.value);
              setTermInYears(value);
              setTermInMonths(Number((value * 12).toFixed(0)));
            }}
            type="number"
            placeholder="e.g.: 9"
            step="0.5"
          />
        </div>
      </div>
      <div className="flex border-b border-gray-300 mb-6">
        <button
          className={`flex-1 py-3 font-bold focus:outline-none transition-colors ${
            viewMode === "table"
              ? "border-b-4 border-green-500 text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setViewMode("table")}
        >
          Table
        </button>
        <button
          className={`flex-1 py-3 font-bold focus:outline-none transition-colors ${
            viewMode === "graph"
              ? "border-b-4 border-orange-500 text-orange-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setViewMode("graph")}
        >
          Chart
        </button>
      </div>
      {positions.length > 0 && viewMode === "table" && (
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b border-black">
              <th className="text-center">Date</th>
              <th className="text-right">Partial Balance</th>
              <th className="text-right">Monthly Contribution</th>
              {annualContribution > 0 && <th className="text-right">Annual Contribution</th>}
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <tr
                key={index}
                className={`border-b hover:bg-gray-400 ${index % 2 === 0 ? "bg-gray-200" : "bg-white"}`}
              >
                <td className="text-center lowercase">{moment(position.date).locale('en').format("MMM/YY")}</td>
                <td className="text-right">{formatToCurrency(position.partialBalance)}</td>
                <td className="text-right">{formatToCurrency(position.monthlyContribution)}</td>
                {annualContribution > 0 && <td className="text-right">{formatToCurrency(position.annualContribution ?? null)}</td>}
                <td className="text-right">
                  {formatToCurrency(position.partialBalance + position.monthlyContribution + (position.annualContribution || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {positions.length > 0 && viewMode === "graph" && (
        <div className="w-full h-96 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={positions.map((position) => ({
                date: moment(position.date).locale('en').format("MMM/YY"),
                total: position.partialBalance + position.monthlyContribution + (position.annualContribution || 0),
                partialBalance: position.partialBalance,
                monthlyContribution: position.monthlyContribution,
                annualContribution: position.annualContribution || 0,
              }))}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tickFormatter={(value) => `$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number | undefined) => value ? formatToCurrency(value) : null}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#10b981"
                strokeWidth={3}
                name="Total"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CompoundInterestCalculator;
