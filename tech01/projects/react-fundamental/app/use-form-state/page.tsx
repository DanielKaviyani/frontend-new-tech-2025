'use client';

import { useActionState } from "react";
import { createUser } from "../actions/userActions";
import { useFormStatus } from "react-dom";

export default function ActionForm() {

  // useFormStatus is using to check the status of current form
  // we can use isPending from useActionState as well
  // but useFormStatus is work event we have the submit button in child component

  const [state, formAction] = useActionState(createUser, {ok: false, message: ''})

  return (
    <section className="container">
      <h1 className="font-bold text-2xl uppercase">Use Form State</h1>


      <form action={formAction} className="flex flex-col gap-4 max-w-sm mt-6">
        <input name="username" placeholder="username" className="border p-2" />
        <input name="email" placeholder="email" className="border p-2" />
        <input name="password" placeholder="password" className="border p-2" />
        
        <SubmitButton />
      </form>

      {state?.ok && <p className="text-green-500">{state?.message}</p>}
      {!state?.ok && <p className="text-red-500">{state?.message}</p>}
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="bg-blue-500 text-white p-2" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}