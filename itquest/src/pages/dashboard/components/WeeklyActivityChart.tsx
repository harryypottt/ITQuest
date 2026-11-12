import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { weeklyActivityData } from '@/sampleData/dashboardData';

type WeeklyActivityDay = (typeof weeklyActivityData)[number];

interface WeeklyActivityChartProps {
  data: WeeklyActivityDay[];
}

export default function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="p-5 md:p-6 rounded-xl bg-quest-card border border-quest-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-quest-text flex items-center gap-2">
          <i className="ri-bar-chart-2-line text-quest-primary" />
          Weekly Activity
        </h2>
        <span className="text-xs text-quest-textDim">This Week</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={20} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#16161e',
                border: '1px solid #2a2a3a',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#f1f5f9',
              }}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              dataKey="lessonsCompleted"
              name="Lessons"
              stackId="a"
              fill="#10b981"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="quizzesTaken"
              name="Quizzes"
              stackId="a"
              fill="#8b5cf6"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="codingChallenges"
              name="Coding"
              stackId="a"
              fill="#06b6d4"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend summary */}
      <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-quest-border">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-quest-textDim">Lessons</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
          <span className="text-xs text-quest-textDim">Quizzes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
          <span className="text-xs text-quest-textDim">Coding</span>
        </div>
      </div>
    </motion.div>
  );
}