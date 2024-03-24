const userWebSockets = new Map()

const WebSocketManager = {
    userWebSockets,
    addUserWebSocket: (userId, ws) => {
        userWebSockets.set(userId, ws);
    },
    removeUserWebSocket: (userId) => {
        userWebSockets.delete(userId);
    },
    sendMessageToUser: (userId, data) => {
        const ws = userWebSockets.get(userId);
        if (ws) {
            ws.send(JSON.stringify(data));
        }
    }
}

module.exports = WebSocketManager;