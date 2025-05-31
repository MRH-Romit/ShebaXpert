// Auto-start server when Landing Page is loaded
(function() {
    // Server configuration
    const SERVER_URL = 'http://localhost:5000';
    const HEALTH_CHECK_URL = `${SERVER_URL}/api/health`;
    
    let serverCheckAttempts = 0;
    const maxAttempts = 3;
    
    // Check if server is running
    async function checkServerStatus() {
        try {
            const response = await fetch(HEALTH_CHECK_URL, {
                method: 'GET',
                mode: 'cors'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Authentication server is running:', data);
                return true;
            }
        } catch (error) {
            console.log('❌ Server not accessible:', error.message);
            return false;
        }
        return false;
    }
      // Start server using batch file
    function startServer() {
        console.log('🚀 Starting authentication server...');
        
        // Show user notification
        showServerStartupMessage();
        
        // For Windows - provide multiple startup options
        if (window.navigator.platform.indexOf('Win') !== -1) {
            // Show startup options modal
            showStartupOptions();
        } else {
            showManualStartupInstructions();
        }
    }
    
    // Show startup options for Windows
    function showStartupOptions() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10002;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 8px; max-width: 600px; margin: 20px; font-family: Arial, sans-serif;">
                <h2 style="color: #333; margin-top: 0; text-align: center;">🚀 Start Authentication Server</h2>
                <p style="color: #666; text-align: center; margin-bottom: 25px;">Choose your preferred method to start the server:</p>
                
                <div style="margin: 20px 0;">
                    <h3 style="color: #4CAF50; margin-bottom: 10px;">Option 1: PowerShell (Recommended)</h3>
                    <div style="background: #f0f8f0; padding: 15px; border-radius: 4px; border-left: 4px solid #4CAF50;">
                        <p style="margin: 0 0 10px 0; font-weight: bold;">Right-click on start-server.ps1 → "Run with PowerShell"</p>
                        <p style="margin: 0; font-size: 12px; color: #666;">Located in: i:\\ShebaXpert\\start-server.ps1</p>
                    </div>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3 style="color: #2196F3; margin-bottom: 10px;">Option 2: Batch File</h3>
                    <div style="background: #f0f4ff; padding: 15px; border-radius: 4px; border-left: 4px solid #2196F3;">
                        <p style="margin: 0 0 10px 0; font-weight: bold;">Double-click on start-server.bat</p>
                        <p style="margin: 0; font-size: 12px; color: #666;">Located in: i:\\ShebaXpert\\start-server.bat</p>
                    </div>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3 style="color: #FF9800; margin-bottom: 10px;">Option 3: Manual Terminal</h3>
                    <div style="background: #fff8f0; padding: 15px; border-radius: 4px; border-left: 4px solid #FF9800;">
                        <p style="margin: 0 0 5px 0; font-weight: bold;">Open PowerShell/Command Prompt:</p>
                        <code style="background: #333; color: #0f0; padding: 8px; display: block; border-radius: 3px; font-size: 12px;">
cd i:\\ShebaXpert\\backend<br>
npm install<br>
node test-auth-server.js
                        </code>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            style="background: #4CAF50; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; margin: 0 10px; font-size: 14px;">
                        Got it!
                    </button>
                    <button onclick="window.ShebaXpertServerManager.retryConnection(); this.parentElement.parentElement.parentElement.remove();" 
                            style="background: #2196F3; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; margin: 0 10px; font-size: 14px;">
                        Check Again
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Show server startup message
    function showServerStartupMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.id = 'server-startup-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4CAF50;
            color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            text-align: center;
            max-width: 400px;
        `;
        
        messageDiv.innerHTML = `
            <h3 style="margin: 0 0 10px 0;">🚀 Starting Authentication Server</h3>
            <p style="margin: 0 0 15px 0;">Please wait while we start the backend server...</p>
            <div style="margin: 10px 0;">
                <div id="loading-spinner" style="
                    border: 3px solid rgba(255,255,255,0.3);
                    border-top: 3px solid white;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                "></div>
            </div>
            <button onclick="document.getElementById('server-startup-message').style.display='none'" 
                    style="background: rgba(255,255,255,0.2); border: 1px solid white; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                Close
            </button>
        `;
        
        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(messageDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.display = 'none';
            }
        }, 10000);
    }
    
    // Show manual startup instructions
    function showManualStartupInstructions() {
        const instructions = `
To start the authentication server manually:

1. Open Command Prompt/Terminal
2. Navigate to: i:\\ShebaXpert\\backend
3. Run: npm install (first time only)
4. Run: node test-auth-server.js
5. Server will start on http://localhost:5000

Alternative: Double-click start-server.bat file
        `;
        
        console.log(instructions);
        
        // Create instruction modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: 20px;">
                <h2 style="color: #333; margin-top: 0;">Manual Server Setup Required</h2>
                <pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${instructions}</pre>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; float: right;">
                    Got it
                </button>
                <div style="clear: both;"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Retry server connection
    async function retryServerConnection() {
        serverCheckAttempts++;
        
        if (serverCheckAttempts > maxAttempts) {
            console.log('❌ Max server check attempts reached');
            startServer();
            return;
        }
        
        console.log(`🔄 Checking server... (attempt ${serverCheckAttempts}/${maxAttempts})`);
        
        const isRunning = await checkServerStatus();
        
        if (!isRunning) {
            setTimeout(retryServerConnection, 2000); // Wait 2 seconds before retry
        } else {
            console.log('✅ Server is ready!');
            // Remove any startup messages
            const startupMessage = document.getElementById('server-startup-message');
            if (startupMessage) {
                startupMessage.style.display = 'none';
            }
        }
    }
    
    // Initialize server check when page loads
    function initializeServerCheck() {
        console.log('🔍 Initializing server connectivity check...');
        retryServerConnection();
    }
    
    // Start the check when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeServerCheck);
    } else {
        initializeServerCheck();
    }
    
    // Expose functions globally for debugging
    window.ShebaXpertServerManager = {
        checkStatus: checkServerStatus,
        startServer: startServer,
        retryConnection: retryServerConnection
    };
    
})();
