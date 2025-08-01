#!/bin/bash

echo "🚀 Setting up environment variables for AI Pitch Deck Backend"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_pitch_deck"
OPENAI_API_KEY="your-openai-api-key-here"
EOF
    echo "✅ .env file created!"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🔧 Next steps:"
echo "1. Get your OpenAI API key from: https://platform.openai.com/api-keys"
echo "2. Replace 'your-openai-api-key-here' in the .env file with your actual API key"
echo "3. Restart the backend server"
echo ""
echo "💡 To get your API key:"
echo "   - Go to https://platform.openai.com/api-keys"
echo "   - Sign in or create an account"
echo "   - Click 'Create new secret key'"
echo "   - Copy the key and paste it in the .env file"
echo ""
echo "🔄 After updating the .env file, restart the server with: npm run start:dev" 