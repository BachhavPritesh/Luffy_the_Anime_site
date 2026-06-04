import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/auth/authSlice';
import { closeAuthModal, openAuthModal } from '../../features/ui/uiSlice';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { FiMail, FiLock } from 'react-icons/fi';

export default function LoginModal() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const { authModal } = useSelector((s) => s.ui);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <Modal isOpen={authModal === 'login'} onClose={() => dispatch(closeAuthModal())} title="Welcome Back">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" icon={FiMail} value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" />
        <Input label="Password" type="password" icon={FiLock} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
        {error && <p className="text-sm text-luffy-red">{error}</p>}
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
        <p className="text-sm text-luffy-muted text-center">
          Don't have an account?{' '}
          <button type="button" onClick={() => dispatch(openAuthModal('register'))} className="text-luffy-red hover:underline cursor-pointer">
            Register
          </button>
        </p>
      </form>
    </Modal>
  );
}
