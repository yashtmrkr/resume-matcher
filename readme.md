# Resume Matcher Chrome Extension 🎯

AI-powered Chrome extension that analyzes job descriptions from any webpage and optimizes your resume using Claude AI.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🔍 **Auto-scrape job descriptions** from any webpage (LinkedIn, Indeed, Greenhouse, etc.)
- 📄 **PDF resume upload** - Save once, use everywhere
- 🎯 **Match score** - Get 0-100% compatibility score
- ✨ **Resume optimization** - AI-powered bullet point improvements
- 💡 **Actionable recommendations** - Specific advice to improve your application
- 🔒 **Secure** - API key and resume stored locally

## 🚀 Installation

### Prerequisites
- Google Chrome browser
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Steps

1. **Clone this repository**
   ```bash
   git clone https://github.com/yashtmrkr/resume-matcher.git
   cd resume-matcher
   ```

2. **Create icon files**
   - Create 3 PNG files: `icon16.png`, `icon48.png`, `icon128.png`
   - Or download from [flaticon.com](https://www.flaticon.com/)

3. **Load extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top right)
   - Click **Load unpacked**
   - Select the `resume-matcher-extension` folder

4. **Setup**
   - Click the extension icon
   - Go to **Settings** tab
   - Enter your Anthropic API key
   - Upload your resume PDF
   - Done! ✅

## 📖 Usage

### First Time Setup
1. Open extension → **Settings** tab
2. Add Anthropic API key → Save
3. Upload resume PDF → Save

### Analyze Any Job Posting
1. Navigate to any job posting page
2. Click extension icon
3. Click **"Analyze This Page"**
4. View your match score and optimized resume points!

### Supported Job Boards
- ✅ LinkedIn Jobs
- ✅ Indeed
- ✅ Greenhouse
- ✅ Lever
- ✅ Workday
- ✅ Company career pages

## 📁 File Structure

```
resume-matcher-extension/
├── manifest.json          # Extension configuration
├── popup.html            # UI interface
├── popup.js              # Main logic
├── content.js            # Web scraper
├── icon16.png           # Extension icon (16x16)
├── icon48.png           # Extension icon (48x48)
├── icon128.png          # Extension icon (128x128)
└── README.md            # This file
```

## 🔧 Technical Details

- **Model**: Claude Sonnet 4
- **API**: Anthropic Messages API
- **Storage**: Chrome local storage
- **Permissions**: `storage`, `activeTab`, `scripting`

## 💰 Cost

Using Claude Sonnet 4:
- ~$0.10-0.30 per analysis
- 10 analyses: ~$1-3
- 100 analyses: ~$10-30

Monitor usage at [console.anthropic.com](https://console.anthropic.com/)

## 🔒 Privacy & Security

- ✅ API key stored locally in Chrome storage
- ✅ Resume stored locally (not sent to any server except Anthropic API)
- ✅ No external tracking or analytics
- ✅ No data stored on external servers
- ⚠️ Resume data processed by Claude AI (per Anthropic's privacy policy)

## 🐛 Troubleshooting

### "Please set your Anthropic API key"
- Go to Settings tab and save your API key
- Ensure it starts with `sk-ant-`

### "Could not extract job description"
- Try refreshing the page
- Some websites block automated access
- Use the "Upload JD PDF" fallback option

### Extension not working after update
- Go to `chrome://extensions/`
- Click reload button on the extension
- Try closing and reopening Chrome

## 🛠️ Development

### Building from source
```bash
# Clone repository
git clone https://github.com/yashtmrkr/resume-matcher.git
cd resume-matcher

# Make changes to files

# Reload extension in Chrome
# Go to chrome://extensions/ and click reload
```

### Making changes
1. Edit the relevant files (`popup.js`, `content.js`, etc.)
2. Save changes
3. Go to `chrome://extensions/`
4. Click reload on the extension
5. Test your changes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] Export optimized resume to PDF
- [ ] Save analysis history
- [ ] Compare multiple job postings
- [ ] Support for pasting JD text directly
- [ ] Multiple resume profiles
- [ ] Browser action to auto-detect job pages

## 📄 License

This project is licensed under the MIT License - see below for details.

```
MIT License

Copyright (c) 2024 Yash

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- Built with [Claude AI](https://www.anthropic.com/) by Anthropic
- Icons from [Flaticon](https://www.flaticon.com/)

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the Troubleshooting section above

---

**Made with ❤️ using Claude AI**

⭐ Star this repo if you find it helpful!