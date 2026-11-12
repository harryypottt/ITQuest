import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { SkillDistribution } from '@/sampleData/dashboardData';

interface SkillDistributionChartProps {
  data: SkillDistribution[];
}

export default function SkillDistributionChart({ data }: SkillDistributionChartProps) {
  const total = data.reduce((sum, d) => sum + d.percentage, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="p-5 md:p-6 rounded-xl bg-quest-card border border-quest-border"
    >
      <h2 className="text-base font-bold text-quest-text mb-4 flex items-center gap-2">
        <i className="ri-pie-chart-2-line text-quest-primary" />
        Skill Distribution
      </h2>

      <div className="h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="percentage"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#16161e',
                border: '1px solid #2a2a3a',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#f1f5f9',
              }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2 pt-3 border-t border-quest-border">
        {data.filter((d) => d.percentage > 0).map((item) => (
          <div key={item.category} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-quest-textDim truncate">{item.label}</span>
            <span className="text-xs text-quest-textMuted ml-auto">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}