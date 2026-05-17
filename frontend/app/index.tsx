// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // Root layout akan handle redirect berdasarkan auth state
  // Ini fallback aja
  // Cast to any to satisfy union type from expo-router for dynamic routes
  return <Redirect href={'/login' as any} />;
}