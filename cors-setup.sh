#!/bin/bash

# AuraMail Portal - CORS Configuration for Vercel Frontend
# Run this on your DigitalOcean server (159.223.103.126)

echo "🔧 Configuring CORS for Vercel Frontend..."

# Backup current Apache config
sudo cp /etc/apache2/sites-available/employee-portal.conf /etc/apache2/sites-available/employee-portal.conf.backup

# Update Apache configuration with CORS headers
cat << 'EOF' | sudo tee /etc/apache2/sites-available/employee-portal.conf
<VirtualHost *:80>
    ServerName portal.aurafarming.co
    DocumentRoot /var/www/employee-portal
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName portal.aurafarming.co
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/portal.aurafarming.co/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/portal.aurafarming.co/privkey.pem
    
    DocumentRoot /var/www/employee-portal
    
    # CORS Headers for Vercel Frontend
    Header always set Access-Control-Allow-Origin "https://portal.aurafarming.co"
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept"
    Header always set Access-Control-Allow-Credentials "true"
    
    # Handle preflight OPTIONS requests
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
    
    # Security headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # API endpoints - proxy to Node.js
    ProxyPreserveHost On
    ProxyRequests Off
    
    ProxyPass /api/ http://localhost:3000/api/
    ProxyPassReverse /api/ http://localhost:3000/api/
    
    # Health check
    ProxyPass /health http://localhost:3000/health
    ProxyPassReverse /health http://localhost:3000/health
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/portal-api-error.log
    CustomLog ${APACHE_LOG_DIR}/portal-api-access.log combined
    LogLevel warn
</VirtualHost>
EOF

# Enable required Apache modules
sudo a2enmod headers
sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http

# Test Apache configuration
echo "🧪 Testing Apache configuration..."
sudo apache2ctl configtest

if [ $? -eq 0 ]; then
    echo "✅ Apache configuration is valid"
    
    # Reload Apache
    echo "🔄 Reloading Apache..."
    sudo systemctl reload apache2
    
    echo "✅ CORS configuration complete!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Deploy to Vercel using GitHub repo: https://github.com/FactualTechAthereusUS/modern-employee-portal-"
    echo "2. Set environment variable: NEXT_PUBLIC_API_URL=https://portal.aurafarming.co/api"
    echo "3. Configure custom domain: portal.aurafarming.co"
    echo ""
    echo "🌐 Architecture:"
    echo "Frontend: Vercel (Global CDN)"
    echo "Backend: DigitalOcean (APIs only)"
    echo "Real-time: ✅ Username checking, form validation"
else
    echo "❌ Apache configuration error. Check syntax."
    exit 1
fi 