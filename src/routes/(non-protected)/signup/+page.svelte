<script>
    import { goto } from '$app/navigation';
    import { InputField, UserForm } from '$lib/components';
    import { userFieldsRegex } from '$lib/utils/validator.js';
    import { PUBLIC_API_URL } from '$env/static/public';

    let signupForm;
    let error = {};

    async function signup(event) {
        error = {};
        const user = Object.fromEntries(new FormData(signupForm));

        let data;
        try {
            const response = await fetch(`${PUBLIC_API_URL}/signup`, {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            data = await response.json();
        } catch (err) {
            console.error('Failed to signup:', err);
            alert('Something went wrong with signup, try again later');            
            return;
        }

        if(data.error) {
            error = data.error;
            return;
        }

        alert(`An email with a verification link has been sent to ${user.email}, check your spam folder if you can't find it in your inbox.`);
        goto('/login');
    }
</script>

<svelte:head>
    <title>Sign up | All About Games</title>
</svelte:head>

<section class="w-full flex justify-center items-center px-4">
    <UserForm
        bind:thisForm={signupForm}
        submitText="Sign up"
        errorMessage={error?.message}
        onSubmit={signup}
    >
        <InputField
            name="username"
            label="Username"
            placeholder="johnnyDoe"
            title="Must be between 3-20 alphanumerical characters"
            pattern={userFieldsRegex.username}
            errorMessage={error?.fields?.username}
            required
            requiredMarker
        />
        <InputField
            name="firstName"
            label="First name"
            placeholder="John"
            title="Must be between 1-30 characters"
            pattern={userFieldsRegex.firstName}
            errorMessage={error?.fields?.firstName}
            required
            requiredMarker
        />
        <InputField
            name="lastName"
            label="Last name"
            placeholder="Doe"
            title="Must be between 1-30 characters"
            pattern={userFieldsRegex.lastName}
            errorMessage={error?.fields?.lastName}
            required
            requiredMarker
        />
        <InputField
            type="email"
            name="email"
            label="Email"
            placeholder="john@doe.com"
            title="Must be a valid email address"
            pattern={userFieldsRegex.email}
            errorMessage={error?.fields?.email}
            required
            requiredMarker
        />
        <InputField
            type="password"
            name="password"
            label="Password"
            placeholder="Password123!"
            title="Must be between 1-50 characters"
            pattern={userFieldsRegex.password}
            errorMessage={error?.fields?.password}
            required
            requiredMarker
        />
        <p
            class="text-center text-sm text-black"
            slot="after-submit-button"
        >
            Already have an account? <a class="text-blue-800 hover:underline" href="/login">Log in</a>
        </p>
    </UserForm>
</section>
