import { useEffect, useState } from 'react';

const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500',
    'bg-lime-500', 'bg-emerald-500', 'bg-rose-500', 'bg-fuchsia-500', 'bg-violet-500',
    'bg-amber-500', 'bg-sky-500', 'bg-green-600', 'bg-blue-600', 'bg-red-600'
];

export default function ProgressBar({ title, target, current, index }) {
    console.log("target", target)
    console.log("current", current)

    const percentage = Math.min((current / target) * 100, 100); 
    const [fillWidth, setFillWidth] = useState(0);
    const barColor = colors[index % colors.length];

    useEffect(() => {
        setTimeout(() => setFillWidth(percentage), 100);
    }, [percentage]);

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between mb-2">
                <span className="text-lg font-semibold text-gray-800">{title}</span>
                <span className="text-sm font-medium text-gray-600">{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className={`${barColor} h-3 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${fillWidth}%` }}
                ></div>
            </div>
            <div className="text-sm text-gray-500 mt-2 font-medium">
                {current} / {target}
            </div>
        </div>
    );
}