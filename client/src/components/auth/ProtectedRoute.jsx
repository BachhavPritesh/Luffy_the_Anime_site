import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { openAuthModal } from '../../features/ui/uiSlice';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(openAuthModal('login'));
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60dvh]">
        <p className="text-luffy-muted">Please sign in to view this page.</p>
      </div>
    );
  }

  return children;
}
