// "use client";

// import { SessionProvider } from "next-auth/react";

// export function Providers({ children }) {
//   return (
//     <SessionProvider>
//       {children}
//     </SessionProvider>
//   );
// }

"use client";

import type { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

// Backend removed - SessionProvider removed
export function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}
