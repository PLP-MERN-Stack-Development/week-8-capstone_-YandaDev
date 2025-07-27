// Middleware to ensure recruiter is linked to a company
import { User } from '../models/user.model.js';

export default async function requireCompany(req, res, next) {
  const userId = req.id;
  const user = await User.findById(userId);
  if (!user || !user.profile.company) {
    return res.status(403).json({
      message: 'Recruiter must be linked to a company to perform this action.',
      success: false
    });
  }
  next();
}
