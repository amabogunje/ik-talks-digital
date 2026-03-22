import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { PublicHeader } from "@/components/public-header";
import { getDictionary } from "@/lib/i18n";
import { getPreferredLanguage } from "@/lib/locale";

export default async function LoginPage() {
  const language = await getPreferredLanguage();
  const dict = getDictionary(language);

  return (
    <div className="min-h-screen bg-aura text-white">
      <div className="border-b border-white/10 bg-black/85 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <PublicHeader language={language} dict={dict} />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="self-center">
            <h1 className="font-display text-6xl text-white">{dict.loginTitle}</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-300">{dict.loginIntro}</p>
            <p className="mt-6 text-sm text-zinc-400">
              {dict.newHere} <Link href="/signup" className="text-gold">{dict.createAccount}</Link>
            </p>
          </div>
          <AuthForm mode="login" text={{ fullName: dict.fullName, email: dict.email, password: dict.password, preferredLanguage: dict.preferredLanguage, createAccountButton: dict.createAccountButton, login: dict.login, demoLearner: dict.demoLearner, guidedDashboard: dict.guidedDashboard, authError: dict.authError }} />
        </div>
      </div>
    </div>
  );
}
