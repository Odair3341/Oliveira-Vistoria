
export default function handler(req, res) {
  res.status(200).json({ 
    message: 'API is working', 
    env: {
      hasDbUrl: !!process.env.DATABASE_URL
    }
  });
}
