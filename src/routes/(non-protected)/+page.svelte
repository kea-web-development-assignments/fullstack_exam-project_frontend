<script>
    import logo from '$lib/assets/images/logo.png';
</script>

<svelte:head>
	<title>All About Games</title>
</svelte:head>

<section class="max-w-[1200px]">
    <section class="flex flex-col-reverse justify-center items-center gap-8 p-3 md:flex-row md:p-8">
        <section class="flex-1 flex flex-col justify-center gap-8">
            <h1 class="text-7xl font-bold">Welcome to</h1>
            <p class="text-lg">Your ultimate gaming companion! Track your gaming journey by organizing completed, in-progress, and wish-listed games all in one place. Discover detailed information on thousands of games, from gameplay images to release dates. Stay ahead of the curve with our up-to-date calendar of upcoming releases, ensuring you never miss the next big title. Whether you’re a casual gamer or a hardcore enthusiast, AllAboutGames is here to enhance your gaming experience. Join us today and level up your game knowledge!</p>
            <section class="flex items-center gap-8 p-4">
                <a
                    class="bg-teal-400 text-black text-xl px-6 py-3 rounded-full"
                    href="/login"
                >
                    Login
                </a>
                <a
                    class="bg-gray-700 text-xl px-6 py-3 rounded-full"
                    href="/signup"
                >
                    Sign Up
                </a>
            </section>
        </section>
        <section class="flex-1 max-w-[500px]">
            <img src={logo} alt="All About Games">
        </section>
    </section>
</section>
