import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../authslice';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  emailid: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const submitteddata = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-primary/10 via-base-200 to-base-100 px-4">
      <div className="bg-base-100 shadow-2xl rounded-2xl p-10 flex flex-col items-center border border-base-300 w-full max-w-md">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-2 drop-shadow-lg text-center">
          <span className="inline-block animate-bounce">🚀</span> CodeCrack
        </h1>
        <h2 className="text-xl text-secondary mb-6 font-semibold text-center">Create your account</h2>
        <form className="w-full" onSubmit={handleSubmit(submitteddata)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="username">Username</label>
            <input
              {...register('firstName')}
              type="text"
              id="username"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
            <input
              {...register('emailid')}
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.emailid && <span className="text-red-500 text-sm">{errors.emailid.message}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-full font-semibold hover:bg-primary/90 transition-colors duration-150 shadow"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-sm text-base-content/70 text-center">
          Already have an account?{' '}
          <span
            className="text-primary font-semibold cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;