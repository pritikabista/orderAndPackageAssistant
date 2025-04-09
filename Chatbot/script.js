document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const messagesDiv = document.getElementById('chat-messages');

    // Sample orders data
    const orders = {
        'ORD789': {
            orderDate: '2024-03-20',
            items: [
                { name: 'Wireless Headphones', quantity: 1, price: 99.99 },
                { name: 'Phone Case', quantity: 2, price: 19.99 }
            ],
            totalAmount: 139.97,
            shippingAddress: '123 Main St, New York, NY 10001',
            status: 'Shipped',
            trackingNumber: 'TRK123456'
        },
        'ORD456': {
            orderDate: '2024-03-15',
            items: [
                { name: 'Smart Watch', quantity: 1, price: 199.99 }
            ],
            totalAmount: 199.99,
            shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
            status: 'Delivered',
            trackingNumber: 'TRK789012'
        },
        'ORD123': {
            orderDate: '2024-03-10',
            items: [
                { name: 'Laptop', quantity: 1, price: 999.99 },
                { name: 'Laptop Bag', quantity: 1, price: 49.99 }
            ],
            totalAmount: 1049.98,
            shippingAddress: '789 Pine St, Chicago, IL 60601',
            status: 'Processing',
            trackingNumber: null
        }
    };

    // Sample package data
    const packages = {
        'TRK123456': {
            status: 'In Transit',
            location: 'New York Distribution Center',
            estimatedDelivery: '2024-03-25',
            carrier: 'Express Shipping'
        },
        'TRK789012': {
            status: 'Delivered',
            location: 'Customer Address',
            deliveryDate: '2024-03-20',
            carrier: 'Standard Shipping'
        }
    };

    function sendMessage() {
        const message = userInput.value.trim();

        if (message) {
            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'message user-message';
            userMessage.innerHTML = `<p>${message}</p>`;
            messagesDiv.appendChild(userMessage);

            // Clear input
            userInput.value = '';

            // Scroll to bottom
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            // Process the message and generate response
            setTimeout(() => {
                const response = processMessage(message);
                const botMessage = document.createElement('div');
                botMessage.className = 'message bot-message';
                botMessage.innerHTML = `<p>${response}</p>`;
                messagesDiv.appendChild(botMessage);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }, 1000);
        }
    }

    function processMessage(message) {
        const lowerMessage = message.toLowerCase();

        // Check for order number pattern (ORD followed by 3 digits)
        const orderMatch = message.match(/ORD\d{3}/);

        // Check for tracking number pattern (TRK followed by 6 digits)
        const trackingMatch = message.match(/TRK\d{6}/);

        if (orderMatch) {
            const orderNumber = orderMatch[0];
            if (orders[orderNumber]) {
                const order = orders[orderNumber];
                let response = `Order Details for ${orderNumber}:\n`;
                response += `Order Date: ${order.orderDate}\n`;
                response += `Status: ${order.status}\n`;
                response += `Shipping Address: ${order.shippingAddress}\n\n`;

                response += `Items:\n`;
                order.items.forEach(item => {
                    response += `- ${item.name} (Qty: ${item.quantity}) - $${item.price}\n`;
                });

                response += `\nTotal Amount: $${order.totalAmount}\n`;

                if (order.trackingNumber) {
                    response += `\nTracking Number: ${order.trackingNumber}\n`;
                    response += `Would you like to check the package status for this order?`;
                }

                return response;
            } else {
                return `I couldn't find any order with number ${orderNumber}. Please verify the order number and try again.`;
            }
        } else if (trackingMatch) {
            const trackingNumber = trackingMatch[0];
            if (packages[trackingNumber]) {
                const pkg = packages[trackingNumber];
                if (pkg.status === 'Delivered') {
                    return `Package ${trackingNumber} has been delivered on ${pkg.deliveryDate}.`;
                } else {
                    return `Package ${trackingNumber} is currently ${pkg.status} at ${pkg.location}.\nEstimated delivery date: ${pkg.estimatedDelivery}.\nCarrier: ${pkg.carrier}.`;
                }
            } else {
                return `I couldn't find any package with tracking number ${trackingNumber}. Please verify the tracking number and try again.`;
            }
        } else if (lowerMessage.includes('recent') || lowerMessage.includes('last') || lowerMessage.includes('orders')) {
            let response = 'Your Recent Orders:\n\n';
            Object.entries(orders).forEach(([orderNumber, order]) => {
                response += `Order ${orderNumber} (${order.orderDate})\n`;
                response += `Status: ${order.status}\n`;
                if (order.trackingNumber) {
                    response += `Tracking: ${order.trackingNumber}\n`;
                }
                response += `Total: $${order.totalAmount}\n\n`;
            });
            response += 'Would you like to see details for any of these orders?';
            return response;
        } else if (lowerMessage.includes('order') || lowerMessage.includes('details')) {
            return 'Please provide your order number (format: ORD123) to view order details, or type "recent orders" to see your recent orders.';
        } else if (lowerMessage.includes('track') || lowerMessage.includes('package') || lowerMessage.includes('parcel')) {
            return 'Please provide your tracking number (format: TRK123456) to check your package status.';
        } else if (lowerMessage.includes('help')) {
            return 'I can help you with:\n- Viewing recent orders (type "recent orders")\n- Checking order details (provide order number: ORD123)\n- Tracking packages (provide tracking number: TRK123456)\n\nType "help" for this information again.';
        } else {
            return 'I can help you track your packages and view order details. Type "help" for more information.';
        }
    }

    // Add click event listener to send button
    sendButton.addEventListener('click', sendMessage);

    // Add keypress event listener for Enter key
    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 