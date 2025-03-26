import React, { useState } from 'react';
import { Plus, Minus, Calculator } from 'lucide-react';

interface Range {
  start: number;
  end: number;
  odds: number;
}

function App() {
  const [ranges, setRanges] = useState<Range[]>([{ start: 1, end: 10, odds: 2 }]);
  const [totalAmount, setTotalAmount] = useState<number>(1000);
  const [winningNumber, setWinningNumber] = useState<number>(5);
  const [results, setResults] = useState<{ allocations: number[], totalReturn: number | null }>({ 
    allocations: [], 
    totalReturn: null 
  });

  const distributeBets = (odds: number[], totalAmount: number): number[] => {
    const rawInvestments = odds.map(odd => (2 * totalAmount) / odd);
    const totalRaw = rawInvestments.reduce((a, b) => a + b, 0);
    return rawInvestments.map(raw => (totalAmount * raw) / totalRaw);
  };

  const calculateTotalReturn = (
    ranges: Range[],
    odds: number[],
    totalAmount: number,
    winningNumber: number,
    allocations: number[]
  ): number => {
    const winningIndex = ranges.findIndex(
      range => winningNumber >= range.start && winningNumber <= range.end
    );
    return winningIndex !== -1 ? allocations[winningIndex] * odds[winningIndex] : 0;
  };

  const addRange = () => {
    const lastRange = ranges[ranges.length - 1];
    const newStart = lastRange ? lastRange.end + 1 : 1;
    setRanges([...ranges, { start: newStart, end: newStart + 9, odds: 2 }]);
  };

  const removeRange = (index: number) => {
    setRanges(ranges.filter((_, i) => i !== index));
  };

  const updateRange = (index: number, field: keyof Range, value: number) => {
    const newRanges = [...ranges];
    newRanges[index] = { ...newRanges[index], [field]: value };
    setRanges(newRanges);
  };

  const calculateResults = () => {
    const odds = ranges.map(range => range.odds);
    const allocations = distributeBets(odds, totalAmount);
    const totalReturn = calculateTotalReturn(
      ranges,
      odds,
      totalAmount,
      winningNumber,
      allocations
    );
    setResults({ allocations, totalReturn });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Betting Calculator</h1>
          
          <div className="space-y-6">
            {ranges.map((range, index) => (
              <div key={index} className="flex gap-4 items-center">
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Start Range
                    </label>
                    <input
                      type="number"
                      value={range.start}
                      onChange={(e) => updateRange(index, 'start', +e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      End Range
                    </label>
                    <input
                      type="number"
                      value={range.end}
                      onChange={(e) => updateRange(index, 'end', +e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Odds
                    </label>
                    <input
                      type="number"
                      value={range.odds}
                      onChange={(e) => updateRange(index, 'odds', +e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {ranges.length > 1 && (
                  <button
                    onClick={() => removeRange(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Minus size={20} />
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={addRange}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Plus size={20} />
              Add Range
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Total Amount
              </label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(+e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Winning Number
              </label>
              <input
                type="number"
                value={winningNumber}
                onChange={(e) => setWinningNumber(+e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={calculateResults}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Calculator size={20} />
            Calculate
          </button>
        </div>

        {results.allocations.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Results</h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Investment Split:</h3>
              {ranges.map((range, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">
                    Range {range.start}-{range.end}:
                  </span>
                  <span className="font-medium">
                    ${results.allocations[index]?.toFixed(2)}
                  </span>
                </div>
              ))}
              
              <div className="pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Return:</span>
                  <span className="text-blue-600">
                    ${results.totalReturn?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;