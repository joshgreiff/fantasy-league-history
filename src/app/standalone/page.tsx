export default function StandalonePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🏆 Fantasy Football League History Dashboard
        </h1>
        <p className="text-gray-700 mb-8">
          This is a standalone version to test deployment. The full dashboard should load at the root URL.
        </p>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Demo League Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">10</div>
              <div className="text-gray-600">Total Teams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2024</div>
              <div className="text-gray-600">Current Season</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">17</div>
              <div className="text-gray-600">Total Weeks</div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">All-Time Standings Preview</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 text-gray-900">Rank</th>
                <th className="text-left py-2 px-3 text-gray-900">Team</th>
                <th className="text-left py-2 px-3 text-gray-900">Record</th>
                <th className="text-left py-2 px-3 text-gray-900">Win %</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-3 text-gray-900">1st</td>
                <td className="py-2 px-3 text-gray-900">The Dynasty</td>
                <td className="py-2 px-3 text-gray-900">8-4</td>
                <td className="py-2 px-3 text-green-600">66.7%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 text-gray-900">2nd</td>
                <td className="py-2 px-3 text-gray-900">Gridiron Gladiators</td>
                <td className="py-2 px-3 text-gray-900">7-5</td>
                <td className="py-2 px-3 text-green-600">58.3%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 text-gray-900">3rd</td>
                <td className="py-2 px-3 text-gray-900">Fantasy Phenoms</td>
                <td className="py-2 px-3 text-gray-900">6-6</td>
                <td className="py-2 px-3 text-yellow-600">50.0%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            If you can see this page, Vercel deployment is working correctly!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Current time: {new Date().toISOString()}
          </p>
        </div>
      </div>
    </div>
  );
} 