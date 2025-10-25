'use client';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { formatPrice } from '../../types/trading';

export default function PriceChart({ data, timeframe, token }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <div>No price data available</div>
        </div>
      </div>
    );
  }

  // Transform data for recharts
  const chartData = data.map((point, index) => ({
    timestamp: new Date(point.timestamp).getTime(),
    price: point.price,
    volume: point.volume,
    index
  }));

  // Determine if trend is positive
  const firstPrice = chartData[0]?.price || 0;
  const lastPrice = chartData[chartData.length - 1]?.price || 0;
  const isPositive = lastPrice >= firstPrice;

  // Format timestamp based on timeframe
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    switch (timeframe) {
      case '1H':
        return format(date, 'HH:mm');
      case '1D':
        return format(date, 'HH:mm');
      case '1W':
        return format(date, 'MM/dd');
      case '1M':
        return format(date, 'MM/dd');
      case '1Y':
        return format(date, 'MM/yy');
      default:
        return format(date, 'HH:mm');
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-3 shadow-lg">
          <div className="text-white font-semibold">
            {formatPrice(data.price)}
          </div>
          <div className="text-gray-400 text-sm">
            {formatTimestamp(data.timestamp)}
          </div>
          <div className="text-gray-400 text-sm">
            Volume: {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(data.volume)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop 
                offset="5%" 
                stopColor={isPositive ? "#10b981" : "#ef4444"} 
                stopOpacity={0.3}
              />
              <stop 
                offset="95%" 
                stopColor={isPositive ? "#10b981" : "#ef4444"} 
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="timestamp"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={formatTimestamp}
            domain={['dataMin', 'dataMax']}
            type="number"
            scale="time"
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            domain={['dataMin - 50', 'dataMax + 50']}
            orientation="right"
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="price"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth={2}
            fill="url(#colorPrice)"
            dot={false}
            activeDot={{ 
              r: 4, 
              fill: isPositive ? "#10b981" : "#ef4444",
              stroke: '#1e293b',
              strokeWidth: 2
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
