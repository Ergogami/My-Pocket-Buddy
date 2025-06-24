const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from src directory for development
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Serve the main HTML file
app.get('*', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MY POCKET BUDDY - Website Version</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #ecfeff 100%);
            min-height: 100vh;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            text-align: center; 
        }
        .card {
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            text-decoration: none;
            margin: 10px;
            font-weight: bold;
            transition: transform 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .feature {
            background: #f8fafc;
            padding: 20px;
            border-radius: 15px;
            margin: 15px 0;
            border-left: 5px solid #3b82f6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1 style="color: #3b82f6; font-size: 2.5rem; margin-bottom: 20px;">🏃‍♂️ MY POCKET BUDDY</h1>
            <h2 style="color: #6b7280;">Children's Exercise Website</h2>
            <p style="font-size: 1.2rem; color: #6b7280; margin: 20px 0;">
                The interactive website version with drag and drop playlist functionality!
            </p>
        </div>

        <div class="card">
            <h3 style="color: #1f2937; margin-bottom: 20px;">Available Features</h3>
            
            <div class="feature">
                <h4 style="color: #3b82f6;">✅ Checkbox Completion</h4>
                <p>Click checkboxes to mark exercises as completed and move them to the "All Done Zone"</p>
            </div>
            
            <div class="feature">
                <h4 style="color: #8b5cf6;">🎯 Drag & Drop Playlist</h4>
                <p>Drag exercises between "Active" and "All Done" zones with visual feedback</p>
                <a href="/playlist-demo.html" class="btn">Try Drag & Drop Demo</a>
            </div>
            
            <div class="feature">
                <h4 style="color: #10b981;">📋 Exercise Categories</h4>
                <p>Browse 15+ exercises across 5 categories: Balance, Coordination, Strength, Ball Skills, Stretching</p>
            </div>
            
            <div class="feature">
                <h4 style="color: #f59e0b;">🏃‍♀️ Workout Programs</h4>
                <p>6 structured programs (10-20 minutes each) for complete fitness experiences</p>
            </div>
        </div>

        <div class="card">
            <h3 style="color: #1f2937;">How to Access Full Website</h3>
            <p style="margin: 20px 0;">The complete React website with all interactive features is ready for deployment:</p>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: left;">
                <h4>📂 Location: <code>website-version/</code> folder</h4>
                <p><strong>Features:</strong></p>
                <ul style="margin: 10px 0;">
                    <li>Interactive drag and drop playlist</li>
                    <li>Checkbox completion tracking</li>
                    <li>Responsive design for all devices</li>
                    <li>Accessibility compliant (WCAG 2.1 AA)</li>
                    <li>SEO optimized for search engines</li>
                </ul>
            </div>

            <a href="../website-demo.html" class="btn">View Static Demo</a>
        </div>

        <div class="card">
            <h3 style="color: #1f2937;">Ready for Publishing</h3>
            <p>Deploy the website-version folder to any hosting service:</p>
            <div style="display: flex; justify-content: center; flex-wrap: wrap; margin: 20px 0;">
                <span style="background: #e0f2fe; padding: 10px 15px; margin: 5px; border-radius: 20px; color: #0369a1;">Netlify</span>
                <span style="background: #f3e8ff; padding: 10px 15px; margin: 5px; border-radius: 20px; color: #7c3aed;">Vercel</span>
                <span style="background: #ecfdf5; padding: 10px 15px; margin: 5px; border-radius: 20px; color: #059669;">GitHub Pages</span>
            </div>
        </div>
    </div>
</body>
</html>
  `);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`MY POCKET BUDDY Website Demo running at http://localhost:${port}`);
  console.log(`The full interactive website is in the website-version/ folder`);
});