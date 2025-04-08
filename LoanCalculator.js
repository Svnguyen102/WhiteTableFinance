const { useState } = React;

function LoanCalculator() {
  const [price, setPrice] = useState('');
  const [down, setDown] = useState('');
  const [rate, setRate] = useState('');
  const [term, setTerm] = useState('');
  const [tax, setTax] = useState('');
  const [insurance, setInsurance] = useState('');
  const [hoa, setHoa] = useState('');
  const [pmiRate, setPmiRate] = useState(0.5);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [monthly, setMonthly] = useState(null);
  const [showPMI, setShowPMI] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Function to calculate the loan payment and other values
  const calculate = () => {
    const loanAmount = price - down;
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;
    let pmiMonthly = 0;

    // Check if PMI is needed
    if (price > 0 && down / price < 0.2) {
      setShowPMI(true);
      const annualPMI = loanAmount * (pmiRate / 100);
      pmiMonthly = annualPMI / 12;
    } else {
      setShowPMI(false);
    }

    if (loanAmount > 0 && monthlyRate > 0 && numberOfPayments > 0) {
      const basePayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
      const taxMonthly = tax ? +tax / 12 : 0;
      const insuranceMonthly = insurance ? +insurance / 12 : 0;
      const hoaMonthly = hoa ? +hoa : 0;
      const totalPayment = basePayment + taxMonthly + insuranceMonthly + hoaMonthly + pmiMonthly;
      setMonthly(totalPayment.toFixed(2));

      // Amortization schedule
      const scheduleArray = [];
      let balance = loanAmount;

      for (let i = 1; i <= numberOfPayments; i++) {
        const interest = balance * monthlyRate;
        const principal = basePayment - interest;
        balance -= principal;
        scheduleArray.push({
          month: i,
          payment: basePayment.toFixed(2),
          interest: interest.toFixed(2),
          principal: principal.toFixed(2),
          balance: balance > 0 ? balance.toFixed(2) : '0.00'
        });
        if (balance <= 0) break;
      }

      // Bar chart data
      const chartInfo = [
        { name: 'Principal & Interest', value: parseFloat(basePayment.toFixed(2)) },
        { name: 'PMI', value: parseFloat(pmiMonthly.toFixed(2)) },
        { name: 'Taxes', value: parseFloat(taxMonthly.toFixed(2)) },
        { name: 'Insurance', value: parseFloat(insuranceMonthly.toFixed(2)) },
        { name: 'HOA', value: parseFloat(hoaMonthly.toFixed(2)) }
      ];

      console.log("Chart data:", chartInfo);
      setSchedule(scheduleArray);
      setChartData(chartInfo);
    } else {
      setMonthly(null);
      setSchedule([]);
      setChartData([]);
    }
  };

  return (
    <div className="transition-colors duration-300 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 transition-colors duration-300">
        <h2 className="text-2xl font-semibold mb-4">Loan Calculator</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input type="number" placeholder="Home Price" value={price} onChange={e => setPrice(+e.target.value)} className="w-full p-4 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"/>
          <input type="number" placeholder="Down Payment" value={down} onChange={e => setDown(+e.target.value)} className="w-full p-4 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"/>
          <input type="number" placeholder="Interest Rate (%)" value={rate} onChange={e => setRate(+e.target.value)} className="w-full p-4 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"/>
          <input type="number" placeholder="Loan Term (years)" value={term} onChange={e => setTerm(+e.target.value)} className="w-full p-4 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"/>
        </div>

        <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-yellow-600 hover:underline mb-4 block text-lg">
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input type="number" placeholder="Annual Property Tax ($)" value={tax} onChange={e => setTax(e.target.value)} className="w-full p-4 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"/>
            <input type="number" placeholder="Annual Insurance ($)" value={insurance} onChange={e => setInsurance(e.target.value)} className="w-full p-4 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"/>
            <input type="number" placeholder="Monthly HOA Fee ($)" value={hoa} onChange={e => setHoa(e.target.value)} className="w-full p-4 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"/>
            {showPMI && (
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">PMI Rate (%)</label>
                <input type="number" value={pmiRate} onChange={e => setPmiRate(e.target.value)} className="w-full p-4 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"/>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">PMI is added because your down payment is less than 20%.</p>
              </div>
            )}
          </div>
        )}

        <button onClick={calculate} className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg transition-colors duration-300 mb-8">
          🧮 Calculate
        </button>

        {monthly && (
          <div>
            <p className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-4">
              Estimated Monthly Payment: <span className="text-yellow-600 dark:text-yellow-400">${monthly}</span>
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); }} className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white px-6 py-3 rounded-lg">Copy Link</button>
              <button onClick={() => { const csv = `Month,Payment,Interest,Principal,Balance\n${schedule.map(row => `${row.month},${row.payment},${row.interest},${row.principal},${row.balance}`).join('\n')}`; const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.setAttribute('download', 'amortization_schedule.csv'); document.body.appendChild(link); link.click(); }} className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white px-6 py-3 rounded-lg">Download CSV</button>
            </div>

            {showSchedule && (
              <div className="mt-8 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow">
                <table className="w-full text-md text-left border-collapse">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <tr>
                      <th className="p-4">Month</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Interest</th>
                      <th className="p-4">Principal</th>
                      <th className="p-4">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((row) => (
                      <tr key={row.month} className="even:bg-gray-50 dark:even:bg-gray-800">
                        <td className="p-4">{row.month}</td>
                        <td className="p-4">${row.payment}</td>
                        <td className="p-4">${row.interest}</td>
                        <td className="p-4">${row.principal}</td>
                        <td className="p-4">${row.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {chartData.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
                  Monthly Payment Breakdown
                </h3>
                <div className="h-[350px] bg-white dark:bg-gray-900 rounded-lg p-4 shadow border border-gray-100 dark:border-gray-700">
                  <ResponsiveContainer width="100%" height="500px">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Bar dataKey="value" fill="#facc15" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<LoanCalculator />, document.getElementById('loan-calculator-container'));
