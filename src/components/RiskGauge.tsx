interface RiskGaugeProps {
  score: number;
  title?: string;
}

export const RiskGauge = ({ score, title = 'Network Risk Score' }: RiskGaugeProps) => {
  const getColor = (score: number) => {
    if (score < 30) return { bg: 'bg-green-500', text: 'text-green-600', label: 'Low Risk' };
    if (score < 60) return { bg: 'bg-yellow-500', text: 'text-yellow-600', label: 'Medium Risk' };
    return { bg: 'bg-red-500', text: 'text-red-600', label: 'High Risk' };
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={color.text}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">{score}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">/ 100</span>
          </div>
        </div>
        <div className="mt-4">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${color.bg} text-white`}>
            {color.label}
          </span>
        </div>
      </div>
    </div>
  );
};
