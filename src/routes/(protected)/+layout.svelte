<script>
    import logo from '$lib/assets/images/logo.png';
    import SearchIcon from '$lib/assets/icons/SearchIcon.svelte';
    import CalendarIcon from '$lib/assets/icons/CalendarIcon.svelte';
    import ClockIcon from '$lib/assets/icons/ClockIcon.svelte';
    import PlayIcon from '$lib/assets/icons/PlayIcon.svelte';
    import TickIcon from '$lib/assets/icons/TickIcon.svelte';
    import PauseIcon from '$lib/assets/icons/PauseIcon.svelte';
    import TrashIcon from '$lib/assets/icons/TrashIcon.svelte';
    import CogIcon from '$lib/assets/icons/CogIcon.svelte';
    import ExitIcon from '$lib/assets/icons/ExitIcon.svelte';
    import BurgerMenu from '$lib/assets/icons/BurgerMenu.svelte';
    import XIcon from '$lib/assets/icons/XIcon.svelte';

    let hideSidebar = true;
</script>

<nav class="flex fixed items-center h-14 w-full z-10 bg-slate-900 p-4 pl-8 lg:hidden">
    <button on:click={hideSidebar = false}>
        <BurgerMenu />
    </button>
</nav>
<section class="flex">
    <aside
        class="fixed min-h-screen h-full w-72 top-0 left-0 overflow-auto z-30 bg-slate-900 lg:block"
        class:hidden={hideSidebar}
    >
        <section class="flex justify-between p-4 pb-2">
            <a href="/search" class="w-28 md:w-40">
                <img src={logo} alt="All About Games">
            </a>
            <button
                class="h-min lg:hidden"
                on:click={hideSidebar = true}
            >
                <XIcon />
            </button>
        </section>
        <ul class="p-4 pt-0">
            <li class="my-2">
                <a
                    href="/search" class="flex items-center rounded-lg p-2 ml-3 hover:bg-gray-700"
                    class:bg-gray-700={window.location.pathname.endsWith('/search')}
                >
                    <SearchIcon />
                    <span class="ml-3">Search</span>
                </a>
            </li>
            <li class="my-2">
                <a
                    href="/release-calendar" class="flex items-center rounded-lg p-2 ml-3 hover:bg-gray-700"
                    class:bg-gray-700={window.location.pathname.endsWith('/release-calendar')}
                >
                    <CalendarIcon />
                    <span class="ml-3">Release Calendar</span>
                </a>
            </li>
            <div class="h-[1px] w-[90%] bg-gray-600 mx-auto my-6"></div>
            <li>
                <span class="ml-5 text-gray-500 text-sm font-bold">My Lists</span>
            </li>
            <li class="my-2">
                <a
                    href="/want-to-play" class="flex items-center rounded-lg p-2 ml-3 hover:bg-gray-700"
                    class:bg-gray-700={window.location.pathname.endsWith('/want-to-play')}
                >
                    <ClockIcon />
                    <span class="ml-3">Want To Play</span>
                </a>
            </li>
            <li class="my-2">
                <a
                    href="/playing" class="flex items-center rounded-lg p-2 ml-3 hover:bg-gray-700"
                    class:bg-gray-700={window.location.pathname.endsWith('/playing')}
                >
                    <PlayIcon />
                    <span class="ml-3">Playing</span>
                </a>
            </li>
            <li class="my-2">
                <a
                    href="/completed" class="flex items-center rounded-lg p-2 ml-3 hover:bg-gray-700"
                    class:bg-gray-700={window.location.pathname.endsWith('/completed')}
                >
                    <TickIcon />
                    <span class="ml-3">Completed</span>
                </a>
            </li>
            <li class="my-2">
                <a
                    href="/paused" class="flex items-center rounded-lg p-2 ml-3 hover:bg-gray-700"
                    class:bg-gray-700={window.location.pathname.endsWith('/paused')}
                >
                    <PauseIcon />
                    <span class="ml-3">Paused</span>
                </a>
            </li>
            <li class="my-2">
                <a
                    href="/dropped" class="flex items-center rounded-lg p-2 ml-3 hover:bg-gray-700"
                    class:bg-gray-700={window.location.pathname.endsWith('/dropped')}
                >
                    <TrashIcon />
                    <span class="ml-3">Dropped</span>
                </a>
            </li>
            <div class="h-[1px] w-[90%] bg-gray-600 mx-auto my-6"></div>
            <li class="my-2">
                <a
                    href="/settings" class="flex items-center rounded-lg p-2 ml-3 hover:bg-gray-700"
                    class:bg-gray-700={window.location.pathname.endsWith('/settings')}
                >
                    <CogIcon />
                    <span class="ml-3">Settings</span>
                </a>
            </li>
            <li class="my-2">
                <a href="/logout" class="flex items-center rounded-lg p-2 ml-3 hover:bg-gray-700" data-sveltekit-preload-data="tap">
                    <ExitIcon color="#F43F5E" />
                    <span class="ml-3 text-rose-500">Log Out</span>
                </a>
            </li>
        </ul>
    </aside>
    <button
        class="fixed w-screen h-screen z-20 bg-black opacity-30 overscroll-contain lg:hidden"
        class:hidden={hideSidebar}
        on:click={hideSidebar = true}
        aria-label="Hide sibebar"
    ></button>
    <section class="min-h-screen h-full w-full flex justify-center items-center lg:pl-72">
        <slot />
    </section>
</section>
