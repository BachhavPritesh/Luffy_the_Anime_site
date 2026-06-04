import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/auth/authSlice';
import { closeAuthModal, openAuthModal } from '../../features/ui/uiSlice';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

export default function RegisterModal() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const { authModal } = useSelector((s) => s.ui);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <Modal isOpen={authModal === 'register'} onClose={() => dispatch(closeAuthModal())} title="Join LUFFY">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Username" icon={FiUser} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required placeholder="Luffy" />
        <Input label="Email" type="email" icon={FiMail} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="luffy@onepiece.com" />
        <Input label="Password" type="password" icon={FiLock} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" minLength={6} />
        {error && <p className="text-sm text-luffy-red">{error}</p>}
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
        <p className="text-sm text-luffy-muted text-center">
          Already have an account?{' '}
          <button type="button" onClick={() => dispatch(openAuthModal('login'))} className="text-luffy-red hover:underline cursor-pointer">
            Sign In
          </button>
        </p>
      </form>
    </Modal>
  );
}
