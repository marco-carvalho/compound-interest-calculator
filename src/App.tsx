import React, { useState, useMemo, useEffect, useRef } from "react";
import InputComponent from "./components/InputComponent";
import SelectComponent from "./components/SelectComponent";
import moment from "moment";

interface Position {
  date: Date;
  partialBalance: number;
  monthlyContribution: number;
  annualContribution?: number;
}

const CompoundInterestCalculator: React.FC = () => {
  const [initialValue, setInitialValue] = useState<number>(1000000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(10000);
  const [
    annualMonthlyContributionAdjustment,
    setAnnualMonthlyContributionAdjustment,
  ] = useState<number>(0.1);
  const [annualContribution, setAnnualContribution] = useState<number>(0);
  const [annualContributionMonth, setAnnualContributionMonth] =
    useState<number>(2);
  const [
    annualYearlyContributionAdjustment,
    setAnnualYearlyContributionAdjustment,
  ] = useState<number>(0.1);
  const [monthlyReturn, setMonthlyReturn] = useState<number>(0.01);
  const [annualReturn, setAnnualReturn] = useState<number>(0.12682503013196977);
  const [termInMonths, setTermInMonths] = useState<number>(120);
  const [termInYears, setTermInYears] = useState<number>(10);

  const [isDark, setIsDark] = useState<boolean>(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isDrawerClosing, setIsDrawerClosing] = useState<boolean>(false);
  const [drawerAnimateOpen, setDrawerAnimateOpen] = useState<boolean>(false);
  const isClosingRef = useRef(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem(
      "compound-interest-calculator-theme",
      isDark ? "dark" : "light",
    );
  }, [isDark]);

  const isDrawerVisible = isDrawerOpen || isDrawerClosing;

  useEffect(() => {
    if (isDrawerOpen && !isDrawerClosing) {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setDrawerAnimateOpen(true));
      });
      return () => cancelAnimationFrame(id);
    }
    if (!isDrawerOpen) {
      const id = requestAnimationFrame(() => setDrawerAnimateOpen(false));
      return () => cancelAnimationFrame(id);
    }
  }, [isDrawerOpen, isDrawerClosing]);

  const finishClosingDrawer = () => {
    isClosingRef.current = false;
    setIsDrawerOpen(false);
    setIsDrawerClosing(false);
  };

  const closeDrawer = () => {
    if (isDrawerClosing) return;
    isClosingRef.current = true;
    setIsDrawerClosing(true);
    setDrawerAnimateOpen(false);
  };

  const handleDrawerTransitionEnd = (e: React.TransitionEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    if (!isClosingRef.current) return;
    finishClosingDrawer();
  };

  const formatToCurrency = (value: number | null) => {
    if (!value) {
      return null;
    }
    return value.toLocaleString(navigator.language, {
      notation: "compact",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
      const partialBalance =
        (positions[i].partialBalance +
          positions[i].monthlyContribution +
          (positions[i].annualContribution || 0)) *
        (1 + monthlyReturn);
      let currentMonthlyContribution: number;
      if (moment(positions[i].date).year() === moment(date).year()) {
        currentMonthlyContribution = positions[i].monthlyContribution;
      } else {
        currentMonthlyContribution =
          positions[i].monthlyContribution *
          (1 + annualMonthlyContributionAdjustment);
      }
      const position: Position = {
        date,
        partialBalance,
        monthlyContribution: currentMonthlyContribution,
      };
      if (
        annualContribution > 0 &&
        moment(date).month() === annualContributionMonth
      ) {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-mono">
      <div className="container mx-auto px-4 py-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="uppercase font-bold text-2xl text-gray-900 dark:text-gray-100">
            Compound Interest Calculator
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDark ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() =>
                drawerAnimateOpen
                  ? closeDrawer()
                  : !isDrawerClosing && setIsDrawerOpen(true)
              }
              disabled={isDrawerClosing}
              className="flex items-center justify-center p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 disabled:opacity-60 disabled:pointer-events-none"
              title={drawerAnimateOpen ? "Close options" : "Open options"}
              aria-label={drawerAnimateOpen ? "Close options" : "Open options"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        {isDrawerVisible && (
          <>
            <div
              className={`fixed inset-0 bg-black/20 dark:bg-black/40 z-20 transition-opacity duration-300 ease-out ${
                drawerAnimateOpen ? "opacity-100" : "opacity-0"
              } ${!drawerAnimateOpen ? "pointer-events-none" : ""}`}
              aria-hidden
              onClick={() => !isDrawerClosing && closeDrawer()}
            />
            <aside
              className={`fixed top-0 right-0 h-dvh w-full max-w-xs bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-950/50 z-30 flex flex-col overflow-hidden transition-transform duration-300 ease-out ${
                drawerAnimateOpen ? "translate-x-0" : "translate-x-full"
              }`}
              aria-label="Options"
              onTransitionEnd={handleDrawerTransitionEnd}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Options
                </span>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                  title="Close"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                <div className="px-4 py-4">
                  <InputComponent
                    label="Initial Value (in $)"
                    value={initialValue}
                    onChange={(e) => setInitialValue(Number(e.target.value))}
                    type="number"
                    placeholder="e.g.: 15000"
                    step="1000"
                  />
                </div>

                <div className="px-4 py-4 space-y-3">
                  <h3 className="font-extrabold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                    Monthly Contribution
                  </h3>
                  <InputComponent
                    label="Value (in $)"
                    value={monthlyContribution}
                    onChange={(e) =>
                      setMonthlyContribution(Number(e.target.value))
                    }
                    type="number"
                    placeholder="e.g.: 2200"
                    step="100"
                  />
                  <InputComponent
                    label="Annual Adjustment"
                    value={annualMonthlyContributionAdjustment}
                    onChange={(e) =>
                      setAnnualMonthlyContributionAdjustment(
                        Number(e.target.value),
                      )
                    }
                    type="number"
                    placeholder="e.g.: 0.1"
                    step="0.1"
                  />
                </div>

                <div className="px-4 py-4 space-y-3">
                  <h3 className="font-extrabold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                    Annual Contribution
                  </h3>
                  <InputComponent
                    label="Value (in $)"
                    value={annualContribution}
                    onChange={(e) =>
                      setAnnualContribution(Number(e.target.value))
                    }
                    type="number"
                    placeholder="e.g.: 100000"
                    step="1000"
                  />
                  <SelectComponent
                    label="Month"
                    value={annualContributionMonth}
                    onChange={(e) =>
                      setAnnualContributionMonth(Number(e.target.value))
                    }
                    options={Array.from({ length: 12 }, (_, i) =>
                      moment().locale(navigator.language).month(i).format("MMMM"),
                    )}
                    disabled={annualContribution === 0}
                  />
                  <InputComponent
                    label="Annual Adjustment"
                    value={annualYearlyContributionAdjustment}
                    onChange={(e) =>
                      setAnnualYearlyContributionAdjustment(
                        Number(e.target.value),
                      )
                    }
                    type="number"
                    placeholder="e.g.: 0.1"
                    step="0.1"
                    disabled={annualContribution === 0}
                  />
                </div>

                <div className="px-4 py-4 space-y-3">
                  <h3 className="font-extrabold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                    Return
                  </h3>
                  <InputComponent
                    label="Monthly"
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
                  <InputComponent
                    label="Annual"
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

                <div className="px-4 py-4 space-y-3">
                  <h3 className="font-extrabold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                    Term
                  </h3>
                  <InputComponent
                    label="Months"
                    value={termInMonths}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setTermInMonths(value);
                      setTermInYears(Number((value / 12).toFixed(2)));
                    }}
                    type="number"
                    placeholder="e.g.: 108"
                  />
                  <InputComponent
                    label="Years"
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
            </aside>
          </>
        )}

        {positions.length > 0 && (
          <table className="table-auto w-full text-gray-900 dark:text-gray-100">
            <thead>
              <tr className="border-b border-black dark:border-gray-500">
                <th className="text-center px-3">Date</th>
                <th className="text-right px-3">Partial Balance</th>
                <th className="text-right px-3">Monthly Contribution</th>
                {annualContribution > 0 && (
                  <th className="text-right px-3">Annual Contribution</th>
                )}
                <th className="text-right px-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 ${index % 2 === 0 ? "bg-gray-200 dark:bg-gray-800" : "bg-white dark:bg-gray-900"}`}
                >
                  <td className="text-center lowercase px-3">
                    {moment(position.date).locale(navigator.language).format("MMM/YY")}
                  </td>
                  <td className="text-right px-3">
                    {formatToCurrency(position.partialBalance)}
                  </td>
                  <td className="text-right px-3">
                    {formatToCurrency(position.monthlyContribution)}
                  </td>
                  {annualContribution > 0 && (
                    <td className="text-right px-3">
                      {formatToCurrency(position.annualContribution ?? null)}
                    </td>
                  )}
                  <td className="text-right px-3">
                    {formatToCurrency(
                      position.partialBalance +
                        position.monthlyContribution +
                        (position.annualContribution || 0),
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;
