'use client';
import { useActionState } from "react";
import { createPost } from "@/app/actions/postActions"

export default function Home() {

  // this is server action
  // it's not api
  // is should be in app folder
  // the server action like postAction.ts should have 'use server' on top of the file
  // in this case as u can see there is no need to define useState for form and for isPending
  //

  const [state, formAction, isPending] = useActionState(createPost, {error: null});

  return (
    <div className="container">
      <h1>
        Home Page
      </h1>

      {/* Action form template */}
      <form action={formAction} className="flex flex-col gap-4 max-w-md mt-6">
        <input name="title" placeholder="title" className="border p-2" />
        <textarea name="content" placeholder="content" className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white p-2">
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {state && <p className={state.ok ? 'text-green-500' : 'text-red-500'}>{state.message}</p>}
    </div>
  );
}
