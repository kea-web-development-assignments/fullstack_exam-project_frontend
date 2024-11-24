<script>
    import { goto } from '$app/navigation';
	import { InputField } from '$lib/components';
	import { userFieldsLookup } from '$lib/utils/validator.js';
    import { PUBLIC_API_URL } from '$env/static/public';
    import Form from '$lib/components/Form.svelte';

	let resetPasswordForm;
	let error = {};

    async function resetPassword(event) {
        error = {};
		const { email } = Object.fromEntries(new FormData(resetPasswordForm));

        let data;
        try {
            const response = await fetch(`${PUBLIC_API_URL}/forgot-password`, {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
			data = await response.json();
        } catch (err) {
            console.error('Failed to reset password:', err);
            alert('Something went wrong with resetting password, try again later');            
            return;
        }

		if(data.error) {
			error = data.error;
			return;
		}

		alert(`An email with a link to reset your password has been sent to ${email}, check your spam folder if you can't find it in your inbox.`);
        goto('/login');
    }
</script>

<svelte:head>
	<title>Forgot password | All About Games</title>
</svelte:head>

<section class="w-full flex justify-center items-center px-4">
	<Form
		bind:thisForm={resetPasswordForm}
		submitText="Reset password"
		errorMessage={error?.message}
		onSubmit={resetPassword}
	>
        <InputField
			type="email"
			name="email"
			label="Email"
			placeholder="john@doe.com"
			title="Must be a valid email address"
			pattern={userFieldsLookup.email.regex}
			errorMessage={error?.fields?.email}
			required
		/>
	</Form>
</section>
