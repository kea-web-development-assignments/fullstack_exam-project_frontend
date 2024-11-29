<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
	import { InputField } from '$lib/components';
	import { userFieldsLookup } from '$lib/utils/validator.js';
    import { PUBLIC_API_URL } from '$env/static/public';
    import Form from '$lib/components/Form.svelte';

	let updateForm;
	let deleteForm;

	let updateError = {};
	let deleteError = {};

    async function update(event) {
        updateError = {};
		const user = Object.fromEntries(new FormData(updateForm));

        let data;
        try {
            const response = await fetch(`${PUBLIC_API_URL}/me`, {
                method: 'PATCH',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
			data = await response.json();
        } catch (err) {
            console.error('Failed to update account:', err);
            alert('Something went wrong with updating account, try again later');            
            return;
        }

		if(data.error) {
			updateError = data.error;
			return;
		}

        alert('Your account has been updated!');
    }
    async function deleteAccount(event) {
        deleteError = {};
		const { password } = Object.fromEntries(new FormData(deleteForm));

        let data;
        try {
            const response = await fetch(`${PUBLIC_API_URL}/me?password=${password}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
			data = await response.json();
        } catch (err) {
            console.error('Failed to delete account:', err);
            alert('Something went wrong with deleting account, try again later');            
            return;
        }

		if(data.error) {
			deleteError = data.error;
			return;
		}

        alert('Your account has been deleted.');
        goto('/logout');
    }
</script>

<svelte:head>
	<title>Settings | All About Games</title>
</svelte:head>

<section class="w-full flex flex-col justify-center items-center p-4">
    <h2 class="max-w-[24rem] w-full text-4xl p-4 pl-0">Update account</h2>
    <Form
        bind:thisForm={updateForm}
        submitText="Update"
        errorMessage={updateError?.message}
        onSubmit={update}
    >
        <InputField
            name="username"
            label="Username"
            placeholder="johnnyDoe"
            title="Must be between 3-20 alphanumerical characters"
            value={$page.data?.user?.username}
            errorMessage={updateError?.fields?.username}
        />
        <InputField
            name="firstName"
            label="First name"
            placeholder="John"
            title="Must be between 1-30 characters"
            pattern={userFieldsLookup.firstName.regex}
            value={$page.data?.user?.firstName}
            errorMessage={updateError?.fields?.firstName}
        />
        <InputField
            name="lastName"
            label="Last name"
            placeholder="Doe"
            title="Must be between 1-30 characters"
            pattern={userFieldsLookup.lastName.regex}
            value={$page.data?.user?.lastName}
            errorMessage={updateError?.fields?.lastName}
        />
        <InputField
            type="email"
            name="email"
            label="Email"
            placeholder="john@doe.com"
            title="Must be a valid email address"
            pattern={userFieldsLookup.email.regex}
            value={$page.data?.user?.email}
            errorMessage={updateError?.fields?.email}
        />
        <InputField
            type="password"
            name="password"
            label="Password"
            placeholder="Password123!"
            title="Must be between 1-50 characters"
            pattern={userFieldsLookup.password.regex}
            errorMessage={updateError?.fields?.password}
        />
        <InputField
            type="password"
            name="oldPassword"
            label="Old password"
            placeholder="Password1"
        />
    </Form>
    <h2 class="max-w-[24rem] w-full text-4xl mt-8 p-4 pl-0">Delete account</h2>
    <Form
        bind:thisForm={deleteForm}
        submitText="Delete"
        errorMessage={deleteError?.message}
        onSubmit={deleteAccount}
        redSubmitButton
    >
        <InputField
            type="password"
            name="password"
            label="Password"
            placeholder="Password123!"
            errorMessage={deleteError?.fields?.password}
        />
    </Form>
</section>
