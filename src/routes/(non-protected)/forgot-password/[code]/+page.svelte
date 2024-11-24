<script>
	import { page } from '$app/stores';
    import { goto } from '$app/navigation';
	import { InputField } from '$lib/components';
	import { userFieldsLookup } from '$lib/utils/validator.js';
    import { PUBLIC_API_URL } from '$env/static/public';
    import Form from '$lib/components/Form.svelte';

	let updatePasswordForm;
	let error = {};

    async function updatePassword(event) {
        error = {};
		const { password } = Object.fromEntries(new FormData(updatePasswordForm));

        let data;
        try {
            const response = await fetch(`${PUBLIC_API_URL}/forgot-password/${$page.params.code}`, {
                method: 'POST',
                body: JSON.stringify({ password }),
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

        alert('Your password has been reset!');
        goto('/login');
    }
</script>

<svelte:head>
	<title>Reset password | All About Games</title>
</svelte:head>

<section class="w-full flex justify-center items-center px-4">
	<Form
		bind:thisForm={updatePasswordForm}
		submitText="Update password"
		errorMessage={error?.message}
		onSubmit={updatePassword}
	>
        <InputField
			type="password"
			name="password"
			label="Password"
			placeholder="Password123!"
			title="Must be between 1-50 characters"
			pattern={userFieldsLookup.password.regex}
			errorMessage={error?.fields?.password}
			required
		/>
    </Form>
</section>
