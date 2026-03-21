import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { PublicHeader } from "@/components/public-header";
import { getDictionary } from "@/lib/i18n";
import { getPreferredLanguage } from "@/lib/locale";

export default async function LoginPage() {
  const language = await getPreferredLanguage();
  const dict = getDictionary(language);

  return (
    <div className="min-h-screen bg-aura px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-10">
        <PublicHeader language={language} dict={dict} />
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="self-center">
            <p className="text-sm uppercase tracking-[0.4em] text-gold">{dict.brand}</p>
            <h1 className="mt-4 font-display text-6xl text-white">{dict.loginTitle}</h1>
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
