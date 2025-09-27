"use server"
//<- do not forget this!

// server actions
export async function handleForm(prevState: any, formData: FormData) {
    // "use server" <- this only when you wire in page.tsx or in another server components
    // This allows you to send values to the backend
    // If you check with console.log, you’ll see the following
    console.log(formData.get("email"), formData.get("password"));
    console.log("run in server");

    // promise is just for testing!
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // At this point, users have no feedback if the action is running when they press the button
    // What we need is a hook that tells us the status of the action: useFormStatus
    // This comes from react-dom
    // Important: this hook cannot be used directly on the form (parent)
    // it only works inside a child component (e.g., FormButton)

    //you can also redirect 
    //redirect("/")
    return {
        errors: ["wrong password","password too short"]
    }
}


// With the above server action, you can send values to the backend,
// and by using useFormStatus in a child component, you can implement a loading state.
// However, if an error occurs inside the server action, there’s no way to detect it.
// Instead of passing handleForm directly to the form,
// you can wrap the action function with useFormState(deprecated react v19. now useActionState) and pass the second return value to the form.
// This way, you can easily display the return values (e.g., errors) from the action function.
// Note: this is interactive, so it can only be used in client components.
// Since server actions are for the server side, they cannot be used in the same place as client hooks.

// const [state, action] = useActionState(handleForm, null); <- only can be used in client component
