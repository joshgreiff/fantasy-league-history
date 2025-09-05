# Fantasy Football League History Dashboard

A comprehensive web application to track and visualize your ESPN Fantasy Football league's history, statistics, and records. Built with Next.js, TypeScript, and the ESPN Fantasy Football API.

![Fantasy Football Dashboard](https://img.shields.io/badge/Fantasy%20Football-Dashboard-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38bdf8)

## Features

### 📊 All-Time Standings
- Complete win/loss records for all teams
- Points for/against statistics
- Win percentages and rankings
- Longest win/loss streaks
- Biggest blowouts and margins
- Points left on bench analysis

### 🏆 League Records
- Highest single-week scores
- Lowest winning scores
- Biggest blowouts in league history
- Most points scored in a loss
- Most points left on bench
- Hall of Fame and Hall of Shame

### 📈 Advanced Analytics
- Head-to-head rivalry statistics
- Season summaries and champions
- Draft analysis (coming soon)
- Trade impact tracking (coming soon)
- Power rankings over time (coming soon)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- An ESPN Fantasy Football league (private leagues supported)
- Access to your ESPN account cookies

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fantasy-league-history
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the `.env.local` file and update with your league information:

   ```bash
   # ESPN Fantasy Football API Configuration
   ESPN_S2=your_espn_s2_cookie_here
   SWID=your_swid_cookie_here
   LEAGUE_ID=your_league_id_here
   SEASON=2024
   ```

4. **Get your ESPN credentials**

   **For Private Leagues (Required):**
   - Log into ESPN Fantasy Football in your browser
   - Open Developer Tools (F12)
   - Go to Application > Cookies > https://fantasy.espn.com
   - Find and copy:
     - `ESPN_S2`: Long cookie string (no braces)
     - `SWID`: Shorter cookie string with braces like `{ABCD-1234-EFGH-5678}`

   **League ID:**
   - From your ESPN Fantasy URL: `https://fantasy.espn.com/football/league?leagueId=123456&seasonId=2024`
   - Your League ID is `123456`

5. **Run the development server**
```bash
npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Get ESPN Cookies

### Step-by-Step Guide:

1. **Login to ESPN Fantasy**
   - Go to [fantasy.espn.com](https://fantasy.espn.com)
   - Log in to your account
   - Navigate to your fantasy football league

2. **Open Developer Tools**
   - Press `F12` or right-click → "Inspect"
   - Go to the "Application" tab
   - Click on "Cookies" in the left sidebar
   - Click on "https://fantasy.espn.com"

3. **Find Required Cookies**
   - Look for `ESPN_S2` - copy the entire value (very long string)
   - Look for `SWID` - copy the entire value (shorter, with braces)

4. **Update .env.local**
   ```bash
   ESPN_S2=AEB6QBY%3D%2BqJo...very_long_string...
   SWID={ABCD-1234-EFGH-5678-IJKL}
   LEAGUE_ID=123456
   SEASON=2024
   ```

## Project Structure

```
src/
├── app/
│   ├── api/league/       # API routes for ESPN data
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main dashboard page
├── components/
│   ├── ui/               # Reusable UI components
│   ├── AllTimeStandings.tsx
│   └── LeagueRecords.tsx
├── lib/
│   ├── espn-client.ts    # ESPN API wrapper
│   ├── stats-service.ts  # Statistics calculations
│   └── utils.ts          # Utility functions
└── types/
    └── fantasy.ts        # TypeScript interfaces
```

## API Endpoints

### GET /api/league
Fetches complete league data including:
- League information and settings
- Team rosters and owners
- Schedule and matchup results
- Box scores and player statistics
- Calculated statistics and records

Query Parameters:
- `season` (optional): Season year (defaults to current season)

### POST /api/league
Test connection and validate credentials:
```json
{
  "action": "test-connection",
  "leagueId": 123456,
  "season": 2024,
  "espnS2": "cookie_value",
  "swid": "{cookie_value}"
}
```

## Available Statistics

### Team Statistics
- **Record**: Wins, losses, ties
- **Scoring**: Points for/against, averages
- **Performance**: Highest/lowest scores, margins
- **Efficiency**: Points left on bench, optimal lineups
- **Streaks**: Longest win/loss streaks

### League Records
- **Single Week**: Highest scoring performances
- **Margins**: Biggest blowouts and closest games
- **Efficiency**: Best and worst lineup decisions
- **Consistency**: Most reliable and volatile teams

## Troubleshooting

### Common Issues

**"League ID not configured"**
- Make sure `LEAGUE_ID` is set in `.env.local`
- Verify the league ID from your ESPN URL

**"Failed to fetch league data"**
- Check your ESPN cookies are current and valid
- Private leagues require both `ESPN_S2` and `SWID`
- Public leagues may work with just the `LEAGUE_ID`

**"No data available"**
- Ensure your league has completed games
- Check that the season parameter matches your league

**Cookies expired**
- ESPN cookies expire periodically
- Re-login to ESPN and get fresh cookie values

### Getting Help

1. Check the browser console for detailed error messages
2. Verify your `.env.local` configuration
3. Test with a public league first (no cookies required)
4. Make sure you're using the correct season year

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

### Environment Variables for Production
Make sure to set these in your deployment platform:
- `ESPN_S2`
- `SWID`
- `LEAGUE_ID`
- `SEASON`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Features

- [ ] Multi-season historical data
- [ ] Draft analysis and grading
- [ ] Trade impact tracking
- [ ] Power rankings over time
- [ ] Playoff probability calculator
- [ ] Weekly newsletter generator
- [ ] Mobile app companion
- [ ] League comparison tools

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **API**: ESPN Fantasy Football API (unofficial)
- **Charts**: Chart.js, React Chart.js 2
- **Deployment**: Vercel

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [ESPN Fantasy Football API](https://github.com/mkreiser/ESPN-Fantasy-Football-API) by Mike Kreiser
- ESPN for providing the fantasy football platform
- The fantasy football community for inspiration

---

**Note**: This application uses ESPN's unofficial API. ESPN may change their API at any time, which could affect functionality. This tool is for personal use and educational purposes.
