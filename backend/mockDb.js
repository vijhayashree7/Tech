// Local in-memory storage fallback for User profiles
const mockDb = {
  users: [],
  requests: [], // Added: In-memory storage for service requests
  isConnected: false,
  
  // Method to check connection state safely
  setConnected: (state) => {
    mockDb.isConnected = state;
  }
};

module.exports = mockDb;
