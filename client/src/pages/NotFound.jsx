import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[80dvh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display text-[clamp(6rem,15vw,12rem)] text-luffy-red leading-none animate-float">
        404
      </h1>
      <p className="text-xl md:text-2xl text-luffy-muted mt-4 mb-2">
        Grand Line Not Found
      </p>
      <p className="text-luffy-faint max-w-md mb-8">
        This page drifted off into the Calm Belt. Even a Log Pose can't find it.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
