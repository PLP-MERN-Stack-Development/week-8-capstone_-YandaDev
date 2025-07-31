import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [input, setInput] = useState({
        email: '',
        password: '',
        role: '',
    });
    const { loading, user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            axios.defaults.withCredentials = true
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                if (res.data.user.role === 'recruiter') {
                    navigate('/admin/jobs');
                } else {
                    navigate('/');
                }
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            if (user.role === 'recruiter') {
                navigate('/admin/jobs');
            } else {
                navigate('/');
            }
        }
    }, [user, navigate]);

    return (
        <>
            <Navbar />
            <motion.div
                className="flex justify-center items-center min-h-screen pt-16 bg-gradient-to-r from-[#00040A] to-[#001636]"
                initial={ { opacity: 0 } }
                animate={ { opacity: 1 } }
                exit={ { opacity: 0 } }
                transition={ { duration: 0.5 } }
            >
                <motion.div
                    className="w-full max-w-md p-8 bg-gray-900 border-gray-700 shadow-lg rounded-lg border border-gray-600"
                    initial={ { y: 50 } }
                    animate={ { y: 0 } }
                    transition={ { type: 'spring', stiffness: 100 } }
                >
                    <motion.h1
                        className="font-bold text-3xl mb-6 text-white text-center"
                        initial={ { opacity: 0 } }
                        animate={ { opacity: 1 } }
                        transition={ { delay: 0.3 } }
                    >
                        Sign In
                    </motion.h1>

                    <form onSubmit={ submitHandler }>
                        <motion.div
                            className="mb-4"
                            initial={ { x: -50, opacity: 0 } }
                            animate={ { x: 0, opacity: 1 } }
                            transition={ { delay: 0.4 } }
                        >
                            <Label htmlFor="email" className="block text-white text-lg">
                                Email Address <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="email"
                                placeholder="john.doe@gmail.com"
                                type="email"
                                className="mt-1 p-3 border bg-transparent border-gray-500 rounded-md outline-none focus:border-blue-500 transition-all w-full text-white placeholder-gray-400"
                                value={ input.email }
                                name="email"
                                onChange={ changeEventHandler }
                            />
                        </motion.div>
                        <motion.div
                            className="mb-4"
                            initial={ { x: -50, opacity: 0 } }
                            animate={ { x: 0, opacity: 1 } }
                            transition={ { delay: 0.5 } }
                        >
                            <Label htmlFor="password" className="block text-white text-lg">
                                Password <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="password"
                                placeholder="********"
                                type="password"
                                className="mt-1 p-3 border bg-transparent border-gray-500 rounded-md outline-none focus:border-blue-500 transition-all w-full text-white placeholder-gray-400"
                                value={ input.password }
                                name="password"
                                onChange={ changeEventHandler }
                            />
                        </motion.div>

                        <motion.div
                            className="mb-6"
                            initial={ { x: -50, opacity: 0 } }
                            animate={ { x: 0, opacity: 1 } }
                            transition={ { delay: 0.6 } }
                        >
                            <Label className="block text-white mb-2 text-lg">
                                I am a: <span className="text-red-400">*</span>
                            </Label>
                            <RadioGroup
                                className="flex gap-4"
                                value={ input.role }
                                onValueChange={ (value) => setInput({ ...input, role: value }) }
                            >
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="jobseeker"
                                        id="jobseeker"
                                        className="cursor-pointer accent-blue-500"
                                        checked={ input.role === 'jobseeker' }
                                        onChange={ changeEventHandler }
                                    />
                                    <Label htmlFor="jobseeker" className="text-white cursor-pointer">
                                        JobSeeker
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        id="recruiter"
                                        className="cursor-pointer accent-blue-500"
                                        checked={ input.role === 'recruiter' }
                                        onChange={ changeEventHandler }
                                    />
                                    <Label htmlFor="recruiter" className="text-white cursor-pointer">
                                        Recruiter
                                    </Label>
                                </div>
                            </RadioGroup>
                        </motion.div>

                        { loading ? (
                            <Button className="w-full my-2 bg-blue-600 text-white hover:bg-blue-700">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait...
                            </Button>
                        ) : (
                            <Button
                                className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-all"
                                type="submit"
                            >
                                Sign In
                            </Button>
                        ) }

                        <p className="mt-4 text-center text-white">
                            Don't have an account?
                            <Link to="/signup" className="text-blue-400 hover:text-blue-300 mx-1 transition-colors">
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </motion.div>
        </>
    );
};

export default Login;