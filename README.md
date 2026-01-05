# Cursor Usage Visualizer

A React-based data visualization tool for analyzing your Cursor IDE usage patterns, costs, and model utilization. This application helps you understand your coding habits and AI usage by visualizing the data exported from Cursor.

## 🚀 Features

- **Interactive Dashboard**: Visualize your Cursor usage data with multiple chart types
- **Cost Tracking**: Monitor your AI usage costs over time
- **Token Analysis**: Track token consumption by model and usage patterns
- **Calendar Heatmap**: View daily usage patterns and identify peak activity
- **Model Statistics**: Compare usage across different AI models (GPT-4, Claude, etc.)
- **Date Range Export Helper**: Generate custom export links for periods beyond 30 days
- **Privacy Focused**: All data processing happens in your browser - no server uploads

## 📊 Visualizations

- **Time Series Chart**: Daily cost and token trends over time
- **Model Usage Chart**: Distribution of usage by AI model
- **Calendar Heatmap**: Visual representation of daily usage intensity
- **Token Breakdown**: Detailed analysis of different token types (input, output, cached)
- **Summary Statistics**: Total cost, tokens, requests, and unique models used

## 🛠️ Tech Stack

- **Framework**: React 19
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Language**: TypeScript

## 📁 Project Structure

```
├── components/
│   ├── FileUpload.tsx      # File upload interface
│   ├── Dashboard.tsx       # Main dashboard with visualizations
│   ├── LinkBuilder.tsx     # Custom export link generator
│   └── ui/                 # UI components (StatCard)
│   └── charts/             # Chart components (TimeSeriesChart, ModelStatsChart, etc.)
├── utils/
│   └── parser.ts           # CSV parsing and data transformation
├── types.ts                # TypeScript interfaces
├── App.tsx                 # Main application component
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

### Running Locally

1. Start the development server:

```bash
npm run dev
```

2. Open your browser to `http://localhost:5173`

## 📥 Data Import

### Getting Your Cursor Usage Data

1. Log in to [Cursor](https://cursor.com)
2. Navigate to your usage dashboard
3. Export your usage data as CSV (go to Settings → Account → Export Usage Data)
4. Upload the CSV file to the visualizer

> **Note**: The visualizer also includes a helper to generate custom export links for date ranges beyond the 30-day limit in Cursor's UI.

### Supported CSV Format

The application expects a CSV file with the following columns:

- `Date`: Date of usage
- `Kind`: Type of usage
- `Model`: AI model used
- `Max Mode`: Whether max mode was enabled
- `Input (w/ Cache Write)`: Input tokens including cache write
- `Input (w/o Cache Write)`: Input tokens excluding cache write
- `Cache Read`: Cached tokens read
- `Output Tokens`: Output tokens generated
- `Total Tokens`: Total tokens used
- `Cost`: Cost of the usage

## 🔍 How to Use

1. Upload your `usage.csv` file using the file upload interface
2. Explore your usage patterns through the interactive dashboard
3. Use the date range selector to generate export links for specific periods
4. Analyze your cost trends, model preferences, and token usage patterns

## 📈 Understanding the Charts

- **Time Series Chart**: Shows daily cost and token usage trends over time
- **Model Statistics**: Displays usage distribution by AI model
- **Calendar Heatmap**: Visualizes daily activity levels with color intensity
- **Token Breakdown**: Breaks down token usage by type (input, output, cached)

## 🛡️ Privacy & Security

- All data processing happens locally in your browser
- No data is uploaded to any server
- CSV files are processed only in memory
- The application works offline after initial load

## 🚧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/cursor-usage-visualizer/issues) section
2. Create a new issue with detailed information about your problem
3. Include your CSV format and any error messages you encounter

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide](https://lucide.dev/)
- Created to help developers better understand their AI coding tool usage