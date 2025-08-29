# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Project Type
Next.js 15 application with TypeScript, using App Router and Tailwind CSS for styling.

### Data Flow
The application reads CSV files directly from the filesystem without a database:
1. CSV files are located at `/Users/miguelangelbatistaruiz/Documents/Dossier MABR/Clients/`
2. API routes in `app/api/companies/` read and parse CSVs on each request
3. Client components fetch data from API routes
4. No data persistence - all data is read from CSVs in real-time

### CSV Format Handling
The `lib/csv-parser.ts` handles two CSV formats automatically:
- **Format 1**: `"No";"Nom";"Prénom";"Actif"...` (original)  
- **Format 2**: `"Actif";"No";"Nom";"Prénom"...` (alternative)

Parser uses dynamic column mapping to detect and adapt to both formats.

### Key Components Structure

**API Routes:**
- `/api/companies` - Returns list of all companies with client counts
- `/api/companies/[fileName]` - Returns detailed company data with all clients

**Pages:**
- `/` - Main page showing company cards with search
- `/company/[fileName]` - Company detail page with client cards, filters, and export

**Components:**
- `CompanyCard` - Card display for each company
- `ClientCard` - Individual client information card  
- `SearchBar` - Reusable search input component

### Important Configuration

**PostCSS Configuration (`postcss.config.js`):**
Must use Tailwind CSS v3 with this exact configuration:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**CSV Parsing Rules:**
- Files containing "Clients-" or "cllients Adecco-" in the name are skipped
- Delimiter is semicolon (;)
- Only clients with at least a name (nom or prenom) are included
- Active status is determined by `actif === '1 - Oui'`

### Known Issues and Solutions

**Tailwind CSS not working:**
- Ensure using Tailwind CSS v3 (not v4)
- PostCSS config must be in `postcss.config.js` (not .mjs)
- Remove all dark mode classes if styling issues occur

**CSV files not importing:**
- Check CSV format (two formats supported)
- Verify semicolon delimiter
- Ensure file encoding is UTF-8