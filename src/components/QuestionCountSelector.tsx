import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuestionCountSelectorProps {
  totalQuestions: number;
  onSelect: (count: number) => void;
  onCancel: () => void;
}

export function QuestionCountSelector({ totalQuestions, onSelect, onCancel }: QuestionCountSelectorProps) {
  const [selectedCount, setSelectedCount] = React.useState(30);
  const [customCount, setCustomCount] = React.useState('');

  const presetCounts = [20, 30, 50];
  if (totalQuestions > 50) {
    presetCounts.push(totalQuestions);
  }

  const handleSelect = () => {
    const count = customCount ? parseInt(customCount) : selectedCount;
    if (count > 0 && count <= totalQuestions) {
      onSelect(count);
    }
  };

  const handleCustomChange = (value: string) => {
    const num = parseInt(value);
    if (!value || (num > 0 && num <= totalQuestions)) {
      setCustomCount(value);
      if (num) setSelectedCount(num);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card className="bg-gradient-card-dark glass-dark border-slate-700/50">
          <CardHeader className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-b border-slate-600/30">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              Select Number of Questions
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                <ListChecks className="h-4 w-4 text-green-400" />
                <span className="text-green-300 text-sm font-medium">
                  {totalQuestions} Questions Found
                </span>
              </div>
              <p className="text-slate-300 text-sm">
                How many questions would you like in your practice test?
              </p>
            </div>

            {/* Preset buttons */}
            <div className="space-y-3">
              <label className="text-sm text-slate-400 font-medium">Quick Select:</label>
              <div className="grid grid-cols-2 gap-3">
                {presetCounts.map((count) => (
                  <Button
                    key={count}
                    onClick={() => {
                      setSelectedCount(count);
                      setCustomCount('');
                    }}
                    variant={selectedCount === count && !customCount ? 'default' : 'outline'}
                    className={`py-6 text-lg font-semibold transition-all duration-300 ${
                      selectedCount === count && !customCount
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white scale-105 shadow-lg'
                        : 'border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-indigo-500/50'
                    }`}
                  >
                    {count} Questions
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom input */}
            <div className="space-y-3">
              <label className="text-sm text-slate-400 font-medium">Or enter custom amount:</label>
              <input
                type="number"
                min="1"
                max={totalQuestions}
                value={customCount}
                onChange={(e) => handleCustomChange(e.target.value)}
                placeholder={`1 - ${totalQuestions}`}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 text-center text-lg font-semibold"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1 py-3 border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSelect}
                disabled={!selectedCount && !customCount}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50"
              >
                Create Test
              </Button>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Questions will be randomly selected from the {totalQuestions} available
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
