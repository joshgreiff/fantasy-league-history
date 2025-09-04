'use client';

import { LeagueHistory } from '@/types/fantasy';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatScore } from '@/lib/utils';
import { Award, Flame, Zap, Frown, Target, TrendingUp, TrendingDown } from 'lucide-react';

interface LeagueRecordsProps {
  records: LeagueHistory['records'];
}

export default function LeagueRecords({ records }: LeagueRecordsProps) {
  const recordItems = [
    {
      title: 'Highest Single Week',
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      record: records.highestSingleWeek,
      value: formatScore(records.highestSingleWeek.score),
      subtitle: `Week ${records.highestSingleWeek.week}, ${records.highestSingleWeek.season}`,
      color: 'text-yellow-600'
    },
    {
      title: 'Lowest Winning Score',
      icon: <Frown className="h-5 w-5 text-blue-500" />,
      record: records.lowestWinningScore,
      value: formatScore(records.lowestWinningScore.score),
      subtitle: `Week ${records.lowestWinningScore.week}, ${records.lowestWinningScore.season}`,
      color: 'text-blue-600'
    },
    {
      title: 'Biggest Blowout',
      icon: <Flame className="h-5 w-5 text-red-500" />,
      record: records.biggestBlowout,
      value: formatScore(records.biggestBlowout.margin),
      subtitle: `${records.biggestBlowout.winner.name} beat ${records.biggestBlowout.loser.name}`,
      color: 'text-red-600'
    },
    {
      title: 'Most Points in a Loss',
      icon: <Target className="h-5 w-5 text-purple-500" />,
      record: records.mostPointsInLoss,
      value: formatScore(records.mostPointsInLoss.score),
      subtitle: `Week ${records.mostPointsInLoss.week}, ${records.mostPointsInLoss.season}`,
      color: 'text-purple-600'
    },
    {
      title: 'Most Points Left on Bench',
      icon: <TrendingDown className="h-5 w-5 text-orange-500" />,
      record: records.mostPointsLeftOnBench,
      value: formatScore(records.mostPointsLeftOnBench.points),
      subtitle: `Week ${records.mostPointsLeftOnBench.week}, ${records.mostPointsLeftOnBench.season}`,
      color: 'text-orange-600'
    },
    {
      title: 'Longest Win Streak',
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      record: records.longestWinStreak,
      value: `${records.longestWinStreak.streak} games`,
      subtitle: `Seasons: ${records.longestWinStreak.seasons.join(', ')}`,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-500" />
            League Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recordItems.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  {item.icon}
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                </div>
                <div className="space-y-1">
                  <div className={`text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </div>
                  <div className="font-medium text-gray-900">
                    {'team' in item.record ? item.record.team.name : item.record.winner.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {'team' in item.record ? item.record.team.owner : item.record.winner.owner}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {item.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Hall of Fame
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-400 pl-4">
                <h4 className="font-semibold text-yellow-700">Single Week Legend</h4>
                <p className="text-sm text-gray-600">
                  {records.highestSingleWeek.team.name} - {formatScore(records.highestSingleWeek.score)} points
                </p>
                <p className="text-xs text-gray-500">
                  Week {records.highestSingleWeek.week}, {records.highestSingleWeek.season}
                </p>
              </div>
              
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold text-green-700">Streak Master</h4>
                <p className="text-sm text-gray-600">
                  {records.longestWinStreak.team.name} - {records.longestWinStreak.streak} game win streak
                </p>
                <p className="text-xs text-gray-500">
                  Seasons: {records.longestWinStreak.seasons.join(', ')}
                </p>
              </div>
              
              <div className="border-l-4 border-red-400 pl-4">
                <h4 className="font-semibold text-red-700">Domination</h4>
                <p className="text-sm text-gray-600">
                  {records.biggestBlowout.winner.name} - {formatScore(records.biggestBlowout.margin)} point victory
                </p>
                <p className="text-xs text-gray-500">
                  vs {records.biggestBlowout.loser.name}, Week {records.biggestBlowout.week} {records.biggestBlowout.season}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Hall of Shame
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-blue-700">Squeaker Champion</h4>
                <p className="text-sm text-gray-600">
                  {records.lowestWinningScore.team.name} - {formatScore(records.lowestWinningScore.score)} points (and won!)
                </p>
                <p className="text-xs text-gray-500">
                  Week {records.lowestWinningScore.week}, {records.lowestWinningScore.season}
                </p>
              </div>
              
              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-purple-700">Unlucky Legend</h4>
                <p className="text-sm text-gray-600">
                  {records.mostPointsInLoss.team.name} - {formatScore(records.mostPointsInLoss.score)} points (and lost!)
                </p>
                <p className="text-xs text-gray-500">
                  Week {records.mostPointsInLoss.week}, {records.mostPointsInLoss.season}
                </p>
              </div>
              
              <div className="border-l-4 border-orange-400 pl-4">
                <h4 className="font-semibold text-orange-700">Bench Warmer</h4>
                <p className="text-sm text-gray-600">
                  {records.mostPointsLeftOnBench.team.name} - {formatScore(records.mostPointsLeftOnBench.points)} points left on bench
                </p>
                <p className="text-xs text-gray-500">
                  Week {records.mostPointsLeftOnBench.week}, {records.mostPointsLeftOnBench.season}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 