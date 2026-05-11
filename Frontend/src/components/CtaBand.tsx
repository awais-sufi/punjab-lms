import { ArrowRight, Lock } from "lucide-react";
import { useLms } from "../context/LmsContext";

export function CtaBand() {
  const { user, navigate } = useLms();

  return (
    <section className="cta-band">
      <div>
        <span className="eyebrow">
          <Lock size={16} />
          Next action
        </span>
        <h2>
          {user
            ? "Continue from your dashboard."
            : "Sign up or sign in when a course looks good."}
        </h2>
      </div>
      <button
        type="button"
        onClick={() =>
          navigate(
            user ? "dashboard" : "register",
            user ? "/dashboard" : "/signup",
          )
        }
      >
        {user ? "Open dashboard" : "Create account"} <ArrowRight size={18} />
      </button>
    </section>
  );
}
