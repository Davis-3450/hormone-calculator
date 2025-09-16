import { View } from "./components/view";
import "@/styles/globals.css";

export function App() {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-100 antialiased dark:bg-zinc-100 dark:text-zinc-50">
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <View />
      </main>
    </div>
  );
}
export default App;
