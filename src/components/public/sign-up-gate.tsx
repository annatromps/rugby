import Link from "next/link";

// Replaces the "send a message" form on a profile page when no one is
// signed in. Keeps the same slot/size as InquiryForm so the layout doesn't
// jump between the two states.
export function SignUpGate({ heading }: { heading: string }) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{heading}</h3>
      <p className="text-sm text-slate-500">
        Create a free account to see full contact details and send a message.
      </p>
      <Link
        href="/signup"
        className="block rounded-md bg-brand-navy px-3 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark"
      >
        Sign up to contact
      </Link>
      <p className="text-xs text-slate-400">
        Already have an account?{" "}
        <Link href="/signin" className="font-medium text-brand-navy hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
