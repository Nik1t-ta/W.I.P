class GeneriveAI {
    constructor() {
        this.apiKey = ''; // Add your Groq API key here
        this.baseUrl = 'https://api.groq.com/openai/v1';
        this.conversationHistory = [];
        this.currentImage = null;
        this.thinkingDelay = 4000; // 4-7 seconds fake delay
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    async delay(min = 4000, max = 7000) {
        const time = Math.floor(Math.random() * (max - min) + min);
        return new Promise(resolve => setTimeout(resolve, time));
    }

    async sendMessage(message, image = null, mode = 'chat') {
        // Add fake thinking delay to seem legit
        await this.delay();

        const messages = this.buildMessages(message, image, mode);
        
        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.getModelForMode(mode),
                    messages: messages,
                    max_tokens: 2048,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const reply = data.choices[0].message.content;

            // Save to history
            this.conversationHistory.push({
                role: 'user',
                content: message,
                image: image
            });
            this.conversationHistory.push({
                role: 'assistant',
                content: reply
            });

            return {
                success: true,
                response: reply,
                mode: mode
            };

        } catch (error) {
            console.error('Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    buildMessages(userMessage, image, mode) {
        const systemPrompt = this.getSystemPrompt(mode);
        const messages = [{ role: 'system', content: systemPrompt }];

        // Add conversation history
        for (let msg of this.conversationHistory) {
            if (msg.image) {
                messages.push({
                    role: msg.role,
                    content: [
                        { type: 'text', text: msg.content },
                        { type: 'image_url', image_url: { url: msg.image } }
                    ]
                });
            } else {
                messages.push({
                    role: msg.role,
                    content: msg.content
                });
            }
        }

        // Add current message
        if (image) {
            messages.push({
                role: 'user',
                content: [
                    { type: 'text', text: userMessage },
                    { type: 'image_url', image_url: { url: image } }
                ]
            });
        } else {
            messages.push({
                role: 'user',
                content: userMessage
            });
        }

        return messages;
    }

    getSystemPrompt(mode) {
        const prompts = {
            'chat': 'You are Generive, a helpful AI assistant. Be conversational and natural.',
            'think': 'You are Generive in thinking mode. Think deeply and provide detailed analysis.',
            'code': 'You are Generive, an expert programmer. Write clean, efficient code with explanations.',
            'image': 'You are Generive with image generation capabilities. Describe images in detail.',
            'music': 'You are Generive with music generation capabilities. Describe music concepts.',
            'vision': 'You are Generive with advanced vision capabilities. Analyze images thoroughly.'
        };
        return prompts[mode] || prompts['chat'];
    }

    getModelForMode(mode) {
        const models = {
            'chat': 'llama-3.3-70b-versatile',
            'think': 'llama-3.3-70b-versatile',
            'code': 'llama-3.3-70b-versatile',
            'image': 'llama-3.3-70b-versatile',
            'music': 'llama-3.3-70b-versatile',
            'vision': 'llama-4-scout-17b-16e-instruct'
        };
        return models[mode] || 'llama-3.3-70b-versatile';
    }

    detectMode(message) {
        const lower = message.toLowerCase();
        
        if (lower.includes('think about') || lower.includes('analyze')) return 'think';
        if (lower.includes('code') || lower.includes('program') || lower.includes('function')) return 'code';
        if (lower.includes('generate image') || lower.includes('create image') || lower.includes('draw')) return 'image';
        if (lower.includes('music') || lower.includes('song') || lower.includes('sound')) return 'music';
        if (this.currentImage || lower.includes('this image')) return 'vision';
        
        return 'chat';
    }

    setImage(imageData) {
        this.currentImage = imageData;
    }

    clearImage() {
        this.currentImage = null;
    }

    clearHistory() {
        this.conversationHistory = [];
    }
}

const ai = new GeneriveAI();