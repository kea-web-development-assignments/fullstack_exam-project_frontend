<script>
    import { goto } from '$app/navigation';
    import { InputField, UserForm } from '$lib/components';
    import { userFieldsRegex } from '$lib/utils/validator.js';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { jwtDecode } from 'jwt-decode';

    let loginForm;
    let error = {};

    async function login(event) {
        error = {};
        const credentials = Object.fromEntries(new FormData(loginForm));

        let data;
        try {
            const response = await fetch(`${PUBLIC_API_URL}/login`, {
                method: 'POST',
                body: JSON.stringify(credentials),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            data = await response.json();
        } catch (err) {
            console.error('Failed to login:', err);
            alert('Something went wrong with login, try again later');            
            return;
        }

        if(data.error) {
            error = data.error;
            return;
        }

        const { sub: id, email, username, firstName, lastName, role } = jwtDecode(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', id);
        localStorage.setItem('email', email);
        localStorage.setItem('username', username);
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('role', role);

        goto('/search');
    }
</script>

<svelte:head>
    <title>Login | All About Games</title>
</svelte:head>

<section class="w-full flex justify-center items-center px-4">
    <UserForm
        bind:thisForm={loginForm}
        submitText="Log in"
        errorMessage={error?.message}
        onSubmit={login}
    >
        <InputField
            type="email"
            name="email"
            label="Email"
            placeholder="john@doe.com"
            title="Must be a valid email address"
            pattern={userFieldsRegex.email}
            errorMessage={error?.fields?.email}
            required
        />
        <InputField
            type="password"
            name="password"
            label="Password"
            placeholder="Password123!"
            errorMessage={error?.fields?.password}
            required
        />
        <p class="text-end text-sm -mt-2">
            <a
                class="text-blue-800 hover:underline"
                href="/forgot-password"
            >
                Forgot password?
            </a>
        </p>
        <p
            class="text-center text-sm text-black"
            slot="after-submit-button"
        >
            Don't have an account? <a class="text-blue-800 hover:underline" href="/signup">Sign up</a>
        </p>
    </UserForm>
</section>
