import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20'>
      <SignUp />
    </div>
  );
}
