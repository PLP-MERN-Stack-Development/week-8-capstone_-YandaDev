const bcrypt = require('bcrypt');
const { User } = require('./models/user.model.js');
const { connectDB } = require('./utils/db.js');
dotenv.config();

dotenv.config();

async function resetPassword() {
    try {
        await connectDB();
        
        const newPassword = 'password123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        const result = await User.updateOne(
            { email: 'john.doe@gmail.com' },
            { $set: { password: hashedPassword } }
        );
        
        console.log('Password reset result:', result);
        console.log('✅ Password for john.doe@gmail.com reset to: password123');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting password:', error);
        process.exit(1);
    }
}

resetPassword();
