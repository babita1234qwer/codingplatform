import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../authslice';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

const signupSchema = z.object({
  emailid: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const submitteddata = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-primary/10 via-base-200 to-base-100 px-4">
      <div className="bg-base-100 shadow-2xl rounded-2xl p-10 flex flex-col items-center border border-base-300 w-full max-w-md">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-2 drop-shadow-lg text-center">
          <span className="inline-block animate-bounce">🚀</span> CodeCrack
        </h1>
        <h2 className="text-xl text-secondary mb-6 font-semibold text-center">Welcome back! Please login to continue.</h2>
        <form className="w-full" onSubmit={handleSubmit(submitteddata)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
            <input
              {...register('emailid')}
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="email"
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
              autoComplete="current-password"
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          </div>
          {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-full font-semibold hover:bg-primary/90 transition-colors duration-150 shadow"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-sm text-base-content/70 text-center">
          Don&apos;t have an account?{' '}
          <span
            className="text-primary font-semibold cursor-pointer hover:underline"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;